import Label from '../typography/Label';
import {
  CheckboxContainer,
  Container,
  HiddenCheckbox,
  Icon,
  StyledCheckbox,
} from './Checkbox.styled';
import React from 'react';

type CheckboxProps = {
  text: string;
  $required?: boolean;
  onClick?: () => void;
  value: boolean;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ text, $required, onClick, value }, ref) => {
    return (
      <Container>
        <CheckboxContainer>
          <HiddenCheckbox
            type="checkbox"
            checked={value}
            id={text}
            name={text}
            required={$required}
            ref={ref}
            onChange={() => {}}
          />
          <StyledCheckbox $checked={value} onClick={onClick}>
            <Icon viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </Icon>
          </StyledCheckbox>
        </CheckboxContainer>
        <Label $required={$required} htmlFor={text} onClick={onClick}>
          {text}
        </Label>
      </Container>
    );
  },
);

export default Checkbox;
