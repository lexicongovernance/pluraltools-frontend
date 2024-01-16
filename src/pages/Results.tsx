import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchForumQuestionStatistics } from '../api';
import fetchCycle from '../api/fetchCycle';

function Results() {
  const { cycleId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    retry: false,
  });

  const { data: statistics } = useQuery({
    queryKey: ['cycles', cycleId, 'forumQuestions', 0, 'statistics'],
    queryFn: () => fetchForumQuestionStatistics(cycle?.forumQuestions[0].id || ''),
    enabled: !!cycle?.id,
    retry: false,
  });

  return <div>{JSON.stringify(statistics)}</div>;
}

export default Results;
