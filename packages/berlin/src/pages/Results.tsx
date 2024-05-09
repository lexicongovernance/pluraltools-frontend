import { useQuery } from '@tanstack/react-query';
import { fetchCycle, fetchForumQuestionStatistics } from 'api';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/back-button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Grid } from '../components/containers/Grid.styled';
import ResultCard from '../components/result-card';
import StatsCard from '../components/stats-card';
import ResultsColumns from '../components/results-columns';
import { Subtitle } from '../components/typography/Subtitle.styled';
import StatsColumns from '../components/stats-columns';

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
      <Subtitle>Results for: {cycle?.forumQuestions?.[0].questionTitle}</Subtitle>
      <FlexColumn $gap="0">
        <ResultsColumns />
        {optionStatsArray.map((option, index) => (
          <ResultCard
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
          <StatsCard key={stat.id} title={stat.title} number={stat.data} />
        ))}
      </FlexColumn>
    </FlexColumn>
  );
}

export default Results;
