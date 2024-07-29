// React and third party libraries
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// API
import { fetchCycle, fetchQuestionFunding, fetchQuestionStatistics } from 'api';

// Components
import { Column } from '../components/tables/results-table/ResultsTable.styled';
import { FINAL_QUESTION_TITLE } from '../utils/constants';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { resultsSteps } from '@/components/onboarding/Steps';
import { Subtitle } from '../components/typography/Subtitle.styled';
import BackButton from '../components/back-button';
import Onboarding from '@/components/onboarding';
import ResultsColumns from '../components/columns/results-columns';
import ResultsTable from '../components/tables/results-table';
import StatsColumns from '../components/columns/stats-columns';
import StatsTable from '../components/tables/stats-table';

function Results() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { eventId, cycleId } = useParams();

  const { data: cycle } = useQuery({
    queryKey: ['cycles', cycleId],
    queryFn: () =>
      fetchCycle({ cycleId: cycleId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!cycleId,
    retry: false,
  });

  const { data: statistics } = useQuery({
    queryKey: ['cycles', cycleId, 'forumQuestions', 0, 'statistics', cycle?.questions[0].id],
    queryFn: () =>
      fetchQuestionStatistics({
        questionId: cycle?.questions[0].id || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!cycle?.id,
    retry: false,
  });

  const { data: funding } = useQuery({
    queryKey: ['funding', cycle?.questions[0].id],
    queryFn: () =>
      fetchQuestionFunding({
        questionId: cycle?.questions[0].id || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!cycle?.id && cycle?.questions?.[0].title === FINAL_QUESTION_TITLE,
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
    <>
      <Onboarding steps={resultsSteps} type="results" />
      <FlexColumn $gap="2rem" className="welcome icons expand">
        <BackButton fallbackRoute={`/events/${eventId}/cycles`} />
        <Subtitle>Results for: {cycle?.questions?.[0].title}</Subtitle>
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
    </>
  );
}

export default Results;
