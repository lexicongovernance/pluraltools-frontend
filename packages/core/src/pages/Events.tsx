import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from 'api';
import EventCard from '../components/eventCard';
import Title from '../components/typography/Title';
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
      <Title>Welcome, {user?.username}</Title>
      <Grid $columns={2} $gap="2rem">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            src={event.imageUrl}
            title={event.name}
            eventId={event.id}
            buttonText="Go"
          />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Events;
