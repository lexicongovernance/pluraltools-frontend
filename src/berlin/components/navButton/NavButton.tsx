import { NavLink } from 'react-router-dom';
import { NavItem } from './NavButton.styled';

function NavButton() {
  return (
    <NavItem>
      <NavLink to="/">
        <button>Communities</button>
      </NavLink>
    </NavItem>
  );
}

export default NavButton;
