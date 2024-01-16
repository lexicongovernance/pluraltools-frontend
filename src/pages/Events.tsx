import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../api';
import EventCard from '../components/eventCard';
import useUser from '../hooks/useUser';
import { FlexColumn, Grid } from '../layout/Layout.styled';

function Events() {
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
    staleTime: 3000,
    retry: false,
  });

  return (
    <FlexColumn $gap="4rem">
      <h2>Welcome, {user?.username}</h2>
      <Grid $columns={2} $gap="2rem">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            src="/landing-graphic.png"
            title={event.name}
            description={event.description}
            eventId={event.id}
          />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Events;
