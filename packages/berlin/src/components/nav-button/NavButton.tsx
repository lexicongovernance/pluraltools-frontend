import { StyledNavLink } from './NavButton.styled';
import Button from '../button';

type NavButtonProps = {
  to: string;
  $color?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  end?: boolean;
};

function NavButton({ to, children, end, $color = 'primary', onClick }: NavButtonProps) {
  return (
    <StyledNavLink to={to} tabIndex={-1} end={end}>
      <Button onClick={onClick} $color={$color}>
        {children}
      </Button>
    </StyledNavLink>
  );
}

export default NavButton;
