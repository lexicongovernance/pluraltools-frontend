// Components
import React from 'react';
import { FlexColumn } from '../containers/FlexColumn.styled';
import Label from '../typography/Label';

// Styled Components
import { StyledTextarea } from './Textarea.styled';
import { Error } from '../typography/Error.styled';

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  $required?: boolean;
  errors?: string[];
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, $required, errors, ...props }, ref) => {
    return (
      <FlexColumn>
        {label && (
          <Label $required={$required} htmlFor={props.name}>
            {label}
          </Label>
        )}
        <StyledTextarea {...props} name={props.name} ref={ref} />
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

export default Textarea;
