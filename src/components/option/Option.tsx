import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { StyledOption, Title, Body } from './Option.styled';
import { useState } from 'react';

type OptionProps = {
  title: string;
  body: string;
  onVote: () => void;
  onUnvote: () => void;
};

function Option({ title, body, onVote, onUnvote }: OptionProps) {
  const [likesCount, __] = useState(0);

  return (
    <StyledOption>
      <FlexColumn $justifyContent="space-between">
        <FlexColumn $gap="2rem">
          <Title>{title}</Title>
          <Body>{body}</Body>
          <FlexRow $gap="0.25rem">
            {likesCount > 0 ? (
              <img src="/icons/full_heart.svg" height={32} width={32} alt="Full Heart" />
            ) : (
              <img src="/icons/empty_heart.svg" height={32} width={32} alt="Empty Heart" />
            )}
          </FlexRow>
        </FlexColumn>
        <FlexRow $justifyContent="space-between">
          <Button variant="text">Read more</Button>
          <FlexRow $gap="0.5rem">
            <Button color="secondary" onClick={() => onUnvote()}>
              Unvote
            </Button>
            <Button color="primary" onClick={() => onVote()}>
              Vote
            </Button>
          </FlexRow>
        </FlexRow>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
