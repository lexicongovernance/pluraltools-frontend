import styled, { keyframes } from 'styled-components';
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
  gap: 1rem;
  justify-content: space-between;
  margin-inline: auto;
  width: min(90%, 1080px);
`;

export const LogoContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
`;

export const LogoImage = styled.img`
  height: 3.5rem;
  max-width: 3.5rem;

  @media (min-width: 430px) {
    height: 5rem;
    max-width: 5rem;
  }
`;

export const LogoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LogoTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1.65rem;

  @media (min-width: 430px) {
    display: block;
    font-family: var(--font-family-title);
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.75rem;
  }

  @media (min-width: 600px) {
    max-width: none;
  }
`;

export const LogoSubtitle = styled.h2`
  display: block;
  font-family: var(--font-family-body);
  font-size: 0.65rem;
  font-style: italic;
  font-weight: 600;
  line-height: 0.75rem;
  max-width: 360px;
  @media (min-width: 600px) {
    font-size: 1rem;
  }
`;

export const NavContainer = styled.nav`
  align-items: center;
  display: flex;
`;

export const NavButtons = styled.ul`
  display: flex;
  gap: 0.75rem;
  list-style: none;
`;

export const DesktopButtons = styled.div`
  display: none;
  @media (min-width: 1080px) {
    display: flex;
    gap: 0.75rem;
  }
`;

export const MobileButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  text-align: center;
  @media (min-width: 1080px) {
    display: none;
  }
`;

export const ThemeButton = styled(Button)`
  img {
    min-width: 20px;
  }
`;

export const MenuButton = styled.li`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 2.25rem;
  justify-content: center;
  width: 2.25rem;

  @media (min-width: 1080px) {
    display: none;
  }
`;

export const Bar = styled.div<{ $isOpen: boolean }>`
  background-color: var(--color-black);
  border-radius: 8px;
  height: 3px;
  margin: 2px 0;
  transition: 0.4s;
  width: 27px;

  &:first-child {
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(-45deg) translateY(10px)' : '')};
  }

  &:nth-child(2) {
    opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
    transition: 0.2s;
  }

  &:nth-child(3) {
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg) translateY(-10px)' : '')};
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const BurgerMenuContainer = styled.nav<{ $$isOpen: boolean }>`
  align-items: center;
  background-color: var(--color-white);
  bottom: 0;
  display: flex;
  height: calc(100% - 160px);
  justify-content: center;
  left: 0;
  position: fixed;
  width: 100%;
  z-index: 999;

  display: ${(props) => (props.$$isOpen ? 'flex' : 'none')};
  animation: ${fadeIn} 0.3s ease-out;
`;
