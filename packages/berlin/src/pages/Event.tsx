// React and third-party libraries
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { fetchEvent, fetchEventCycles } from 'api';

// Components
import { Body } from '../components/typography/Body.styled';
import { eventSteps } from '@/components/onboarding/Steps';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import * as Tabs from '../components/tabs';
import BackButton from '@/components/back-button';
import Cycles from '../components/cycles';
import Link from '../components/link';
import Markdown from 'react-markdown';
import Onboarding from '@/components/onboarding';

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
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const openCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'OPEN'),
    [eventCycles],
  );
  const closedCycles = useMemo(
    () => eventCycles?.filter((cycle) => cycle.status === 'CLOSED'),
    [eventCycles],
  );

  const tabNames = ['upcoming', 'past'];
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const tabs = {
    upcoming: <Cycles cycles={openCycles} errorMessage="No upcoming events..." />,
    past: <Cycles cycles={closedCycles} errorMessage="No past events..." />,
  };

  return (
    <>
      <Onboarding steps={eventSteps} type="event" />
      <FlexColumn $gap="2rem" className="event">
        <BackButton />
        <section className="flex flex-col gap-4">
          <Subtitle>{event?.name}</Subtitle>
          {event?.description && (
            <Markdown
              components={{
                a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
                p: ({ node, ...props }) => <Body>{props.children}</Body>,
              }}
            >
              {event.description}
            </Markdown>
          )}
        </section>
        <section className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
          <Subtitle>Questions</Subtitle>
          <Tabs.TabsHeader className="tabs" tabNames={tabNames} onTabChange={setActiveTab} />
        </section>
        <FlexColumn className="cycles">
          <Tabs.TabsManager tabs={tabs} tab={activeTab} fallback={'Tab not found'} />
        </FlexColumn>
      </FlexColumn>
    </>
  );
}

export default Event;
