import { useEffect, useRef } from 'react'
import useAuth from '../hooks/useAuth'
import useFetchNonce from '../hooks/useFetchNonce'
import useFetchUserData from '../hooks/useFetchUserData'

const useZupassLogin = () => {
  const isMounted = useRef(true)
  const { nonce } = useFetchNonce()
  const { userData } = useFetchUserData()
  const { setAuthUser, setIsLogged } = useAuth()

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false
      if (userData) {
        console.log('Setting auth user to:', userData)
        setAuthUser(userData)
        setIsLogged(true)
      }
    }

    return () => {
      isMounted.current = false
    }
  }, [userData])

  return { nonce }
}

export default useZupassLogin
