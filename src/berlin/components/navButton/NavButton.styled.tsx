import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const NavItem = styled.li``;

export const StyledNavLink = styled(NavLink)`
  &.active {
    border-bottom: 3px solid var(--color-black);
  }
`;
