import styled from 'styled-components';
import Button from '../button/Button';

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
  display: block;

  @media (min-width: 640px) {
    cursor: pointer;
    column-gap: 1rem;
    display: grid;
    grid-template-columns: 6rem 11rem;
    grid-template-rows: 3.5rem 2rem;
    row-gap: 0.5rem;
  }
`;

export const LogoImage = styled.img`
  grid-column: 1/2;
  grid-row: 1/3;
  height: 6rem;
  width: 6rem;
`;

export const LogoText = styled.h1`
  display: none;

  @media (min-width: 640px) {
    display: block;
    font-family: var(--font-family-title);
    font-size: 1.5rem;
    font-weight: 600;
    grid-column: 2/3;
    grid-row: 1/2;
    line-height: 1.75rem;
  }
`;

export const LogoSubtext = styled.h2`
  display: none;

  @media (min-width: 640px) {
    display: block;
    font-family: var(--font-family-body);
    font-size: 0.875rem;
    font-style: italic;
    font-weight: 600;
    grid-column: 2/3;
    grid-row: 2/3;
    line-height: 1rem;
  }
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

export const DesktopButtons = styled.ul`
  display: none;
  @media (min-width: 1080px) {
    display: flex;
    gap: 1rem;
    list-style: none;
  }
`;

export const ThemeButton = styled(Button)``;

export const MenuButton = styled.button`
  display: block;
  background-color: var(--color-white);
  border: none;
  height: 2.25rem;
  width: 2.25rem;

  @media (min-width: 1080px) {
    display: none;
  }
`;
