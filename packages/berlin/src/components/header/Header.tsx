// React and third-party libraries
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Store
import { useAppStore } from '../../store';

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
  LogoSubtext,
  LogoText,
  MenuButton,
  MobileButtons,
  NavButtons,
  NavContainer,
  SyledHeader,
  ThemeButton,
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
    },
  });

  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  return (
    <SyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <LogoImage
            src="/logos/logo.png"
            alt="Plural Research Experiment logo, a prism with an incoming light beam and a rainbow"
            height={96}
            width={96}
          />
          <LogoText>Plural Research Experiment</LogoText>
          <LogoSubtext>An experiment in research independence and innovation</LogoSubtext>
        </LogoContainer>
        <NavContainer>
          <NavButtons>
            <DesktopButtons>
              {user ? (
                <>
                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
                  <Button onClick={mutateLogout}>Log out</Button>
                </>
              ) : (
                <ZupassLoginButton>Login with Zupass</ZupassLoginButton>
              )}
            </DesktopButtons>
            <MenuButton onClick={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}>
              <Bar isOpen={isBurgerMenuOpen} />
              <Bar isOpen={isBurgerMenuOpen} />
              <Bar isOpen={isBurgerMenuOpen} />
            </MenuButton>
            <ThemeButton onClick={toggleTheme}>
              <img src={`/icons/toggle-${theme}.svg`} height={20} width={20} />
            </ThemeButton>
          </NavButtons>
        </NavContainer>
        <BurgerMenuContainer $isOpen={isBurgerMenuOpen} onClick={() => setIsBurgerMenuOpen(false)}>
          <NavButtons>
            <MobileButtons>
              {user ? (
                <>
                  <NavButton to="/account" $color="secondary">
                    Account
                  </NavButton>
                  <Button onClick={mutateLogout}>Log out</Button>
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
