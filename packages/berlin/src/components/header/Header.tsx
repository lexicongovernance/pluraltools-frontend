// React and third-party libraries
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  LogoTitle,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  SyledHeader,
  LogoTextContainer,
  ThemeButton,
} from './Header.styled';
import fetchUserRegistrations from 'api/src/fetchUserRegistrations';

function Header() {
  const queryClient = useQueryClient();
  const { user } = useUser();
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

  const { data: registrationsData } = useQuery({
    queryKey: [user?.id, 'registrations'],
    queryFn: () => fetchUserRegistrations(user?.id ?? ''),
    enabled: !!user,
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
                  {registrationsData?.some(
                    (registration) => registration.status === 'APPROVED',
                  ) && (
                    <>
                      <NavButton to="/events" $color="secondary">
                        Agenda
                      </NavButton>
                      <NavButton to="/groups" $color="secondary">
                        Groups
                      </NavButton>
                    </>
                  )}
                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
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
                  {registrationsData?.some(
                    (registration) => registration.status === 'APPROVED',
                  ) && (
                    <>
                      <NavButton to="/events" $color="secondary">
                        Agenda
                      </NavButton>
                      <NavButton to="/groups" $color="secondary">
                        Groups
                      </NavButton>
                    </>
                  )}
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
    </SyledHeader>
  );
}

export default Header;
