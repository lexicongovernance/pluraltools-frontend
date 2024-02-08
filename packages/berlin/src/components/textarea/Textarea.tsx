// Components
import React from 'react';
import { FlexColumn } from '../containers/FlexColum.styled';
import Label from '../typography/Label';

// Styled Components
import { StyledTextarea } from './Textarea.styled';

interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  $required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, $required, ...props }, ref) => {
    return (
      <FlexColumn>
        {label && (
          <Label $required={$required} htmlFor={props.name}>
            {label}
          </Label>
        )}
        <StyledTextarea {...props} name={props.name} ref={ref} />
      </FlexColumn>
    );
  },
);

export default Textarea;
