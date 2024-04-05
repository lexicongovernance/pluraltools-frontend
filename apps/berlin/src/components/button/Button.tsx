import { StyledButton } from './Button.styled';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  $color?: 'primary' | 'secondary';
  $variant?: 'text' | 'contained' | 'outlined' | 'link';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  $color = 'primary',
  $variant = 'contained',
  children,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      onClick={onClick}
      type={type}
      $color={$color}
      disabled={disabled}
      $variant={$variant}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
