import logout from '../../api/logout';
import Button from '../button';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../main';
import ZupassLoginButton from '../zupassLoginButton';
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled';
import useUser from '../../hooks/useUser';

function Header() {
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
        <div>Our logo</div>
        <nav>
          <NavButtons>
            {user ? (
              <li>
                <Button color="secondary" onClick={mutateLogout}>
                  Log out
                </Button>
              </li>
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
