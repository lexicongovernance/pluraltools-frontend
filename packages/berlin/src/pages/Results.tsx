import { fetchCycle, fetchForumQuestionFunding, fetchForumQuestionStatistics } from 'api';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import BackButton from '../components/back-button';
import ResultsColumns from '../components/columns/results-columns';
import ResultsTable from '../components/tables/results-table';
import StatsTable from '../components/tables/stats-table';
import StatsColumns from '../components/columns/stats-columns';
import { FINAL_QUESTION_TITLE } from '../utils/constants';
import { Column } from '../components/tables/results-table/ResultsTable.styled';

function Results() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { eventId, cycleId } = useParams();

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

  const { data: funding } = useQuery({
    queryKey: ['funding', cycle?.forumQuestions[0].id],
    queryFn: () => fetchForumQuestionFunding(cycle?.forumQuestions[0].id || ''),
    enabled: !!cycle?.id && cycle?.forumQuestions?.[0].questionTitle === FINAL_QUESTION_TITLE,
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
      allocatedFunding:
        funding?.allocated_funding[id] !== undefined ? funding.allocated_funding[id] : null,
    }))
    .sort((a, b) => parseFloat(b.pluralityScore) - parseFloat(a.pluralityScore));

  return (
    <FlexColumn $gap="2rem">
      <BackButton fallbackRoute={`/events/${eventId}/cycles`} />
      <Subtitle>Results for: {cycle?.forumQuestions?.[0].questionTitle}</Subtitle>
      <Column>
        <ResultsColumns $showFunding={!!funding} />
        {optionStatsArray.map((option, index) => (
          <ResultsTable
            key={option.id}
            $expanded={expandedIndex === index}
            option={option}
            cycleId={cycleId}
            eventId={eventId}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </Column>
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
