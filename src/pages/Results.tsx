import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchForumQuestionStatistics } from '../api';
import fetchCycle from '../api/fetchCycle';
import Card from '../components/card';
import { FlexColumn, Grid } from '../layout/Layout.styled';

function Results() {
  const { cycleId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () => fetchCycle(cycleId || ''),
    enabled: !!cycleId,
    retry: false,
  });
  console.log('cycle:', cycle);

  const { data: statistics } = useQuery({
    queryKey: ['cycles', cycleId, 'forumQuestions', 0, 'statistics'],
    queryFn: () => fetchForumQuestionStatistics(cycle?.forumQuestions[0].id || ''),
    enabled: !!cycle?.id,
    retry: false,
  });

  const stats = [
    {
      id: 0,
      title: 'Number of proposals:',
      data: statistics?.numProposals,
    },
    {
      id: 1,
      title: 'Allocated Hearts:',
      data: statistics?.sumNumOfHearts,
    },
    {
      id: 2,
      title: 'Number of participants:',
      data: statistics?.numOfParticipants,
    },
    {
      id: 3,
      title: 'Number of groups:',
      data: statistics?.numOfGroups,
    },
  ];

  const optionStatsArray = Object.entries(statistics?.optionStats || {})
    .map(([id, stats]) => ({
      id,
      ...stats,
    }))
    .sort((a, b) => b.pluralityScore - a.pluralityScore);

  const ResultsCard = styled.article`
    background-color: #1f2021;
    border-radius: 1rem;
    padding: 2rem;
  `;

  return (
    <FlexColumn $gap="4rem">
      <FlexColumn $gap="3rem">
        <h2>Results for: {cycle?.forumQuestions?.[0].title}</h2>
        <Grid $columns={4}>
          {stats.map((stat) => (
            <Card key={stat.id} title={stat.title} body={stat.data} />
          ))}
        </Grid>
      </FlexColumn>
      <FlexColumn $gap="3rem">
        <h2>Leaderboard</h2>
        <FlexColumn $gap="2rem">
          {optionStatsArray.map((option) => (
            <ResultsCard key={option.id}>
              <h3>{option.optionTitle}</h3>
              <p>{option.allocatedHearts}</p>
            </ResultsCard>
          ))}
        </FlexColumn>
      </FlexColumn>
    </FlexColumn>
  );
}

export default Results;
