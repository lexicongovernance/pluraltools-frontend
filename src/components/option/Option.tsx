import { FlexColumn } from '../../layout/Layout.styled';
import { StyledOption } from './Option.styled';

type OptionProps = { title: string; body: string };

function Option({ title, body }: OptionProps) {
  return (
    <StyledOption>
      <FlexColumn>
        <h3>{title}</h3>
        <p>{body}</p>
      </FlexColumn>
    </StyledOption>
  );
}

export default Option;
