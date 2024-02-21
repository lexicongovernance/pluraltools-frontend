// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { fetchEvent, fetchEventCycles } from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import BackButton from '../components/backButton';
import EventCard from '../components/eventCard';
import VotingCards from '../components/votingCards';
import { useMemo } from 'react';

function Event() {
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
  const upcomingCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'UPCOMING'),
    [eventCycles],
  );
  const closedCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'CLOSED'),
    [eventCycles],
  );

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      {event && <EventCard event={event} $direction="row" />}
      {!!openCycles?.length && <VotingCards state="open" cards={openCycles} />}
      {!!upcomingCycles?.length && <VotingCards state="upcoming" cards={upcomingCycles} />}
      {!!closedCycles?.length && <VotingCards state="closed" cards={closedCycles} />}
    </FlexColumn>
  );
}

export default Event;
