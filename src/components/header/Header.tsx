import useAuth from '../../hooks/useAuth'
import logout from '../../utils/logout'
import Button from '../button'
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'

function Header() {
  const { setAuthUser, isLogged, setIsLogged } = useAuth()

  const handleLogIn = async () => {}
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
                  <Button color="secondary" onClick={handleLogIn}>
                    Login with Zupass
                  </Button>
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
