import { StyledButton } from './Button.styled';
import { ButtonProps } from '../../types/ButtonType';

function Button({ children, color, variant, onClick, ...props }: ButtonProps) {
  return (
    <StyledButton color={color} variant={variant} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
