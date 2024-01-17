import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../api';
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

  const images: Record<string, string> = {
    'Berlin Research Community': '/berlin.png',
    'Zuzalu Agenda Setting': '/taipei.png',
    'Full Node Meetup': '/landing-graphic.png',
  };

  const eventsWithImage = events?.map((event) => ({
    ...event,
    image: images[event.name] || '/landing-graphic.png',
  }));

  return (
    <FlexColumn $gap="4rem">
      <Title>Welcome, {user?.username}</Title>
      <Grid $columns={2} $gap="2rem">
        {eventsWithImage?.map((event) => (
          <EventCard
            key={event.id}
            src={event.image}
            title={event.name}
            // description={event.description}
            eventId={event.id}
          />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Events;
