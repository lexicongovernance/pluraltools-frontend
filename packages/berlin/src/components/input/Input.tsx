import React from 'react';
import { FlexColumn } from '../containers/FlexColum.styled';
import { Error } from '../typography/Error.styled';
import Label from '../typography/Label';
import { StyledInput } from './Input.styled';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  placeholder: string;
  errors?: string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, errors, label, required, ...props }, ref) => {
    return (
      <FlexColumn $gap="0.5rem">
        {label && <Label $required={required}>{label}</Label>}
        <StyledInput type="text" placeholder={placeholder} ref={ref} {...props} />
        {errors && errors?.length > 0 && errors[0] !== '' && (
          <FlexColumn $gap="0.25rem">
            {errors.map((error, i) => (
              <Error key={i}>{error}</Error>
            ))}
          </FlexColumn>
        )}
      </FlexColumn>
    );
  },
);
export default Input;
