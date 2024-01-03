import { useMutation, useQuery } from '@tanstack/react-query';
import fetchUserVotes from '../../api/fetchUserVotes';
import useUser from '../../hooks/useUser';
import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { Body, StyledOption, Title } from './Option.styled';
import postVote from '../../api/postVote';
import { useState } from 'react';

type OptionProps = {
  id: string;
  title: string;
  body: string;
  initialVotes: number;
  isVoteButtonDisabled: boolean;
  onVote: () => void;
  onUnvote: () => void;
};

function Option({
  id,
  title,
  body,
  initialVotes,
  isVoteButtonDisabled,
  onVote,
  onUnvote,
}: OptionProps) {
  const { user } = useUser();

  const [localVotes, setLocalVotes] = useState(initialVotes);

  const handleIncrement = () => {
    setLocalVotes((prevVotes) => prevVotes + 1);
    onVote();
  };

  const handleDecrement = () => {
    setLocalVotes((prevVotes) => Math.max(0, prevVotes - 1));
    onUnvote();
  };

  const {
    data: userVotes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user-votes', id],
    queryFn: () => fetchUserVotes(user?.id || '', id),
    enabled: !!user?.id,
    staleTime: 10000,
    retry: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching options...</p>;
  }

  return (
    <StyledOption>
      <FlexColumn $justifyContent="space-between" $gap="2rem">
        <FlexColumn $gap="2rem">
          <Title>{title}</Title>
          <Body>{body}</Body>
          <FlexRow $gap="0.25rem" $wrap>
            {localVotes > 0 ? (
              Array.from({ length: localVotes }).map((_, id) => (
                <img
                  key={id}
                  src="/icons/full_heart.svg"
                  height={32}
                  width={32}
                  alt="Empty Heart"
                />
              ))
            ) : (
              <img src="/icons/empty_heart.svg" height={32} width={32} alt="Full Heart" />
            )}
          </FlexRow>
        </FlexColumn>
        <FlexRow $alignSelf="flex-end" $justifyContent="space-between">
          {/* <Button variant="text">Read more</Button> */}
          <FlexRow $gap="0.5rem">
            <Button color="secondary" onClick={handleDecrement} disabled={localVotes === 0}>
              Unvote
            </Button>
            {/* // TODO: handle disabled */}
            <Button color="primary" onClick={handleIncrement} disabled={isVoteButtonDisabled}>
              Vote
            </Button>
          </FlexRow>
        </FlexRow>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
