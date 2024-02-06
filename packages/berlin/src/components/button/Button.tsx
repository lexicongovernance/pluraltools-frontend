import { StyledButton } from './Button.styled';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  $color?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children,
  onClick,
  $color = 'primary',
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton onClick={onClick} type={type} $color={$color} disabled={disabled} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;
