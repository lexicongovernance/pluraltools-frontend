// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { fetchEvent, fetchEventCycles } from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import CycleCard from '../components/cycleCard';
import { Grid } from '../components/containers/Grid.styled';
import BackButton from '../components/backButton';
import EventCard from '../components/eventCard';

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
      <Title>Votes</Title>
      {eventCycles && (
        <Grid>
          {eventCycles.map((cycle) => (
            <CycleCard key={cycle.id} cycle={cycle} />
          ))}
        </Grid>
      )}
    </FlexColumn>
  );
}

export default Event;
