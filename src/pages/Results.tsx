import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchCycle from '../api/fetchCycle';
import useUser from '../hooks/useUser';

function Results() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { cycleId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles'],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    retry: false,
  });

  return <div></div>;
}

export default Results;
