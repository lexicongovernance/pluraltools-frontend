// import useZupassLogin from '../../hooks/useZupassLogin'
import logout from '../../api/logout'
import Button from '../button'
// import ZupassLoginButton from '../zupassLoginButton'
import { useMutation, useQuery } from '@tanstack/react-query'
import fetchUserData from '../../api/fetchUserData'
import { queryClient } from '../../main'
import ZupassLoginButton from '../zupassLoginButton'
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'

function Header() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })
  const { mutate: mutateLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return (
    <SyledHeader>
      <HeaderContainer>
        <div>Our logo</div>
        <div>
          user: <pre>{JSON.stringify(user, null, 2)}</pre>
          <br />
        </div>
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
                  <ZupassLoginButton color="secondary">
                    Login with Zupass
                  </ZupassLoginButton>
                </li>
              </>
            )}
          </NavButtons>
        </nav>
      </HeaderContainer>
    </SyledHeader>
  )
}

export default Header
