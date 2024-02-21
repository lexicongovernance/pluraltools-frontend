// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { PostVotesRequest, fetchCycle, fetchUserVotes, postVotes } from 'api';

// Hooks
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { ResponseUserVotesType } from '../types/CycleType';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/backButton';
import Button from '../components/button';
import OptionCard from '../components/optionCard';

const initialHearts = 20;

function Cycle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { eventId, cycleId } = useParams();
  const { data: cycle } = useQuery({
    queryKey: ['cycle', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
  });

  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(cycleId || ''),
    enabled: !!user?.id && !!cycleId,
    retry: false,
  });

  const [avaliableHearts, setAvaliableHearts] = useState(initialHearts);
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

  const { formattedTime } = useCountdown(startAt, endAt);

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

  const handleVote = (optionId: string) => {
    if (avaliableHearts > 0) {
      setLocalUserVotes((prevLocalUserVotes) => {
        const temp = prevLocalUserVotes.find((x) => x.optionId === optionId);
        if (!temp) {
          return [...prevLocalUserVotes, { optionId, numOfVotes: 1 }];
        }
        const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
          if (prevLocalUserVote.optionId === optionId) {
            return { ...prevLocalUserVote, numOfVotes: prevLocalUserVote.numOfVotes + 1 };
          }
          return prevLocalUserVote;
        });
        return updatedLocalVotes;
      });
      setAvaliableHearts((prevAvaliableHearts) => Math.max(0, prevAvaliableHearts - 1));
    }
  };

  const handleUnvote = (optionId: string) => {
    setLocalUserVotes((prevLocalUserVotes) => {
      const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
        if (prevLocalUserVote.optionId === optionId) {
          const newNumOfVotes = Math.max(0, prevLocalUserVote.numOfVotes - 1);
          return { ...prevLocalUserVote, numOfVotes: newNumOfVotes };
        }
        return prevLocalUserVote;
      });

      return updatedLocalVotes;
    });

    setAvaliableHearts((prevAvaliableHearts) => Math.min(initialHearts, prevAvaliableHearts + 1));
  };

  const { mutate: mutateVotes } = useMutation({
    mutationFn: postVotes,
    onSuccess: (body) => {
      if (body?.errors.length) {
        toast.error(`Failed to save votes, ${body?.errors[0].message}`);
      } else if (body?.data.length) {
        queryClient.invalidateQueries({ queryKey: ['votes', cycleId] });
        // this is to update the plural scores in each option
        queryClient.invalidateQueries({ queryKey: ['cycle', cycleId] });
        toast.success('Votes saved successfully!');
      }
    },
  });

  const handleSaveVotes = () => {
    try {
      if (userVotes) {
        const serverVotesMap = new Map(userVotes.map((vote) => [vote.optionId, vote]));
        const mutateVotesReq: PostVotesRequest = {
          cycleId: cycleId || '',
          votes: [],
        };

        for (const localVote of localUserVotes) {
          const matchingServerVote = serverVotesMap.get(localVote.optionId);

          if (!matchingServerVote) {
            mutateVotesReq.votes.push({
              optionId: localVote.optionId,
              numOfVotes: localVote.numOfVotes,
            });
          } else if (matchingServerVote.numOfVotes !== localVote.numOfVotes) {
            mutateVotesReq.votes.push({
              optionId: localVote.optionId,
              numOfVotes: localVote.numOfVotes,
            });
          }
        }

        mutateVotes(mutateVotesReq);
      }
    } catch (error) {
      toast.error('Failed to save votes, please try again');
      console.error('Error saving votes:', error);
    }
  };

  const currentCycle = cycle?.forumQuestions[0];

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
        <Subtitle>Welcome {user?.username}! It's time to give your hearts away...</Subtitle>
        <Title>{currentCycle?.questionTitle}</Title>
        <Body>
          {formattedTime === 'Cycle has expired'
            ? 'Vote has expired'
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
        <Button onClick={handleSaveVotes} disabled={!votesAreDifferent}>
          Save all votes
        </Button>
      </FlexColumn>
      {currentCycle?.questionOptions.length ? (
        <FlexColumn>
          {sortedOptions.map((option) => {
            const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
            const numOfVotes = userVote ? userVote.numOfVotes : 0;
            return (
              <OptionCard
                key={option.id}
                id={option.id}
                title={option.optionTitle}
                body={option.optionSubTitle}
                avaliableHearts={avaliableHearts}
                pluralityScore={option.voteScore}
                numOfVotes={numOfVotes}
                onVote={() => handleVote(option.id)}
                onUnvote={() => handleUnvote(option.id)}
              />
            );
          })}
        </FlexColumn>
      ) : (
        <Body>
          <i>No options to show...</i>
        </Body>
      )}

      {/* // TODO: This should also check if cycle is open */}
      {currentCycle?.questionOptions.length ? (
        <Button
          onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/results`)}
          $color="secondary"
        >
          See results
        </Button>
      ) : null}
    </FlexColumn>
  );
}

export default Cycle;
