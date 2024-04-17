// React and third-party libraries
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import { GetCycleResponse, fetchEvent, fetchEventCycles } from 'api';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Table } from '../components/table';
// import BackButton from '../components/back-button';
import Button from '../components/button';
import EventCard from '../components/event-card';
import Link from '../components/link';

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
    <FlexColumn $gap="2rem">
      {/* <BackButton /> */}
      {!!openCycles?.length && <CycleTable cycles={openCycles} status="open" />}
      {!!closedCycles?.length && <CycleTable cycles={closedCycles} status="closed" />}
      {event && <EventCard event={event} $direction="row" />}
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
    <div>
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
    </div>
  );
}

export default Event;
