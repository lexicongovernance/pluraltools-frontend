import { FlexColumn } from '../containers/FlexColum.styled';
import { Error } from '../typography/Error.styled';
import Label from '../typography/Label';
import { StyledInput } from './Input.styled';

type InputProps = {
  label?: string;
  required?: boolean;
  placeholder: string;
  errors?: string[];
};

function Input({ label, required, placeholder, errors }: InputProps) {
  return (
    <FlexColumn $align="flex-start" $gap="0.5rem">
      {label && <Label $required={required}>{label}</Label>}
      <StyledInput type="text" placeholder={placeholder} />
      {errors && (
        <FlexColumn $gap="0.25rem">
          {errors.map((error) => (
            <Error>{error}</Error>
          ))}
        </FlexColumn>
      )}
    </FlexColumn>
  );
}
export default Input;
