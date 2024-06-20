// React and third-party libraries
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

// Store
import { useAppStore } from '../../store';

// Data
import header from '../../data/header';

// API
import { logout } from 'api';

// Hooks
import useUser from '../../hooks/useUser';

// Components
import Button from '../button';
import NavButton from '../nav-button';
import ZupassLoginButton from '../zupass-button/ZupassLoginButton';

// Styled components
import {
  Bar,
  BurgerMenuContainer,
  DesktopButtons,
  HeaderContainer,
  LogoContainer,
  LogoImage,
  LogoSubtitle,
  LogoTextContainer,
  LogoTitle,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  StyledHeader,
  ThemeButton,
} from './Header.styled';
import IconButton from '../icon-button';

function Header() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const location = useLocation();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const navigate = useNavigate();
  const resetState = useAppStore((state) => state.reset);
  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      resetState();
      await queryClient.invalidateQueries();
      await queryClient.removeQueries();
      navigate('/');
    },
  });

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  return (
    <StyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <LogoImage src={header.logo.src} alt={header.logo.alt} height={96} width={96} />
          {location.pathname === '/' && (
            <LogoTextContainer>
              <LogoTitle>{header.title}</LogoTitle>
              <LogoSubtitle>{header.subtitle}</LogoSubtitle>
            </LogoTextContainer>
          )}
        </LogoContainer>
        <NavContainer>
          <NavButtons>
            <DesktopButtons>
              {user ? (
                <>
                  <NavButton to={`/events`} $color="secondary">
                    Events
                  </NavButton>
                  <Button onClick={() => mutateLogout()}>Log out</Button>
                  <IconButton
                    onClick={() => navigate('/account')}
                    icon={{ src: `/icons/user-${theme}.svg`, alt: 'User' }}
                    $color="primary"
                    $height={20}
                    $width={20}
                  />
                </>
              ) : (
                <ZupassLoginButton>Login with Zupass</ZupassLoginButton>
              )}
            </DesktopButtons>
            <MenuButton onClick={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}>
              <Bar $isOpen={isBurgerMenuOpen} />
              <Bar $isOpen={isBurgerMenuOpen} />
              <Bar $isOpen={isBurgerMenuOpen} />
            </MenuButton>
            <li>
              <ThemeButton onClick={toggleTheme}>
                <img
                  src={`/icons/toggle-${theme}.svg`}
                  alt="Toggle theme icon"
                  height={20}
                  width={20}
                />
              </ThemeButton>
            </li>
          </NavButtons>
        </NavContainer>
        <BurgerMenuContainer $$isOpen={isBurgerMenuOpen} onClick={() => setIsBurgerMenuOpen(false)}>
          <NavButtons>
            <MobileButtons>
              {user ? (
                <>
                  <NavButton to={`/events`} $color="secondary">
                    Events
                  </NavButton>

                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
                  <Button onClick={() => mutateLogout()}>Log out</Button>
                </>
              ) : (
                <ZupassLoginButton>Login with Zupass</ZupassLoginButton>
              )}
            </MobileButtons>
          </NavButtons>
        </BurgerMenuContainer>
      </HeaderContainer>
    </StyledHeader>
  );
}

export default Header;
