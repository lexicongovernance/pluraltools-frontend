// React and third-party libraries
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// API
import { fetchEvents } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Title } from '../components/typography/Title.styled';
import EventCard from '../components/event-card';

function Events() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

  const handleClick = (eventId: string) => {
    navigate(`/events/${eventId}/cycles`);
  };

  return (
    <FlexColumn $gap="2rem">
      <Title>Welcome, {user?.username ?? 'User'}</Title>
      {events?.map((event) => {
        return <EventCard key={event.id} event={event} onClick={() => handleClick(event.id)} />;
      })}
    </FlexColumn>
  );
}

export default Events;
