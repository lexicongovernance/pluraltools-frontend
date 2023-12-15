import fetchUserData from '../api/fetchUserData'
import Hero from '../components/hero'
import { useQuery } from '@tanstack/react-query'

function Landing() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })

  return (
    <>
      <Hero />
      <br />
      {user && (
        <div>
          <h2>User is logged:</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default Landing
