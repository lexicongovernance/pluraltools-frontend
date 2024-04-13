import React from 'react';
import { StyledButton } from './Button.styled';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  $color?: 'primary' | 'secondary';
  $variant?: 'text' | 'contained' | 'outlined' | 'link';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      $color = 'primary',
      $variant = 'contained',
      children,
      disabled = false,
      onClick,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    return (
      <StyledButton
        ref={ref}
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
  },
);

export default Button;
