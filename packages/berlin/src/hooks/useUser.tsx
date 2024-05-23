import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api';

function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return { user, isLoading, isError };
}

export default useUser;
