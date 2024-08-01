// React and third party libraries
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

// API
import {
  fetchCycle,
  fetchOptionUsers,
  fetchQuestionFunding,
  fetchQuestionStatistics,
  fetchRegistrationData,
  fetchRegistrationFields,
} from 'api';

// Components
import { FINAL_QUESTION_TITLE } from '../utils/constants';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { resultsSteps } from '@/components/onboarding/Steps';
import { Subtitle } from '../components/typography/Subtitle.styled';
import BackButton from '../components/back-button';
import Onboarding from '@/components/onboarding';
import { Body } from '@/components/typography/Body.styled';
import { Bold } from '@/components/typography/Bold.styled';
import { ChevronDown, Heart, Radical } from 'lucide-react';
import Markdown from 'react-markdown';
import Link from '@/components/link';
import { useAppStore } from '@/store';

function Results() {
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

  // const overallStatistics = [
  //   {
  //     id: 0,
  //     title: 'Number of proposals',
  //     data: statistics?.numProposals,
  //   },
  //   {
  //     id: 1,
  //     title: 'Allocated hearts',
  //     data: statistics?.sumNumOfHearts,
  //   },
  //   {
  //     id: 2,
  //     title: 'Number of participants',
  //     data: statistics?.numOfParticipants,
  //   },
  //   {
  //     id: 3,
  //     title: 'Number of groups',
  //     data: statistics?.numOfGroups,
  //   },
  // ];

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
        {optionStatsArray.map((option) => {
          return <Option key={option.id} option={option} />;
        })}
        {/* <Column>
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
        </FlexColumn> */}
      </FlexColumn>
    </>
  );
}

function Option({
  option,
}: {
  option: {
    allocatedFunding: number | null;
    allocatedHearts: number;
    distinctGroups: number;
    distinctUsers: number;
    id: string;
    listOfGroupNames: string[];
    pluralityScore: string;
    quadraticScore: string;
    subTitle: string;
    title: string;
  };
}) {
  console.log('option:', option);
  console.log('option.distinctUsers:', option.distinctUsers);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);
  const theme = useAppStore((state) => state.theme);
  const { eventId } = useParams();

  useLayoutEffect(() => {
    if (expandedRef.current) {
      setExpandedHeight(isExpanded ? expandedRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const { data: optionUsers } = useQuery({
    queryKey: ['option', option.id, 'users'],
    queryFn: () =>
      fetchOptionUsers({ optionId: option.id || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!option.id,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registrations', 'fields'],
    queryFn: () =>
      fetchRegistrationFields({
        eventId: eventId || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!eventId,
  });

  const { data: registrationData } = useQuery({
    queryKey: ['registrations', optionUsers?.registrationId, 'registration-data'],
    queryFn: () =>
      fetchRegistrationData({
        registrationId: optionUsers?.registrationId || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!optionUsers?.registrationId,
  });

  const author = useMemo(() => {
    if (optionUsers?.user) {
      return `${optionUsers.user?.firstName} ${optionUsers.user?.lastName}`;
    }
    return null;
  }, [optionUsers]);

  const pluralityScore = useMemo(() => {
    const score = parseFloat(String(option.pluralityScore));
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(1);
  }, [option.pluralityScore]);

  const quadraticScore = useMemo(() => {
    const score = parseFloat(option.quadraticScore);
    return score % 1 === 0 ? score.toFixed(0) : score.toFixed(3);
  }, [option.quadraticScore]);

  const researchOutputField = useMemo(
    () => registrationFields?.find((field) => field.name === 'Select research output:'),
    [registrationFields],
  );

  const researchOutputValue = useMemo(() => {
    if (researchOutputField) {
      return registrationData?.find((data) => data.registrationFieldId === researchOutputField.id)
        ?.value;
    }
    return undefined;
  }, [researchOutputField, registrationData]);

  const collaborators = useMemo(() => {
    return optionUsers?.group?.users
      ?.filter(
        (user) =>
          user.firstName !== optionUsers?.user?.firstName ||
          user.lastName !== optionUsers?.user?.lastName,
      )
      .map((user) => `${user.firstName} ${user.lastName}`);
  }, [optionUsers]);

  const handleChevronClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="border-secondary flex w-full flex-col gap-4 border p-4">
      <section className="flex flex-col gap-3">
        <Body>{option.title}</Body>
        {author && (
          <Body>
            <Bold>Creator: </Bold>
            {author}
          </Body>
        )}
        {pluralityScore && (
          <Body>
            <img
              className="inline align-middle"
              src="/icons/plurality-score.svg"
              width={24}
              height={24}
            />{' '}
            {pluralityScore}
          </Body>
        )}
        {quadraticScore && (
          <Body>
            <Radical className="inline align-middle" /> {quadraticScore}
          </Body>
        )}
        <span className="flex items-center justify-between">
          <Body>
            <Heart className="inline align-middle" fill="#ff0000" /> {option.allocatedHearts}
          </Body>
          <ChevronDown
            className={`expand cursor-pointer transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            onClick={handleChevronClick}
          />
        </span>
        {option.allocatedFunding && (
          <Body>
            <img
              className="inline align-middle"
              src={`/logos/arbitrum-${theme}.svg`}
              width={24}
              height={24}
            />{' '}
            {pluralityScore}
          </Body>
        )}
      </section>
      <section
        className="transition-max-height flex flex-col gap-3 overflow-hidden duration-300"
        ref={expandedRef}
        style={{ maxHeight: expandedHeight }}
      >
        {option.distinctUsers !== 0 && (
          <Body className="flex items-center gap-2">
            <Bold>Distinct Voters: </Bold>
            {option.distinctUsers}
          </Body>
        )}
        {option.listOfGroupNames && option.listOfGroupNames.length > 0 && (
          <Body className="flex items-center gap-2">
            <Bold>Voter affiliations:</Bold> {option.listOfGroupNames.join(', ')}
          </Body>
        )}
        {researchOutputValue && (
          <Body className="flex items-center gap-2">
            <Bold>Research Output:</Bold> {researchOutputValue}
          </Body>
        )}
        {collaborators && collaborators.length > 0 && (
          <Body>
            <Bold>Collaborators: </Bold>
            {collaborators.join(', ')}
          </Body>
        )}
        {option.subTitle && (
          <Markdown
            components={{
              a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
              p: ({ node, ...props }) => <Body>{props.children}</Body>,
            }}
          >
            {option.subTitle}
          </Markdown>
        )}
      </section>
    </article>
  );
}

export default Results;
