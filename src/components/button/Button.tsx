import { StyledButton } from './Button.styled';
import { ButtonProps } from '../../types/ButtonType';

function Button({ children, color, variant, onClick }: ButtonProps) {
  return (
    <StyledButton color={color} variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  );
}

export default Button;
