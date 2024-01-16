import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchForumQuestionStatistics } from '../api';
import fetchCycle from '../api/fetchCycle';
import Card from '../components/card';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';

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

  const ResultsCard = styled.article<{ $expanded: boolean }>`
    background-color: #1f2021;
    border-radius: 1rem;
    max-height: ${(props) => (props.$expanded ? '100%' : '90px')};
    overflow: hidden;
    padding: 2rem;
    transition: max-height 0.3s ease-in-out;
    cursor: pointer;

    .arrow {
      transform: rotate(${(props) => (props.$expanded ? '180deg' : '0deg')});
      transition: transform 0.3s ease-in-out;
    }
  `;

  const Badge = styled.div<{ $type: 'gold' | 'silver' | 'bronze' }>`
    background-image: ${(props) => props.$type && `url('/icons/${props.$type}_badge.svg')`};
    height: 30px;
    width: 30px;
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
          {optionStatsArray.map((option, index) => (
            <ResultsCard
              key={option.id}
              $expanded={expandedIndex === index}
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <FlexColumn $gap="2rem">
                <FlexRow $justifyContent="space-between">
                  <FlexRow $gap="0.5rem">
                    {index === 0 && <Badge $type="gold" />}
                    {index === 1 && <Badge $type="silver" />}
                    {index === 2 && <Badge $type="bronze" />}
                    <h3>{option.optionTitle}</h3>
                  </FlexRow>
                  <img className="arrow" src="/arrow_down.svg" alt="Arrow icon" />
                </FlexRow>
                <FlexColumn>
                  <p>Plurality score: {option.pluralityScore}</p>
                  <p>Distinct voters: {option.distinctUsers}</p>
                  <p>Allocated hearts: {option.allocatedHearts}</p>
                </FlexColumn>
              </FlexColumn>
            </ResultsCard>
          ))}
        </FlexColumn>
      </FlexColumn>
    </FlexColumn>
  );
}

export default Results;
