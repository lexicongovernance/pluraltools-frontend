import { HeaderContainer, NavButtons, SyledHeader } from './Header.styled'

function Header() {
  return (
    <SyledHeader>
      <HeaderContainer>
        <div>Our logo</div>
        <nav>
          <NavButtons>
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
