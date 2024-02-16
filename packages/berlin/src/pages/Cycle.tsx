// React and third-party libraries
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

// API
import { fetchCycle, fetchUserVotes, postVote } from 'api';

// Hooks
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Grid } from '../components/containers/Grid.styled';
import { ResponseUserVotesType } from '../types/CycleType';
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
    queryKey: ['cycle'],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
  });

  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(user?.id || '', cycleId || ''),
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

  const { mutate: mutateVote } = useMutation({
    mutationFn: postVote,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['user-votes'] });
      }
    },
  });

  const handleSaveVotes = () => {
    try {
      if (userVotes) {
        const serverVotesMap = new Map(userVotes.map((vote) => [vote.optionId, vote]));

        for (const localVote of localUserVotes) {
          const matchingServerVote = serverVotesMap.get(localVote.optionId);

          if (!matchingServerVote) {
            mutateVote({ optionId: localVote.optionId, numOfVotes: localVote.numOfVotes });
          } else if (matchingServerVote.numOfVotes !== localVote.numOfVotes) {
            mutateVote({ optionId: localVote.optionId, numOfVotes: localVote.numOfVotes });
          }
        }
        toast.success('Votes saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save votes, please try again');
      console.error('Error saving votes:', error);
    }
  };

  const currentCycle = cycle?.forumQuestions[0];
  return (
    <FlexColumn $gap="2rem">
      <FlexColumn>
        <BackButton />
        <Title>{currentCycle?.questionTitle}</Title>
        <Body>{formattedTime}</Body>
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
      {currentCycle?.questionOptions && (
        <Grid $columns={2} $colgap="1.5rem">
          {currentCycle.questionOptions.map((option) => {
            const userVote = localUserVotes.find((vote) => vote.optionId === option.id);
            const numOfVotes = userVote ? userVote.numOfVotes : 0;
            return (
              <OptionCard
                key={option.id}
                title={option.optionTitle}
                body={option.optionSubTitle}
                avaliableHearts={avaliableHearts}
                numOfVotes={numOfVotes}
                onVote={() => handleVote(option.id)}
                onUnvote={() => handleUnvote(option.id)}
              />
            );
          })}
        </Grid>
      )}
      <Button onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/results`)}>
        See results
      </Button>
    </FlexColumn>
  );
}

export default Cycle;
