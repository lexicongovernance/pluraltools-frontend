import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PostVotesRequest, fetchCycle, fetchUserVotes, postVotes } from 'api';
import Button from '../components/button';
import Countdown from '../components/countdown';
import Option from '../components/option';
import Title from '../components/typography/Title';
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import { ResponseUserVotesType } from '../types/CycleType';

const BackArrow = styled.div`
  cursor: pointer;
  height: 1.75rem;
  width: 1.75rem;
`;

function Vote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

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

  const {
    data: userVotes,
    isLoading: isLoadingUserVotes,
    isError: isErrorUserVotes,
  } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(cycleId || ''),
    enabled: !!user?.id && !!cycleId,
    retry: false,
  });

  const initialHearts = 20;
  const [avaliableHearts, setAvaliableHearts] = useState(initialHearts);
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
      if (body?.data) {
        queryClient.invalidateQueries({ queryKey: ['user-votes'] });
        toast.success('Votes saved successfully!');
      } else {
        toast.error('Failed to save votes, please try again');
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

  if (isLoadingUserVotes) {
    return <p>Fetching user votes...</p>;
  }

  if (isErrorUserVotes) {
    return <p>Fetching user votes...</p>;
  }

  return (
    <FlexColumn $gap="3rem">
      <BackArrow onClick={handleGoBack}>
        <img src="/icons/back_arrow.svg" alt="Back arrow" />
      </BackArrow>
      <FlexColumn>
        <Grid $columns={2} $gap="2rem">
          <Title className="title">{cycle?.forumQuestions?.[0].questionTitle}</Title>
          <Countdown formattedTime={formattedTime} />
          <FlexRow $gap="0.25rem" $wrap>
            {Array.from({ length: initialHearts }).map((_, id) => (
              <img
                key={id}
                src={id < avaliableHearts ? '/icons/full_heart.svg' : '/icons/empty_heart.svg'}
                height={32}
                width={32}
                alt={id < avaliableHearts ? 'Full Heart' : 'Empty Heart'}
              />
            ))}
          </FlexRow>
          <FlexRow $justifySelf="flex-end">
            <Button color="primary" onClick={handleSaveVotes} disabled={!votesAreDifferent}>
              Save all votes
            </Button>
          </FlexRow>
        </Grid>
      </FlexColumn>
      <Grid $columns={2} $gap="2rem">
        {cycle &&
          cycle.forumQuestions?.map((forumQuestion) => {
            forumQuestion.questionOptions.sort((a, b) => b.voteScore - a.voteScore);
            return forumQuestion.questionOptions.map((questionOption) => {
              const userVote = localUserVotes.find((vote) => vote.optionId === questionOption.id);
              const numOfVotes = userVote ? userVote.numOfVotes : 0;
              return (
                <Option
                  key={questionOption.id}
                  title={questionOption.optionTitle}
                  body={questionOption.optionSubTitle}
                  avaliableHearts={avaliableHearts}
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
