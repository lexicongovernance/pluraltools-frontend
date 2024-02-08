import { useState } from 'react';
import Label from '../typography/Label';
import {
  CheckboxContainer,
  Container,
  HiddenCheckbox,
  Icon,
  StyledCheckbox,
} from './Checkbox.styled';

type CheckboxProps = {
  text: string;
  $required?: boolean;
};

function Checkbox({ text, $required }: CheckboxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <Container>
      <CheckboxContainer>
        <HiddenCheckbox
          type="checkbox"
          checked={checked}
          id={text}
          name={text}
          required={$required}
        />
        <StyledCheckbox $checked={checked} onClick={() => setChecked(!checked)}>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
      </CheckboxContainer>
      <Label $required={$required} htmlFor={text} onClick={() => setChecked(!checked)}>
        {text}
      </Label>
    </Container>
  );
}

export default Checkbox;
