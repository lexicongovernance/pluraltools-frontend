import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import fetchUserVotes from '../api/fetchUserVotes';
import postVote from '../api/postVote';
import Button from '../components/button';
import Countdown from '../components/countdown';
import Option from '../components/option';
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import { ResponseUserVotesType } from '../types/CycleType';
import fetchCycle from '../api/fetchCycle';
import { fetchForumQuestionHearts } from '../api';

function Vote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);

  const { cycleId, eventId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    retry: false,
  });

  const forumQuestion = cycle?.forumQuestions?.[0];

  const {
    data: userVotes,
    isLoading: isLoadingUserVotes,
    isError: isErrorUserVotes,
  } = useQuery({
    queryKey: ['question', forumQuestion?.id, 'votes'],
    queryFn: () => fetchUserVotes(user?.id || '', forumQuestion?.id || ''),
    enabled: !!user?.id && !!forumQuestion?.id,
    retry: false,
  });

  const { data: initialHearts } = useQuery({
    queryKey: ['question', forumQuestion?.id, 'hearts'],
    queryFn: () => fetchForumQuestionHearts(forumQuestion?.id || ''),
    enabled: !!user?.id && !!forumQuestion?.id,
    retry: false,
  });

  const [availableHearts, setAvailableHearts] = useState(0);
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

  const updateVotesAndHearts = (votes: ResponseUserVotesType, initialHearts: number) => {
    const givenVotes = votes
      .map((option) => option.numOfVotes)
      .reduce((prev, curr) => prev + curr, 0);
    setAvailableHearts(initialHearts - givenVotes);
    setLocalUserVotes(votes);
  };

  const votesAreDifferent = useMemo(() => {
    return (
      JSON.stringify(
        localUserVotes.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        }))
      ) !==
      JSON.stringify(
        userVotes?.map((vote) => ({
          optionId: vote.optionId,
          numOfVotes: vote.numOfVotes,
        }))
      )
    );
  }, [localUserVotes, userVotes]);

  useEffect(() => {
    if (userVotes && initialHearts) {
      updateVotesAndHearts(userVotes, initialHearts);
    }
  }, [userVotes, initialHearts]);

  const handleVote = (optionId: string) => {
    if (availableHearts > 0) {
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
      setAvailableHearts((prevAvailableHearts) => Math.max(0, prevAvailableHearts - 1));
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

    setAvailableHearts((prevAvailableHearts) =>
      Math.min(initialHearts ?? 0, prevAvailableHearts + 1)
    );
  };

  const { mutate: mutateVote } = useMutation({
    mutationFn: postVote,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({
          queryKey: ['question', forumQuestion?.id, 'votes'],
        });
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

  if (isLoadingUserVotes) {
    return <p>Fetching user votes...</p>;
  }

  if (isErrorUserVotes) {
    return <p>Fetching user votes...</p>;
  }

  return (
    <FlexColumn $gap="3rem">
      <FlexColumn>
        <Grid $columns={2} $gap="2rem">
          <h2>{cycle?.forumQuestions?.[0].title}</h2>
          <Countdown formattedTime={formattedTime} />
          <FlexRow $gap="0.25rem" $wrap>
            {Array.from({ length: initialHearts ?? 0 }).map((_, id) => (
              <img
                key={id}
                src={id < availableHearts ? '/icons/full_heart.svg' : '/icons/empty_heart.svg'}
                height={32}
                width={32}
                alt={id < availableHearts ? 'Full Heart' : 'Empty Heart'}
              />
            ))}
          </FlexRow>
          <Button color="primary" onClick={handleSaveVotes} disabled={!votesAreDifferent}>
            Save all votes
          </Button>
        </Grid>
      </FlexColumn>
      <Grid $columns={2} $gap="2rem">
        {cycle &&
          cycle.forumQuestions?.map((forumQuestion) => {
            return forumQuestion.questionOptions.map((questionOption) => {
              const userVote = localUserVotes.find((vote) => vote.optionId === questionOption.id);
              const numOfVotes = userVote ? userVote.numOfVotes : 0;
              return (
                <Option
                  key={questionOption.id}
                  title={questionOption.text}
                  availableHearts={availableHearts}
                  numOfVotes={numOfVotes}
                  onVote={() => handleVote(questionOption.id)}
                  onUnvote={() => handleUnvote(questionOption.id)}
                />
              );
            });
          })}
      </Grid>
      <FlexRow $alignSelf="center">
        <Button
          color="secondary"
          variant="text"
          onClick={() => navigate(`/events/${eventId}/cycles/${cycleId}/results`)}
        >
          see results
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}

export default Vote;
