import { StyledButton } from './Button.styled'

type ButtonProps = {
  children: React.ReactNode
  color?: 'primary' | 'secondary'
  variant?: 'text' | 'contained'
  onClick?: () => void
}

function Button({ children, color, variant, onClick }: ButtonProps) {
  return (
    <StyledButton color={color} variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  )
}

export default Button
