import { StyledNavLink } from './NavButton.styled';
import Button from '../button';

type NavButtonProps = {
  to: string;
  $color?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

function NavButton({ to, children, $color = 'primary', disabled, onClick }: NavButtonProps) {
  return (
    <StyledNavLink to={to} tabIndex={-1}>
      <Button onClick={onClick} $color={$color} disabled={disabled}>
        {children}
      </Button>
    </StyledNavLink>
  );
}

export default NavButton;
