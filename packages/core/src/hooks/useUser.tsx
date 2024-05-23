import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api/';

function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false,
    staleTime: 10000,
  });

  return { user, isLoading, isError };
}

export default useUser;
