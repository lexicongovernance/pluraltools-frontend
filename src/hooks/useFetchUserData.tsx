import { useEffect, useRef, useState } from 'react'
import { AuthUser } from '../types/AuthUserType'
import fetchUserData from '../api/fetchUserData'

function useFetchUserData() {
  const isMounted = useRef(true)
  const [userData, setUserData] = useState<AuthUser | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUserData = await fetchUserData()
        setUserData(fetchedUserData.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (isMounted.current) {
      fetchData()
    }

    return () => {
      isMounted.current = false
    }
  }, [])

  return { userData }
}

export default useFetchUserData
