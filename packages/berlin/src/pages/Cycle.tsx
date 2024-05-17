// React and third-party libraries
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { QuestionOption, fetchCycle, fetchUserVotes, postVotes } from 'api';

// Hooks
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';

// Utils
import {
  handleSaveVotes,
  handleAvailableHearts,
  handleLocalUnVote,
  handleLocalVote,
} from '../utils/voting';

// Types
import { ResponseUserVotesType } from '../types/CycleType';

// Store
import { useAppStore } from '../store';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/back-button';
import Button from '../components/button';
import CycleColumns from '../components/columns/cycle-columns';
import OptionCard from '../components/option-card';
import { FIVE_MINUTES_IN_SECONDS, INITIAL_HEARTS } from '../utils/constants';

type Order = 'asc' | 'desc';
type LocalUserVotes = ResponseUserVotesType | { optionId: string; numOfVotes: number }[];

function Cycle() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { cycleId } = useParams();
  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
  });
  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(cycleId || ''),
    enabled: !!user?.id && !!cycleId,
    retry: false,
  });
  const availableHearts =
    useAppStore((state) => state.availableHearts[cycle?.forumQuestions[0].id || '']) ??
    INITIAL_HEARTS;
  const setAvailableHearts = useAppStore((state) => state.setAvailableHearts);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);
  const [localUserVotes, setLocalUserVotes] = useState<LocalUserVotes>([]);
  const [sorting, setSorting] = useState<{ column: string; order: Order }>({
    column: 'numOfVotes',
    order: 'desc',
  });

  useEffect(() => {
    if (cycle && cycle.startAt && cycle.endAt) {
      setStartAt(cycle.startAt);
      setEndAt(cycle.endAt);
    }
  }, [cycle]);

  const { formattedTime, cycleState, time } = useCountdown(startAt, endAt);

  const voteInfo = useMemo(() => {
    switch (cycleState) {
      case 'closed':
        return 'Vote has ended.';
      case 'upcoming':
        return `Vote opens in: ${formattedTime}`;
      case 'open':
        if (time && time <= FIVE_MINUTES_IN_SECONDS) {
          return `Vote closes in: ${formattedTime}`;
        } else if (time === 0) {
          return 'Vote has ended.';
        }
        return '';
      default:
        return '';
    }
  }, [cycleState, time, formattedTime]);

  const updateInitialVotesAndHearts = (votes: ResponseUserVotesType) => {
    const givenVotes = votes
      .map((option) => option.numOfVotes)
      .reduce((prev, curr) => prev + curr, 0);

    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id || '',
      hearts: Math.max(0, INITIAL_HEARTS - givenVotes),
    });

    setLocalUserVotes(votes);
  };

  const votesAreDifferent = useMemo(() => {
    return (
      JSON.stringify(
        localUserVotes.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        })),
      ) !==
      JSON.stringify(
        userVotes?.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        })),
      )
    );
  }, [localUserVotes, userVotes]);

  useEffect(() => {
    if (userVotes?.length) {
      updateInitialVotesAndHearts(userVotes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVotes]);

  const { mutate: mutateVotes } = useMutation({
    mutationFn: postVotes,
    onSuccess: (body) => {
      if (body?.errors?.length) {
        toast.error(`Failed to save votes, ${body?.errors[0].message}`);
      } else if (body?.data.length) {
        queryClient.invalidateQueries({ queryKey: ['votes', cycleId] });
        // this is to update the plural scores in each option
        queryClient.invalidateQueries({ queryKey: ['cycles', cycleId] });
        toast.success('Votes saved successfully!');
      }
    },
  });

  const handleVoteWrapper = (optionId: string) => {
    if (availableHearts === 0) {
      toast.error('No hearts left to give');
      return;
    }

    setLocalUserVotes((prevLocalUserVotes) => handleLocalVote(optionId, prevLocalUserVotes));
    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id ?? '',
      hearts: handleAvailableHearts(availableHearts, 'vote'),
    });
  };

  const handleUnVoteWrapper = (optionId: string) => {
    if (availableHearts === INITIAL_HEARTS) {
      toast.error('No votes to left to remove');
      return;
    }

    setLocalUserVotes((prevLocalUserVotes) => handleLocalUnVote(optionId, prevLocalUserVotes));
    setAvailableHearts({
      questionId: cycle?.forumQuestions[0].id ?? '',
      hearts: handleAvailableHearts(availableHearts, 'unVote'),
    });
  };

  const handleSaveVotesWrapper = () => {
    if (cycle?.status === 'OPEN') {
      handleSaveVotes(userVotes, localUserVotes, mutateVotes);
    } else {
      toast.error('Cycle is not open');
    }
  };

  const currentCycle = cycle?.forumQuestions[0];

  const sortByLead = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const leadA = (a.user.lastName || a.user.username).toUpperCase();
    const leadB = (b.user.lastName || b.user.username).toUpperCase();
    return order === 'desc' ? leadB.localeCompare(leadA) : leadA.localeCompare(leadB);
  };

  const sortByAffiliation = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const affiliationA = a.user.group.name.toUpperCase();
    const affiliationB = b.user.group.name.toUpperCase();
    return order === 'desc'
      ? affiliationB.localeCompare(affiliationA)
      : affiliationA.localeCompare(affiliationB);
  };

  const sortByNumOfVotes = (
    a: QuestionOption,
    b: QuestionOption,
    order: Order,
    localUserVotes: LocalUserVotes,
  ) => {
    const votesA = localUserVotes.find((vote) => vote.optionId === a.id)?.numOfVotes || 0;
    const votesB = localUserVotes.find((vote) => vote.optionId === b.id)?.numOfVotes || 0;
    return order === 'desc' ? votesB - votesA : votesA - votesB;
  };

  const sortedOptions = useMemo(() => {
    const { column, order } = sorting;
    const sorted = [...(currentCycle?.questionOptions ?? [])].sort((a, b) => {
      switch (column) {
        case 'lead':
          return sortByLead(a, b, order);
        case 'affiliation':
          return sortByAffiliation(a, b, order);
        default:
          return sortByNumOfVotes(a, b, order, localUserVotes);
      }
    });
    return sorted;
    // ? localUserVotes removed from deps array so it does not triggers a sorting on each vote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCycle?.questionOptions, sorting]);

  const handleColumnClick = (column: string) => {
    setSorting((prevSorting) => ({
      column,
      order: prevSorting.column === column && prevSorting.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <FlexColumn $gap="2rem">
      <FlexColumn>
        <BackButton />
        <Title>{currentCycle?.questionTitle}</Title>
        <Body>{voteInfo}</Body>
        <Body>
          You have <Bold>{availableHearts}</Bold> hearts left to give away:
        </Body>
        <FlexRow $gap="0.25rem" $wrap>
          {Array.from({ length: INITIAL_HEARTS }).map((_, id) => (
            <img
              key={id}
              src={id < availableHearts ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
              height={24}
              width={24}
              alt={id < availableHearts ? 'Full Heart' : 'Empty Heart'}
            />
          ))}
        </FlexRow>
        <Button onClick={handleSaveVotesWrapper} disabled={!votesAreDifferent}>
          Save all votes
        </Button>
      </FlexColumn>
      {currentCycle?.questionOptions.length ? (
        <FlexColumn $gap="0">
          <CycleColumns onColumnClick={handleColumnClick} />
          {sortedOptions.map((option) => {
            const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
            const numOfVotes = userVote ? userVote.numOfVotes : 0;
            return (
              <OptionCard
                key={option.id}
                option={option}
                numOfVotes={numOfVotes}
                onVote={() => handleVoteWrapper(option.id)}
                onUnVote={() => handleUnVoteWrapper(option.id)}
              />
            );
          })}
        </FlexColumn>
      ) : (
        <Body>
          <i>No options to show...</i>
        </Body>
      )}
    </FlexColumn>
  );
}

export default Cycle;
