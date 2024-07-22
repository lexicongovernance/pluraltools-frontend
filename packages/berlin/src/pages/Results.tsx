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
import { OnboardingCard } from '@/components/onboarding/Onboaring.styled';
import { Body } from '@/components/typography/Body.styled';
import IconButton from '@/components/icon-button';
import { FlexRow } from '@/components/containers/FlexRow.styled';
import { useAppStore } from '@/store';
import Onboarding from '@/components/onboarding';
import Icon from '@/components/icon';
import { Heart, Radical } from 'lucide-react';

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

  const steps = [
    {
      target: '.step-1',
      content: (
        <OnboardingCard>
          <Subtitle>Results Page</Subtitle>
          <Body>See community decisions.</Body>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-2',
      content: (
        <OnboardingCard>
          <Subtitle>Icons</Subtitle>
          <FlexRow>
            <Icon>
              <Radical />
            </Icon>
            <Body>Quadratic score</Body>
          </FlexRow>
          <FlexRow>
            <Icon>
              <Heart fill="#ff0000" />
            </Icon>
            <Body>Hearts received by a vote item</Body>
          </FlexRow>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality icon' }}
              $width={24}
              $height={24}
            />
            <Body>Plurality score</Body>
          </FlexRow>
        </OnboardingCard>
      ),
      placement: 'center',
    },
    {
      target: '.step-3',
      content: (
        <OnboardingCard>
          <Subtitle>Expand a vote item</Subtitle>
          <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/arrow-down-${theme}.svg`, alt: 'Arrow down icon' }}
              $width={24}
              $height={24}
            />
            <Body>
              Clicking this icon will display the vote item description and other useful
              information.
            </Body>
          </FlexRow>
          {/* <FlexRow>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/comments-${theme}.svg`, alt: 'Comments icon' }}
              $width={24}
              $height={24}
            />
            <Body>Access the comments page to start a discussion with other participants.</Body>
          </FlexRow> */}
        </OnboardingCard>
      ),
      placement: 'center',
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
      <Onboarding steps={steps} type="results" />
      <FlexColumn $gap="2rem" className="step-1 step-2 step-3">
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
