// import logout from '../../api/logout';
// import Button from '../button';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import ZupassLoginButton from '../zupassLoginButton';
import { NavLink } from 'react-router-dom';
import {
  HeaderContainer,
  LogoContainer,
  LogoImage,
  LogoSubtext,
  LogoText,
  NavButton,
  NavButtons,
  NavContainer,
  SyledHeader,
} from './Header.styled';
// import useUser from '../../hooks/useUser';
// import { useNavigate } from 'react-router-dom';
// import { useAppStore } from '../../store';

function Header() {
  // const queryClient = useQueryClient();
  // const navigate = useNavigate();
  // const { user } = useUser();
  // const resetState = useAppStore((state) => state.reset);
  // const { mutate: mutateLogout } = useMutation({
  //   mutationFn: logout,
  //   onSuccess: () => {
  //     resetState();
  //     queryClient.removeQueries();
  //   },
  // });

  return (
    <SyledHeader>
      <HeaderContainer>
        <LogoContainer>
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
            <NavButton>
              <NavLink to="/">
                <button>Communities</button>
              </NavLink>
            </NavButton>
            <NavButton>
              <NavLink to="/">
                <button>Account</button>
              </NavLink>
            </NavButton>
            <NavButton>
              <NavLink to="/">
                <button>Log out</button>
              </NavLink>
            </NavButton>
          </NavButtons>
        </NavContainer>
      </HeaderContainer>
      {/* <HeaderContainer>
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
      </HeaderContainer> */}
    </SyledHeader>
  );
}

export default Header;
