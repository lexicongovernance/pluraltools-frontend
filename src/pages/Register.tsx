import useAuth from '../hooks/useAuth'

function Register() {
  const { authUser } = useAuth()
  return (
    <>
      <h2>Register Page</h2>
      User is: <pre>{JSON.stringify(authUser, null, 2)}</pre>
    </>
  )
}

export default Register
