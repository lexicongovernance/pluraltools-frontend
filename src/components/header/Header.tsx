import useAuth from '../../hooks/useAuth'
import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'

function Header() {
  const { setAuthUser, isLogged, setIsLogged } = useAuth()
  const handleLogOut = () => {
    setAuthUser(null)
    setIsLogged(false)
  }
  return (
    <SyledHeader>
      <HeaderContainer>
        <div>Our logo</div>
        <nav>
          <NavButtons>
            {isLogged && (
              <li>
                <button onClick={handleLogOut}>Log out</button>
              </li>
            )}
            <li>
              <button>Log in</button>
            </li>
            <li>
              <button>Register with Zupass</button>
            </li>
          </NavButtons>
        </nav>
      </HeaderContainer>
    </SyledHeader>
  )
}

export default Header
