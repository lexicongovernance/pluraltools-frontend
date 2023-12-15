import { useQuery } from '@tanstack/react-query'
import fetchUserData from '../api/fetchUserData'

function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })

  return { user, isLoading, isError }
}

export default useUser
