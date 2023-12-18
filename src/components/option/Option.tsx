import { FlexColumn } from '../../layout/Layout.styled';
import { StyledOption, Title, Body } from './Option.styled';

type OptionProps = { title: string; body: string };

function Option({ title, body }: OptionProps) {
  return (
    <StyledOption>
      <FlexColumn>
        <Title>{title}</Title>
        <Body>{body}</Body>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
