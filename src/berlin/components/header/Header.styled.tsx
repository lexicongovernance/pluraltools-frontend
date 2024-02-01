// import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const SyledHeader = styled.header`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 10rem;
  padding-block: 2rem;
`;

export const HeaderContainer = styled.div`
  align-items: center;
  background-color: var(--color-white);
  display: flex;
  justify-content: space-between;
  margin-inline: auto;
  width: min(85%, 1080px);
`;

export const LogoContainer = styled.div`
  cursor: pointer;
  column-gap: 1rem;
  display: grid;
  grid-template-columns: 6rem 6.5rem 4rem;
  grid-template-rows: 3.5rem 2rem;
  row-gap: 0.5rem;
`;

export const LogoImage = styled.img`
  grid-column: 1/2;
  grid-row: 1/3;
  height: 6rem;
  width: 6rem;
`;

export const LogoText = styled.h1`
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  font-weight: 600;
  grid-column: 2/3;
  grid-row: 1/2;
  line-height: 1.75rem;
`;

export const LogoSubtext = styled.h2`
  font-family: var(--font-family-body);
  font-size: 0.75rem;
  font-style: italic;
  font-weight: 500;
  grid-column: 2/4;
  grid-row: 2/3;
  line-height: 1rem;
`;

export const NavContainer = styled.nav`
  align-items: center;
  display: flex;
`;

export const NavButtons = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
`;

export const NavButton = styled.li``;

// export const StyledNavLink = styled(NavLink)`
//   padding-bottom: 0.5rem;
//   border-bottom: 3px solid transparent;
//   &.active {
//     border-bottom: 3px solid var(--color-white);
//   }
// `;
