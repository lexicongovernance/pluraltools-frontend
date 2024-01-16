import { useQuery } from '@tanstack/react-query';
import fetchEventCycles from '../api/fetchEventCycles';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/button';
import { useEffect } from 'react';
import { fetchRegistration } from '../api';

function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: eventCycles } = useQuery({
    queryKey: ['event', 'cycles'],
    queryFn: () => fetchEventCycles(eventId || ''),
    enabled: !!eventId,
    staleTime: 10000,
    retry: false,
  });

  const { data: registration } = useQuery({
    queryKey: ['event', eventId, 'registration'],
    queryFn: () => fetchRegistration(eventId || ''),
    enabled: !!eventId,
    retry: false,
  });

  useEffect(() => {
    if (registration === null) {
      navigate(`/events/${eventId}/register`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, registration]);

  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  return eventCycles?.map((eventCycles) => {
    const { title } = eventCycles.forumQuestions[0];
    return (
      <div>
        <p>{eventCycles.status}</p>
        <p>{title}</p>
        <p>Ends in {eventCycles.endAt}</p>
        <Button onClick={() => handleClick(eventCycles.id)}>Go to cycle</Button>
      </div>
    );
  });
}

export default Event;
