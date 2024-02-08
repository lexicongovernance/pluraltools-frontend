// Components
import { FlexColumn } from '../containers/FlexColum.styled';
import Label from '../typography/Label';

// Styled Components
import { StyledTextarea } from './Textarea.styled';

type TextareaProps = {
  label: string;
  $required?: boolean;
};

function Textarea({ label, $required, ...props }: TextareaProps) {
  return (
    <FlexColumn>
      {label && <Label $required={$required}>{label}</Label>}
      <StyledTextarea {...props} />
    </FlexColumn>
  );
}

export default Textarea;
