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

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      {event && <EventCard event={event} $direction="row" />}
      {/* {eventCycles && <VotingCards state="open" cards={eventCycles} />} */}
    </FlexColumn>
  );
}

export default Event;
