import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { StyledOption, Title, Body } from './Option.styled';

type OptionProps = { title: string; body: string };

const hearts = [''];

function Option({ title, body }: OptionProps) {
  return (
    <StyledOption>
      <FlexColumn $justifyContent="space-between">
        <FlexColumn $gap="2rem">
          <Title>{title}</Title>
          <Body>{body}</Body>
          <FlexRow $gap="0.25rem">
            {hearts.map(() => (
              <img src="/icons/empty_heart.svg" height={32} width={32} />
            ))}
          </FlexRow>
        </FlexColumn>
        <FlexRow $justifyContent="space-between">
          <Button variant="text">Read more</Button>
          <FlexRow $gap="0.5rem">
            <Button color="secondary">Unvote</Button>
            <Button color="primary">Vote</Button>
          </FlexRow>
        </FlexRow>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
