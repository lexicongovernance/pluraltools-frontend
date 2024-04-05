import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const NavItem = styled.li``;

export const StyledNavLink = styled(NavLink)`
  &.active {
    box-shadow: 0 2px 0 0 var(--color-black);
  }
`;
