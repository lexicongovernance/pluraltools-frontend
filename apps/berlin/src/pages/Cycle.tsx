// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { QuestionOption, fetchCycle, fetchUserVotes, postVotes } from 'api';

// Hooks
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';

// Utils
import { handleSaveVotes, handleUnvote, handleVote } from '../utils/voting';

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
import BackButton from '../components/backButton';
import Button from '../components/button';
import CycleColumns from '../components/cycleColumns';
import OptionCard from '../components/optionCard';

type Order = 'asc' | 'desc';
type LocalUserVotes = ResponseUserVotesType | { optionId: string; numOfVotes: number }[];

const initialHearts = 20;

function Cycle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { eventId, cycleId } = useParams();
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
  const { avaliableHearts, setAvaliableHearts } = useAppStore((state) => state);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);
  const [localUserVotes, setLocalUserVotes] = useState<LocalUserVotes>([]);
  const [sorting, setSorting] = useState<{ column: string; order: Order }>({
    column: 'pluralityScore',
    order: 'desc',
  });

  useEffect(() => {
    if (cycle && cycle.startAt && cycle.endAt) {
      setStartAt(cycle.startAt);
      setEndAt(cycle.endAt);
    }
  }, [cycle]);

  const { formattedTime, cycleState } = useCountdown(startAt, endAt);

  const updateVotesAndHearts = (votes: ResponseUserVotesType) => {
    const givenVotes = votes
      .map((option) => option.numOfVotes)
      .reduce((prev, curr) => prev + curr, 0);

    setAvaliableHearts(initialHearts - givenVotes);
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
      updateVotesAndHearts(userVotes);
    }
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
    handleVote(optionId, avaliableHearts, setAvaliableHearts, setLocalUserVotes);
  };

  const handleUnvoteWrapper = (optionId: string) => {
    handleUnvote(optionId, avaliableHearts, setAvaliableHearts, setLocalUserVotes);
  };

  const handleSaveVotesWrapper = () => {
    handleSaveVotes(userVotes, localUserVotes, mutateVotes);
  };

  const currentCycle = cycle?.forumQuestions[0];

  const sortByAuthor = (a: QuestionOption, b: QuestionOption, order: Order) => {
    const authorA = (a.user.lastName || a.user.username).toUpperCase();
    const authorB = (b.user.lastName || b.user.username).toUpperCase();
    return order === 'desc' ? authorB.localeCompare(authorA) : authorA.localeCompare(authorB);
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

  const sortByVoteScore = (a: QuestionOption, b: QuestionOption, order: Order) => {
    return order === 'desc' ? b.voteScore - a.voteScore : a.voteScore - b.voteScore;
  };

  const sortedOptions = useMemo(() => {
    const { column, order } = sorting;
    const sorted = [...(currentCycle?.questionOptions ?? [])].sort((a, b) => {
      switch (column) {
        case 'author':
          return sortByAuthor(a, b, order);
        case 'affiliation':
          return sortByAffiliation(a, b, order);
        case 'numOfVotes':
          return sortByNumOfVotes(a, b, order, localUserVotes);
        default:
          return sortByVoteScore(a, b, order);
      }
    });
    return sorted;
  }, [currentCycle?.questionOptions, localUserVotes, sorting]);

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
        <Body>
          {cycleState === 'closed'
            ? 'Vote has ended.'
            : cycleState === 'upcoming'
              ? `Vote opens in: ${formattedTime}`
              : `Vote closes in: ${formattedTime}`}
        </Body>
        <Body>
          You have <Bold>{avaliableHearts}</Bold> hearts left to give away:
        </Body>
        <FlexRow $gap="0.25rem" $wrap>
          {Array.from({ length: initialHearts }).map((_, id) => (
            <img
              key={id}
              src={id < avaliableHearts ? '/icons/heart-full.svg' : '/icons/heart-empty.svg'}
              height={24}
              width={24}
              alt={id < avaliableHearts ? 'Full Heart' : 'Empty Heart'}
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
                onUnvote={() => handleUnvoteWrapper(option.id)}
              />
            );
          })}
        </FlexColumn>
      ) : (
        <Body>
          <i>No options to show...</i>
        </Body>
      )}
      {cycle?.status === 'CLOSED' && currentCycle?.questionOptions.length && (
        <Button
          onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/results`)}
          $color="secondary"
        >
          See results
        </Button>
      )}
    </FlexColumn>
  );
}

export default Cycle;
