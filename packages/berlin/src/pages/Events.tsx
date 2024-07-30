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
import * as Tabs from '../components/tabs';
import { useMemo, useState } from 'react';

function Events() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user?.id,
  });

  const handleClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const openEvents = useMemo(() => events?.filter((event) => event.status === 'OPEN'), [events]);
  const closedEvents = useMemo(
    () => events?.filter((events) => events.status === 'CLOSED'),
    [events],
  );

  const tabNames = ['upcoming', 'past'];
  const tabs = {
    upcoming: <EventCard events={openEvents} />,
    past: <Cycles cycles={closedCycles} eventId={eventId} errorMessage="No past events..." />,
  };

  return (
    <FlexColumn $gap="2rem">
      <section className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
        <Title>Events</Title>
        <Tabs.TabsHeader className="tabs" tabNames={tabNames} onTabChange={setActiveTab} />
      </section>
      <section className="grid grid-cols-2 gap-4">
        <Tabs.TabsManager tabs={tabs} tab={activeTab} fallback={'Tab not found'} />

        {/* {events?.map((event) => { */}
        {/* return <EventCard key={event.id} event={event} onClick={() => handleClick(event.id)} />; */}
        {/* })} */}
      </section>
    </FlexColumn>
  );
}

export default Events;
