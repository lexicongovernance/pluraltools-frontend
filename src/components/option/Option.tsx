import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { StyledOption, Title, Body } from './Option.styled';

type OptionProps = {
  title: string;
  body: string;
  hearts: number;
  onVote: () => void;
  onUnvote: () => void;
};

function Option({ title, body, hearts = 0, onVote, onUnvote }: OptionProps) {
  return (
    <StyledOption>
      <FlexColumn $justifyContent="space-between" $gap="2rem">
        <FlexColumn $gap="2rem">
          <Title>{title}</Title>
          <Body>{body}</Body>
          <FlexRow $gap="0.25rem" $wrap>
            {hearts > 0 ? (
              Array.from({ length: hearts }).map((_, id) => (
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
