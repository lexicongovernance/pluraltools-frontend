import { fetchCycle, fetchForumQuestionStatistics } from 'api';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import BackButton from '../components/back-button';
import ResultsColumns from '../components/columns/results-columns';
import ResultsTable from '../components/tables/results-table';
import StatsTable from '../components/tables/stats-table';
import StatsColumns from '../components/columns/stats-columns';

function Results() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { cycleId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    retry: false,
  });

  const { data: statistics } = useQuery({
    queryKey: ['cycles', cycleId, 'forumQuestions', 0, 'statistics', cycle?.forumQuestions[0].id],
    queryFn: () => fetchForumQuestionStatistics(cycle?.forumQuestions[0].id || ''),
    enabled: !!cycle?.id,
    retry: false,
  });

  const overallStatistics = [
    {
      id: 0,
      title: 'Number of proposals',
      data: statistics?.numProposals,
    },
    {
      id: 1,
      title: 'Allocated hearts',
      data: statistics?.sumNumOfHearts,
    },
    {
      id: 2,
      title: 'Number of participants',
      data: statistics?.numOfParticipants,
    },
    {
      id: 3,
      title: 'Number of groups',
      data: statistics?.numOfGroups,
    },
  ];

  const optionStatsArray = Object.entries(statistics?.optionStats || {})
    .map(([id, stats]) => ({
      id,
      ...stats,
    }))
    .sort((a, b) => parseFloat(b.pluralityScore) - parseFloat(a.pluralityScore));

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      <Subtitle>Results for: {cycle?.forumQuestions?.[0].questionTitle}</Subtitle>
      <FlexColumn $gap="0">
        <ResultsColumns />
        {optionStatsArray.map((option, index) => (
          <ResultsTable
            key={option.id}
            $expanded={expandedIndex === index}
            option={option}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </FlexColumn>
      <Subtitle>Overall Statistics</Subtitle>
      <FlexColumn $gap="0">
        <StatsColumns />
        {overallStatistics.map((stat) => (
          <StatsTable key={stat.id} title={stat.title} number={stat.data} />
        ))}
      </FlexColumn>
    </FlexColumn>
  );
}

export default Results;
