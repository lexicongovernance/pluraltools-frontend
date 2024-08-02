import { useQuery } from '@tanstack/react-query';
import { fetchUser } from 'api';

function useUser() {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => fetchUser({ serverUrl: import.meta.env.VITE_SERVER_URL }),
  });

  return { user, isLoading, isError };
}

export default useUser;
