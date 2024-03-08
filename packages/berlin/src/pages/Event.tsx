// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import { GetCycleResponse, fetchEvent, fetchEventCycles } from 'api';

// Components
import { useMemo } from 'react';
import { Table } from '../components/table';
import BackButton from '../components/backButton';
import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import EventCard from '../components/eventCard';
import { Title } from '../components/typography/Title.styled';

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
  const closedCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'CLOSED'),
    [eventCycles],
  );

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      {!!openCycles?.length && <CycleTable cycles={openCycles} status="open" />}
      {!!closedCycles?.length && <CycleTable cycles={closedCycles} status="closed" />}
      {event && <EventCard event={event} $direction="row" />}
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
      <Title style={{ textTransform: 'capitalize' }}>{status} Agendas</Title>
      <Table
        columns={['Agenda', formattedColumnText(), '']}
        rows={cycles.map((cycle) => [
          cycle.forumQuestions?.[0]?.questionTitle,
          formatDate(cycle.endAt),
          <Button onClick={() => handleClick(cycle.id)}>
            {status === 'open' ? 'Vote' : 'RESULTS'}
          </Button>,
        ])}
      />
    </div>
  );
}

export default Event;
