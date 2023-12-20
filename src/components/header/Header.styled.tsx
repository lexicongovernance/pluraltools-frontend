import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const SyledHeader = styled.header`
  align-items: center;
  background-color: #759de9;
  display: flex;
  height: 6rem;
  justify-content: center;
`;

export const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: min(90%, 1080px);
`;

export const Logo = styled.h2`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.125rem;
  line-height: 1.125rem;
`;

export const NavButtons = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
`;

export const StyledNavLink = styled(NavLink)`
  padding-bottom: 0.5rem;
  border-bottom: 3px solid transparent;
  &.active {
    border-bottom: 3px solid #fff;
  }
`;
