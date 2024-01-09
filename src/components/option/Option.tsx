import { useEffect, useState } from 'react';
import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { Body, StyledOption, Title } from './Option.styled';

type OptionProps = {
  title: string;
  body?: string;
  avaliableHearts: number;
  numOfVotes: number;
  onVote: () => void;
  onUnvote: () => void;
};

function Option({ title, body, avaliableHearts, numOfVotes, onVote, onUnvote }: OptionProps) {
  const [localOptionHearts, setLocalOptionHearts] = useState(numOfVotes);

  useEffect(() => {
    setLocalOptionHearts(numOfVotes);
  }, [numOfVotes]);

  const handleVoteClick = () => {
    if (avaliableHearts) {
      setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
      onVote();
    }
  };

  const handleUnvoteClick = () => {
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    onUnvote();
  };

  return (
    <StyledOption>
      <FlexColumn $justifyContent="space-between" $gap="2rem">
        <FlexColumn $gap="2rem">
          <Title>{title}</Title>
          {body && <Body>{body}</Body>}
          <FlexRow $gap="0.25rem" $wrap>
            {localOptionHearts > 0 ? (
              Array.from({ length: localOptionHearts }).map((_, id) => (
                <img key={id} src="/icons/full_heart.svg" height={32} width={32} alt="Full Heart" />
              ))
            ) : (
              <img src="/icons/empty_heart.svg" height={32} width={32} alt="Empty Heart" />
            )}
          </FlexRow>
        </FlexColumn>
        <FlexRow $alignSelf="flex-end" $justifyContent="space-between">
          <FlexRow $gap="0.5rem">
            <Button
              color="secondary"
              onClick={handleUnvoteClick}
              disabled={localOptionHearts === 0}
            >
              Unvote
            </Button>
            <Button color="primary" onClick={handleVoteClick} disabled={avaliableHearts === 0}>
              Vote
            </Button>
          </FlexRow>
        </FlexRow>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
