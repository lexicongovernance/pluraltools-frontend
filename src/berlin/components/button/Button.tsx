import { StyledButton } from './Button.styled';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  $color?: 'primary' | 'secondary';
};

function Button({ children, onClick, $color = 'primary' }: ButtonProps) {
  return (
    <StyledButton onClick={onClick} $color={$color}>
      {children}
    </StyledButton>
  );
}

export default Button;
