import { logout } from 'api';
import Button from '../button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ZupassLoginButton from '../zupassLoginButton';
import { HeaderContainer, NavButtons, SyledHeader, StyledNavLink, Logo } from './Header.styled';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
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
        <Logo onClick={() => navigate('/events')}>
          Plural
          <br />
          Research
        </Logo>
        <nav>
          <NavButtons>
            {user ? (
              <>
                <li>
                  <StyledNavLink to="/events">
                    <Button variant="text" tabIndex={-1}>
                      Communities
                    </Button>
                  </StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/account">
                    <Button variant="text" tabIndex={-1}>
                      Account
                    </Button>
                  </StyledNavLink>
                </li>
                <li>
                  <Button color="secondary" onClick={mutateLogout}>
                    Log out
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <ZupassLoginButton color="secondary">Login with Zupass</ZupassLoginButton>
                </li>
              </>
            )}
          </NavButtons>
        </nav>
      </HeaderContainer>
    </SyledHeader>
  );
}

export default Header;
