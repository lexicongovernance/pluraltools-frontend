import { StyledButton } from './Button.styled';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  $color?: 'primary' | 'secondary';
};

function Button({
  children,
  onClick,
  $color = 'primary',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  return (
    <StyledButton onClick={onClick} type={type} $color={$color} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

export default Button;
