import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { StyledOption, Title, Body } from './Option.styled';

type OptionProps = { title: string; body: string };

function Option({ title, body }: OptionProps) {
  return (
    <StyledOption>
      <FlexColumn $gap="2rem">
        <Title>{title}</Title>
        <Body>{body}</Body>
        <FlexRow $justifyContent="space-between">
          <Button variant="text">Learn more</Button>
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
