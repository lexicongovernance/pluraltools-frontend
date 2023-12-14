import Hero from '../components/hero'
import useAuth from '../hooks/useAuth'

function Landing() {
  const { isLogged } = useAuth()
  return (
    <>
      <Hero />
      {isLogged && <h2>User is logged: </h2>}
    </>
  )
}

export default Landing
