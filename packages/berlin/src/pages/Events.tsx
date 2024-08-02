// React and third-party libraries
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// API
import { fetchEvents } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Title } from '../components/typography/Title.styled';
import * as Tabs from '../components/tabs';
import EventsCards from '../components/events';

function Events() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents({ serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user?.id,
  });

  const openEvents = useMemo(() => events?.filter((event) => event.status === 'OPEN'), [events]);
  const closedEvents = useMemo(
    () => events?.filter((events) => events.status === 'CLOSED'),
    [events],
  );

  const tabNames = ['upcoming', 'past'];
  const tabs = {
    upcoming: <EventsCards events={openEvents} errorMessage="No upcoming events..." />,
    past: <EventsCards events={closedEvents} errorMessage="No past events..." />,
  };

  return (
    <FlexColumn $gap="2rem">
      <section className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
        <Title>Events</Title>
        <Tabs.TabsHeader className="tabs" tabNames={tabNames} onTabChange={setActiveTab} />
      </section>
      <section className="grid w-full grid-cols-2 gap-4">
        <Tabs.TabsManager tabs={tabs} tab={activeTab} fallback={'Tab not found'} />
      </section>
    </FlexColumn>
  );
}

export default Events;
