import { useQuery } from '@tanstack/react-query';
import { fetchCycle, fetchForumQuestionStatistics } from 'api';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/backButton';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Grid } from '../components/containers/Grid.styled';
import { Title } from '../components/typography/Title.styled';
import ResultCard from '../components/resultCard';
import StatCard from '../components/statCard';

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
    queryKey: ['cycles', cycleId, 'forumQuestions', 0, 'statistics'],
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
      <Title>Results for: {cycle?.forumQuestions?.[0].questionTitle}</Title>
      <FlexColumn>
        {optionStatsArray.map((option, index) => (
          <ResultCard
            key={option.id}
            index={index}
            $expanded={expandedIndex === index}
            option={option}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </FlexColumn>
      <Title>Overall Statistics</Title>
      <Grid $columns={4}>
        {overallStatistics.map((stat) => (
          <StatCard key={stat.id} title={stat.title} number={stat.data} />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Results;
