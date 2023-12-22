import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const SyledHeader = styled.header`
  align-items: center;
  background-color: #759de9;
  display: flex;
  min-height: 6rem;
  justify-content: center;
  padding-block: 2rem;
`;

export const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: space-between;
  width: min(90%, 1080px);

  @media (min-width: 600px) {
    flex-direction: row;
  }
`;

export const Logo = styled.h2`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.125rem;
  line-height: 1.5rem;
  text-align: center;

  @media (min-width: 600px) {
    text-align: left;
  }
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
