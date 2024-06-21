// React and third-party libraries
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import { GetCycleResponse, fetchEvent, fetchEventCycles } from 'api';

// Components
import { Body } from '../components/typography/Body.styled';
import { Card } from '../components/onboarding/Onboaring.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Table } from '../components/table';
import Button from '../components/button';
import EventCard from '../components/event-card';
import Link from '../components/link';
import Onboarding from '../components/onboarding';

const steps = [
  {
    target: '.first-step',
    content: (
      <Card>
        <Subtitle>Hi there</Subtitle>
        <Body>Welcome to the App onboarding.</Body>
        <Body>Would you like to have a tour to see how it works?</Body>
      </Card>
    ),
    placement: 'center',
  },
  {
    target: '.second-step',
    content: (
      <Card>
        <Subtitle>Open Agendas</Subtitle>
        <Body>
          You can check which proposals are currently open, when they will close and vote on them.
        </Body>
      </Card>
    ),
  },
  {
    target: '.third-step',
    content: (
      <Card>
        <Subtitle>Closed Agendas</Subtitle>
        <Body>
          Here are the past agendas, check what the people choose by clicking the results button
        </Body>
      </Card>
    ),
  },
  {
    target: '.fourth-step',
    content: (
      <Card>
        <Subtitle>Event</Subtitle>
        <Body>This is the information of the current event.</Body>
        <Body>Now go and explore Agenda page by yourself!</Body>
      </Card>
    ),
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
      <Onboarding steps={steps} />
      <FlexColumn $gap="2rem" className="first-step">
        {/* <BackButton /> */}
        <span className="second-step" style={{ width: '100%' }}>
          {!!openCycles?.length && <CycleTable cycles={openCycles} status="open" />}
        </span>
        <span className="third-step" style={{ width: '100%' }}>
          {!!closedCycles?.length && <CycleTable cycles={closedCycles} status="closed" />}
        </span>
        <span className="fourth-step" style={{ width: '100%' }}>
          {event && <EventCard event={event} />}
        </span>
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

function CycleTable({
  cycles,
  status,
}: {
  cycles: GetCycleResponse[];
  status: 'open' | 'closed';
} & React.HTMLAttributes<HTMLTableElement>) {
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
