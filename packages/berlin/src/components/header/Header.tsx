// React and third-party libraries
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  // useLocation,
  useNavigate,
} from 'react-router-dom';
import { SunMoon, User } from 'lucide-react';

// Store
import { useAppStore } from '../../store';

// Data
import header from '../../data/header';

// API
import { fetchAlerts, fetchEvents, fetchUserRegistrations, logout } from 'api';

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
  IconButton,
  LogoContainer,
  LogoTitle,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  SyledHeader,
} from './Header.styled';

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

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetchAlerts(),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    enabled: !!user,
  });

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  return (
    <SyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <img src={`/logos/lexicon-${theme}.svg`} alt="Lexicon Logo" height={32} width={32} />
          <LogoTitle>{header.title}</LogoTitle>
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
                      {alerts &&
                        alerts.length > 0 &&
                        alerts
                          // newest alerts first
                          .sort(
                            (a, b) =>
                              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
                          )
                          ?.map((alert) => {
                            return (
                              alert.link &&
                              alert.title && (
                                <NavButton
                                  key={alert.title + 1}
                                  to={alert.link}
                                  $color="secondary"
                                  end
                                >
                                  {alert.title}
                                </NavButton>
                              )
                            );
                          })}
                      <NavButton to={`/events/${events?.[0].id}/register`} $color="secondary">
                        My proposals
                      </NavButton>
                      <NavButton to={`/events/${events?.[0].id}/cycles`} $color="secondary">
                        Agenda
                      </NavButton>
                    </>
                  )}
                  <Button onClick={() => mutateLogout()}>Log out</Button>
                  <IconButton onClick={() => navigate('/account')}>
                    <User />
                  </IconButton>
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
            <IconButton onClick={toggleTheme}>
              <SunMoon />
            </IconButton>
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
                      {alerts &&
                        alerts.length > 0 &&
                        alerts?.map((alert) => {
                          return (
                            alert.link &&
                            alert.title && (
                              <NavButton key={alert.title + 1} to={alert.link} $color="secondary">
                                {alert.title}
                              </NavButton>
                            )
                          );
                        })}
                      <NavButton to={`/events/${events?.[0].id}/register`} $color="secondary">
                        My proposals
                      </NavButton>
                      <NavButton to={`/events/${events?.[0].id}/cycles`} $color="secondary">
                        Agenda
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
