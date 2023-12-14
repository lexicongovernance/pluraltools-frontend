import useAuth from '../../hooks/useAuth'
// import useZupassLogin from '../../hooks/useZupassLogin'
import logout from '../../utils/logout'
import Button from '../button'
// import ZupassLoginButton from '../zupassLoginButton'
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'

function Header() {
  const { authUser, setAuthUser, isLogged, setIsLogged, nonce } = useAuth()

  const handleLogOut = async () => {
    const response = await logout()
    if (response.status === 204) {
      setAuthUser(null)
      setIsLogged(false)
    }
  }

  return (
    <SyledHeader>
      <HeaderContainer>
        <div>Our logo</div>
        <div>
          user: <pre>{JSON.stringify(authUser, null, 2)}</pre>
          <br />
          nonce: {nonce}
        </div>
        <nav>
          <NavButtons>
            {isLogged ? (
              <li>
                <Button color="secondary" onClick={handleLogOut}>
                  Log out
                </Button>
              </li>
            ) : (
              <>
                <li>
                  {/* <ZupassLoginButton color="secondary" nonce={nonce}>
                    Login with Zupass
                  </ZupassLoginButton> */}
                  <Button color="secondary">Login</Button>
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
