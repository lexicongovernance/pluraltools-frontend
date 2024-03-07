// React and third-party libraries
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

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
import NavButton from '../navButton';
import ZupassLoginButton from '../zupassButton/ZupassLoginButton';

// Styled components
import {
  Bar,
  BurgerMenuContainer,
  DesktopButtons,
  HeaderContainer,
  LogoContainer,
  LogoImage,
  LogoSubtitle,
  LogoTitle,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  SyledHeader,
  LogoTextContainer,
  ThemeButton,
} from './Header.styled';

function Header() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const eventRegistrationStatus = useAppStore((state) => state.eventRegistrationStatus);
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
    <SyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <LogoImage src={header.logo.src} alt={header.logo.alt} height={96} width={96} />
          <LogoTextContainer>
            <LogoTitle>{header.title}</LogoTitle>
            <LogoSubtitle>{header.subtitle}</LogoSubtitle>
          </LogoTextContainer>
        </LogoContainer>
        <NavContainer>
          <NavButtons>
            <DesktopButtons>
              {user ? (
                <>
                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
                  {eventRegistrationStatus === 'COMPLETE' && (
                    <NavButton to="/events" $color="secondary">
                      Agenda
                    </NavButton>
                  )}
                  <Button onClick={() => mutateLogout()}>Log out</Button>
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
            <ThemeButton onClick={toggleTheme}>
              <img src={`/icons/toggle-${theme}.svg`} height={20} width={20} />
            </ThemeButton>
          </NavButtons>
        </NavContainer>
        <BurgerMenuContainer $$isOpen={isBurgerMenuOpen} onClick={() => setIsBurgerMenuOpen(false)}>
          <NavButtons>
            <MobileButtons>
              {user ? (
                <>
                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
                  {eventRegistrationStatus === 'COMPLETE' && (
                    <NavButton to="/events" $color="secondary">
                      Agenda
                    </NavButton>
                  )}
                  <Button onClick={() => mutateLogout()}>Log out</Button>
                </>
              ) : (
                <ZupassLoginButton>Login with Zupass</ZupassLoginButton>
              )}
            </MobileButtons>
          </NavButtons>
        </BurgerMenuContainer>
      </HeaderContainer>
    </SyledHeader>
  );
}

export default Header;
