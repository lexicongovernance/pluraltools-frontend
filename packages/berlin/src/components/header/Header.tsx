// React and third-party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
  LogoSubtitle,
  LogoTextContainer,
  LogoTitle,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  StyledHeader,
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

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  return (
    <StyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <img src={`/logos/lexicon-${theme}.svg`} alt="Lexicon Logo" height={64} width={64} />
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
                  <NavButton to={`/events`} $color="secondary">
                    Events
                  </NavButton>
                  <Button onClick={() => mutateLogout()}>Log out</Button>
                  <Button onClick={() => navigate('/account')}>
                    <User />
                  </Button>
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
              <Button onClick={toggleTheme}>
                <SunMoon />
              </Button>
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
