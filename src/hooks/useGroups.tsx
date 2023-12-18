import { useQuery } from '@tanstack/react-query';
import fetchGroups from '../api/fetchGroups';

function useGroups() {
  const {
    data: groups,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 10000,
  });

  return { groups, isLoading, isError };
}

export default useGroups;
