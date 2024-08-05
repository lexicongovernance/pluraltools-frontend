// React and third-party libraries
import { useQuery } from '@tanstack/react-query';

// API
import { fetchEvents } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Title } from '../components/typography/Title.styled';
import EventsCards from '../components/events';

function Events() {
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user?.id,
  });

  return (
    <FlexColumn $gap="2rem">
      <section className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
        <Title>Events</Title>
      </section>
      <section className="grid w-full gap-4 md:grid-cols-2">
        <EventsCards events={events} errorMessage="No events found..." />
      </section>
    </FlexColumn>
  );
}

export default Events;
