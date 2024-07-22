// React and third-party libraries
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import { GetCycleResponse, fetchEvent, fetchEventCycles } from 'api';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Table } from '../components/table';
import Button from '../components/button';
import EventCard from '../components/event-card';
import Link from '../components/link';
import { OnboardingCard } from '@/components/onboarding/Onboaring.styled';
import { Subtitle } from '@/components/typography/Subtitle.styled';
import Onboarding from '@/components/onboarding';

const steps = [
  {
    target: '.step-1',
    content: (
      <OnboardingCard>
        <Subtitle>Welcome</Subtitle>
        <Body>Welcome to our tool!</Body>
        <Body>Would you like to take a tour to see how it works?</Body>
      </OnboardingCard>
    ),
    placement: 'center',
  },
  {
    target: '.step-2',
    content: (
      <OnboardingCard>
        <Subtitle>Open Votes</Subtitle>
        <Body>Explore current vote items, the vote deadline, and cast your vote.</Body>
      </OnboardingCard>
    ),
    placement: 'center',
  },
  {
    target: '.step-3',
    content: (
      <OnboardingCard>
        <Subtitle>Closed Votes</Subtitle>
        <Body>
          Review past votes and see results by clicking the
          <Button $color="secondary" style={{ paddingInline: 4 }}>
            results
          </Button>{' '}
          button.
        </Body>
      </OnboardingCard>
    ),
    placement: 'center',
  },
];

function Event() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId || ''),
    enabled: !!eventId,
  });

  const { data: eventCycles } = useQuery({
    queryKey: ['events', eventId, 'cycles'],
    queryFn: () => fetchEventCycles(eventId || ''),
    enabled: !!eventId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const openCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'OPEN'),
    [eventCycles],
  );
  const closedCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'CLOSED'),
    [eventCycles],
  );

  const handleDataPolicyClick = () => {
    navigate(`/data-policy`);
  };

  // TODO: Create functions to navigate to onboarding slides

  const handleOnboardingClick = () => {
    navigate(`/onboarding`);
  };

  return (
    <>
      <Onboarding steps={steps} type="event" />
      <FlexColumn $gap="2rem" className="step-1 step-2 step-3">
        {/* <BackButton /> */}
        {!!openCycles?.length && <CycleTable cycles={openCycles} status="open" />}
        {!!closedCycles?.length && <CycleTable cycles={closedCycles} status="closed" />}
        {event && <EventCard event={event} />}
        <Body>
          Click to revisit the{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 2, previousPath: location.pathname }}
          >
            event rules
          </Link>
          ,{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 0, previousPath: location.pathname }}
          >
            trust assumptions
          </Link>
          , and the community’s{' '}
          <Link to="#" onClick={handleDataPolicyClick}>
            data policy
          </Link>
          .
        </Body>
      </FlexColumn>
    </>
  );
}

function CycleTable({ cycles, status }: { cycles: GetCycleResponse[]; status: 'open' | 'closed' }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const formatDate = (date: string) => {
    const eventEndDate = new Date(date);
    return eventEndDate.toLocaleDateString();
  };
  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  const formattedColumnText = () => {
    if (status === 'open') {
      return 'Closes on';
    } else {
      return 'Closed on';
    }
  };

  return (
    <Table
      columns={[
        `${status.charAt(0).toUpperCase() + status.slice(1)} Agendas`,
        formattedColumnText(),
        '',
      ]}
      rows={cycles.map((cycle) => [
        cycle.forumQuestions?.[0]?.questionTitle,
        formatDate(cycle.endAt),
        <Button onClick={() => handleClick(cycle.id)}>
          {status === 'open' ? 'Vote' : 'Results'}
        </Button>,
      ])}
    />
  );
}

export default Event;
