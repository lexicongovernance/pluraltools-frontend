import { Body } from '../components/typography/Body.styled';
import { Card } from '../components/onboarding/Onboaring.styled';
import { Column } from '../components/tables/results-table/ResultsTable.styled';
import { fetchCycle, fetchForumQuestionFunding, fetchForumQuestionStatistics } from 'api';
import { FINAL_QUESTION_TITLE } from '../utils/constants';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { useAppStore } from '../store';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import BackButton from '../components/back-button';
import IconButton from '../components/icon-button';
import ResultsColumns from '../components/columns/results-columns';
import ResultsTable from '../components/tables/results-table';
import StatsColumns from '../components/columns/stats-columns';
import StatsTable from '../components/tables/stats-table';
import Onboarding from '../components/onboarding';

function Results() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const theme = useAppStore((state) => state.theme);

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

  const steps = [
    {
      target: '.first-step',
      content: (
        <Card>
          <Subtitle>Results page</Subtitle>
          <Body>Check what the community decided.</Body>
        </Card>
      ),
      placement: 'center',
    },
    {
      target: '.second-step',
      content: (
        <Card>
          <Subtitle>Columns</Subtitle>
          <Body>Relevant information about the winning proposals.</Body>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/sqrt-${theme}.svg`, alt: 'Quadratic score icon' }}
            />
            <Body>Quadratic score</Body>
          </FlexRow>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/heart-full.svg`, alt: 'Full heart' }}
            />
            <Body>Represents the amount of hearts a proposal got</Body>
          </FlexRow>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
            />
            <Body>Plurality score</Body>
          </FlexRow>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/logos/arbitrum-${theme}.svg`, alt: 'Arb icon' }}
            />
            <Body>Indicates the requested funding in ARB.</Body>
          </FlexRow>
        </Card>
      ),
    },
    {
      target: '.third-step',
      content: (
        <Card>
          <Subtitle>Expand a proposal</Subtitle>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down' }}
            />
            <Body>
              Clicking this icon will show you the proposal description, research output, lead
              author, collaborators, distinct voters and voter affiliations
            </Body>
          </FlexRow>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
            />
            <Body>
              You can also access the comments page to start a discussion with other users.
            </Body>
          </FlexRow>
        </Card>
      ),
    },
  ];

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
      <Onboarding steps={steps} />
      <FlexColumn $gap="2rem" className="first-step">
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
    </>
  );
}

export default Results;
