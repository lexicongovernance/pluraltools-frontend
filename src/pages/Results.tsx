import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchForumQuestionStatistics } from '../api';
import fetchCycle from '../api/fetchCycle';
import Card from '../components/card';
import Subtitle from '../components/typography/Subtitle';
import Title from '../components/typography/Title';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';

const ResultsCard = styled.article<{ $expanded: boolean }>`
  background-color: #1f2021;
  border-radius: 1rem;
  cursor: pointer;
  padding: 2rem;
  position: relative;
  transition: height 0.3s ease-in-out;

  .arrow {
    transform: rotate(${(props) => (props.$expanded ? '180deg' : '0deg')});
    transition: transform 0.3s ease-in-out;
  }

  .statistics {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
  }
`;
const Badge = styled.div<{ $type: 'gold' | 'silver' | 'bronze' }>`
  align-items: center;
  background-image: ${(props) => props.$type && `url('/icons/${props.$type}_badge.svg')`};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  left: -1rem;
  position: absolute;
  top: -0.75rem;
  width: 2.5rem;
`;

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
    .sort((a, b) => parseFloat(b.pluralityScore) - parseFloat(a.pluralityScore));

  return (
    <FlexColumn $gap="4rem">
      <FlexColumn $gap="3rem">
        <Title>Results for: {cycle?.forumQuestions?.[0].title}</Title>
        <Grid $columns={4}>
          {stats.map((stat) => (
            <Card key={stat.id} title={stat.title} body={stat.data} />
          ))}
        </Grid>
      </FlexColumn>
      <FlexColumn $gap="3rem">
        <Title>Leaderboard</Title>
        <FlexColumn $gap="2rem">
          {optionStatsArray.map((option, index) => {
            const formattedPluralityScore =
              parseFloat(option.pluralityScore) % 1 === 0
                ? parseFloat(option.pluralityScore).toFixed(0)
                : parseFloat(option.pluralityScore).toFixed(3);

            return (
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
                      <Title>{option.optionTitle}</Title>
                    </FlexRow>
                    <img className="arrow" src="/arrow_down.svg" alt="Arrow icon" />
                  </FlexRow>
                  <FlexColumn className="statistics">
                    <FlexRow>
                      <Subtitle>Plurality score:</Subtitle>
                      <span>{formattedPluralityScore}</span>
                    </FlexRow>
                    <FlexRow>
                      <Subtitle>Distinct voters:</Subtitle>
                      <span>{option.distinctUsers}</span>
                    </FlexRow>
                    <FlexRow>
                      <Subtitle>Allocated hearts:</Subtitle>
                      <span>{option.allocatedHearts}</span>
                    </FlexRow>
                  </FlexColumn>
                </FlexColumn>
              </ResultsCard>
            );
          })}
        </FlexColumn>
      </FlexColumn>
    </FlexColumn>
  );
}

export default Results;
