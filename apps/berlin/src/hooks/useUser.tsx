import { useQuery } from '@tanstack/react-query';
import { fetchUserData } from 'api';

function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  });

  return { user, isLoading, isError };
}

export default useUser;
