import { StyledButton } from './Button.styled';
import { ButtonProps } from '../../types/ButtonType';

function Button({ children, color, variant, onClick, center, ...props }: ButtonProps) {
  return (
    <StyledButton color={color} variant={variant} onClick={onClick} center={center} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
