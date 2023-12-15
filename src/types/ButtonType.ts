export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  color?: 'primary' | 'secondary'
  variant?: 'text' | 'contained'
  onClick?: () => void
}
