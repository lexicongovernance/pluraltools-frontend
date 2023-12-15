import fetchUserData from '../api/fetchUserData'
import { useQuery } from '@tanstack/react-query'

function Register() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })

  return (
    <>
      <h2>Register Page</h2>
      <br />
      {user && (
        <div>
          <h3>User is logged:</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default Register
