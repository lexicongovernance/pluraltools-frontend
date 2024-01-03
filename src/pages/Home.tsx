import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  //  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import fetchCycles from '../api/fetchCycles';
// import Countdown from '../components/countdown';
import Option from '../components/option';
// import useCountdown from '../hooks/useCountdown';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import Button from '../components/button';
import postVote from '../api/postVote';

const Question = styled.h2`
  text-align: center;

  @media (min-width: 600px) {
    text-align: left;
  }
`;

function Home() {
  const queryClient = useQueryClient();
  const { data: cycles, isLoading } = useQuery({
    queryKey: ['cycles'],
    queryFn: fetchCycles,
    staleTime: 10000,
    retry: false,
  });

  const { mutate: mutateVote } = useMutation({
    mutationFn: postVote,
  });

  const currentCycle = cycles && cycles[0];

  const initialHearts = 10;
  const [heartsCount, setHeartsCount] = useState(initialHearts);
  const [localVotes, setLocalVotes] = useState<{ [optionId: string]: number }>({});
  console.log('🚀 ~ file: Home.tsx:35 ~ Home ~ localVotes:', localVotes);
  const totalAssignedVotes = Object.values(localVotes).reduce((total, votes) => total + votes, 0);
  const isVoteButtonDisabled = totalAssignedVotes >= initialHearts;

  // const [startAt, setStartAt] = useState<string | null>(null);
  // const [endAt, setEndAt] = useState<string | null>(null);

  // useEffect(() => {
  //   if (currentCycle && currentCycle.startAt && currentCycle.endAt) {
  //     setStartAt(currentCycle.startAt);
  //     setEndAt(currentCycle.endAt);
  //   }
  // }, [currentCycle]);

  // const { formattedTime } = useCountdown(startAt, endAt);

  if (isLoading || !cycles) {
    return <p>Loading...</p>;
  }

  const handleVote = (optionId: string) => {
    if (heartsCount > 0) {
      setLocalVotes((prevVotes) => ({
        ...prevVotes,
        [optionId]: (prevVotes[optionId] || 0) + 1,
      }));
      setHeartsCount((prevCount) => prevCount - 1);
    }
  };

  const handleUnvote = (optionId: string) => {
    if (localVotes[optionId] > 0) {
      setLocalVotes((prevVotes) => ({
        ...prevVotes,
        [optionId]: prevVotes[optionId] - 1,
      }));
      setHeartsCount((prevCount) => prevCount + 1);
    }
  };

  return (
    <FlexColumn $gap="3rem">
      <FlexColumn>
        <Grid $columns={2} $gap="2rem">
          <Question>What are you most excited about for 2024?</Question>
          {/* <Countdown formattedTime={formattedTime} /> */}
          <FlexRow $gap="0.25rem" $wrap>
            {Array.from({ length: initialHearts }).map((_, id) => (
              <img
                key={id}
                src={id < heartsCount ? '/icons/full_heart.svg' : '/icons/empty_heart.svg'}
                height={32}
                width={32}
                alt={id < heartsCount ? 'Full Heart' : 'Empty Heart'}
              />
            ))}
          </FlexRow>
          <Button>Save votes</Button>
        </Grid>
      </FlexColumn>
      <Grid $columns={2} $gap="2rem">
        {currentCycle &&
          currentCycle.forumQuestions.map((forumQuestion) => {
            return forumQuestion.questionOptions.map((questionOption) => (
              <Option
                key={questionOption.id}
                id={questionOption.id}
                title={questionOption.text}
                // TODO: Add body to db
                body={'body'}
                isVoteButtonDisabled={isVoteButtonDisabled}
                onVote={() => handleVote(questionOption.id)}
                onUnvote={() => handleUnvote(questionOption.id)}
              />
            ));
          })}
      </Grid>
    </FlexColumn>
  );
}

export default Home;
