import { StyledButton } from './Button.styled';
import { ButtonProps } from '../../types/ButtonType';
import ButtonText from '../typography/ButtonText';

function Button({ children, color, variant, onClick, center, ...props }: ButtonProps) {
  return (
    <StyledButton color={color} variant={variant} onClick={onClick} center={center} {...props}>
      <ButtonText>{children}</ButtonText>
    </StyledButton>
  );
}

export default Button;
