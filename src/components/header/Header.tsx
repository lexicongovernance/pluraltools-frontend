import logout from '../../api/logout';
import Button from '../button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ZupassLoginButton from '../zupassLoginButton';
import { HeaderContainer, NavButtons, SyledHeader, StyledNavLink, Logo } from './Header.styled';
import useUser from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

function Header() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return (
    <SyledHeader>
      <HeaderContainer>
        <Logo onClick={() => navigate('/home')}>
          Plural
          <br />
          MEV
        </Logo>
        <nav>
          <NavButtons>
            {user ? (
              <>
                <li>
                  <StyledNavLink to="/home">
                    <Button variant="text" tabIndex={-1}>
                      Home
                    </Button>
                  </StyledNavLink>
                </li>
                <li>
                  <StyledNavLink to="/register">
                    <Button variant="text" tabIndex={-1}>
                      Register
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
