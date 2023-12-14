import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useFetchNonce from '../hooks/useFetchNonce'
import useFetchUserData from '../hooks/useFetchUserData'

const useZupassLogin = () => {
  const { nonce } = useFetchNonce()
  const { userData } = useFetchUserData()
  const { setAuthUser, setIsLogged } = useAuth()

  useEffect(() => {
    if (userData) {
      console.log('Setting auth user to:', userData)
      setAuthUser(userData)
      setIsLogged(true)
    }
  }, [userData, setAuthUser, setIsLogged])

  return { nonce }
}

export default useZupassLogin
