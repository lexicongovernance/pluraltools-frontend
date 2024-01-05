import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import fetchCycles from '../api/fetchCycles';
import fetchUserVotes from '../api/fetchUserVotes';
import postVote from '../api/postVote';
import Button from '../components/button';
import Countdown from '../components/countdown';
import Option from '../components/option';
import useCountdown from '../hooks/useCountdown';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import { ResponseUserVotesType } from '../types/CycleType';

function Home() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [startAt, setStartAt] = useState<string | null>(null);
  const [endAt, setEndAt] = useState<string | null>(null);

  const { data: cycles } = useQuery({
    queryKey: ['cycles'],
    queryFn: fetchCycles,
    staleTime: 10000,
    retry: false,
  });

  const currentCycle = cycles && cycles[0];

  const {
    data: userVotes,
    isLoading: isLoadingUserVotes,
    isError: isErrorUserVotes,
  } = useQuery({
    queryKey: ['user-votes'],
    queryFn: () => fetchUserVotes(user?.id || '', currentCycle!.id),
    enabled: !!user?.id && !!currentCycle?.id,
    staleTime: 10000,
    retry: false,
  });

  const initialHearts = 10;
  const [avaliableHearts, setAvaliableHearts] = useState(initialHearts);
  const [localUserVotes, setLocalUserVotes] = useState<
    ResponseUserVotesType | { optionId: string; numOfVotes: number }[]
  >([]);

  useEffect(() => {
    if (currentCycle && currentCycle.startAt && currentCycle.endAt) {
      setStartAt(currentCycle.startAt);
      setEndAt(currentCycle.endAt);
    }
  }, [currentCycle]);

  const { formattedTime } = useCountdown(startAt, endAt);

  const updateVotesAndHearts = (votes: ResponseUserVotesType) => {
    const givenVotes = votes
      .map((option) => option.numOfVotes)
      .reduce((prev, curr) => prev + curr, 0);

    setAvaliableHearts(initialHearts - givenVotes);
    setLocalUserVotes(votes);
  };

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
          <h2>{currentCycle?.forumQuestions[0].title}</h2>
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
          <Button color="primary" onClick={handleSaveVotes}>
            Save all votes
          </Button>
        </Grid>
      </FlexColumn>
      <Grid $columns={2} $gap="2rem">
        {currentCycle &&
          currentCycle.forumQuestions.map((forumQuestion) => {
            return forumQuestion.questionOptions.map((questionOption) => {
              const userVote = localUserVotes.find((vote) => vote.optionId === questionOption.id);
              const numOfVotes = userVote ? userVote.numOfVotes : 0;
              return (
                <Option
                  key={questionOption.id}
                  title={questionOption.text}
                  avaliableHearts={avaliableHearts}
                  numOfVotes={numOfVotes}
                  onVote={() => handleVote(questionOption.id)}
                  onUnvote={() => handleUnvote(questionOption.id)}
                />
              );
            });
          })}
      </Grid>
    </FlexColumn>
  );
}

export default Home;
