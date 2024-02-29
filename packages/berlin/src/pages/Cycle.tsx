// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { GetCycleResponse, fetchCycle, fetchUserVotes, postVotes } from 'api';

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
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/backButton';
import Button from '../components/button';
import CycleColumns from '../components/cycleColumns';
import NewOptionCard from '../components/newOptionCard';

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
  const [localUserVotes, setLocalUserVotes] = useState<
    ResponseUserVotesType | { optionId: string; numOfVotes: number }[]
  >([]);

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
      if (body?.errors.length) {
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
    handleSaveVotes(userVotes, localUserVotes, cycleId, mutateVotes);
  };

  const currentCycle = cycle?.forumQuestions[0];

  const formattedWelcomeText = (cycle: GetCycleResponse | undefined | null) => {
    if (cycle?.status === 'OPEN') {
      return "It's time to give your hearts away...";
    } else if (cycle?.status === 'UPCOMING') {
      return "It's almost time to give your hearts away...";
    } else {
      return 'Vote has ended.';
    }
  };

  const sortedOptions = useMemo(() => {
    const sorted = [...(currentCycle?.questionOptions ?? [])].sort(
      (a, b) => b.voteScore - a.voteScore,
    );
    return sorted;
  }, [currentCycle?.questionOptions]);

  return (
    <FlexColumn $gap="2rem">
      <FlexColumn>
        <BackButton />
        <Subtitle>
          Welcome {user?.username}! {formattedWelcomeText(cycle)}
        </Subtitle>
        <Title>{currentCycle?.questionTitle}</Title>
        <Body>
          {cycleState === 'closed'
            ? 'Vote has ended.'
            : cycleState === 'upcoming'
              ? `Vote opens in: ${formattedTime}`
              : `Vote closes in: ${formattedTime}`}
        </Body>
        <Body>
          You have <Bold>{initialHearts}</Bold> total hearts
        </Body>
        <Body>
          <Bold>Remaining hearts ({avaliableHearts}) :</Bold>
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
        <FlexColumn>
          <CycleColumns />
          {sortedOptions.map((option) => {
            const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
            const numOfVotes = userVote ? userVote.numOfVotes : 0;
            return (
              <NewOptionCard
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
