// React and third-party libraries
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
  DesktopButtons,
  HeaderContainer,
  LogoContainer,
  LogoImage,
  LogoSubtext,
  LogoText,
  MenuButton,
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

  return (
    <SyledHeader>
      <HeaderContainer>
        <LogoContainer onClick={() => navigate('/')}>
          <LogoImage
            src="/logos/logo.png"
            alt="Plural Research logo, a prism with a rainbow over mountains"
            height={96}
            width={96}
          />
          <LogoText>Plural Research</LogoText>
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
            <MenuButton>
              <img src={`/icons/menu-${theme}.svg`} />
            </MenuButton>
            <ThemeButton onClick={toggleTheme}>
              <img src={`/icons/toggle-${theme}.svg`} height={20} width={20} />
            </ThemeButton>
          </NavButtons>
        </NavContainer>
      </HeaderContainer>
    </SyledHeader>
  );
}

export default Header;
