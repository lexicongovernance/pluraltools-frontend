// React and third-party libraries
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { fetchEvent, fetchEventCycles, GetCycleResponse } from 'api';

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
import Skeleton from '@/components/skeleton';

function Event() {
  const { eventId } = useParams();
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () =>
      fetchEvent({ eventId: eventId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!eventId,
  });

  const { data: eventCycles } = useQuery({
    queryKey: ['events', eventId, 'cycles'],
    queryFn: () =>
      fetchEventCycles({ eventId: eventId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
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

  const initialTab = useMemo(
    () => (openCycles && openCycles.length > 0 ? 'upcoming' : 'past'),
    [openCycles],
  );

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-3 gap-4">
        <div className="col-span-3 flex flex-col gap-4 md:col-span-2">
          <Skeleton className="h-[100px] md:h-[212px]" />
          <Skeleton className="h-[50px] md:h-[122px]" />
        </div>
        <Skeleton className="col-span-3 h-[250px] md:col-span-1 md:h-[350px]" />
        <Skeleton className="col-span-3 h-[200px]" />
      </div>
    );
  }

  return (
    <>
      <Onboarding steps={eventSteps} type="event" />
      <section className="event grid w-full grid-cols-3 gap-4">
        <div className={`${event?.imageUrl ? 'col-span-2' : 'col-span-3'} flex flex-col gap-4`}>
          <BackButton fallbackRoute="/events" />
          <Subtitle>{event?.name}</Subtitle>
          {event?.description && (
            <div>
              <Markdown
                components={{
                  a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
                  p: ({ node, ...props }) => <Body>{props.children}</Body>,
                }}
              >
                {event.description}
              </Markdown>
            </div>
          )}
        </div>
        {event?.imageUrl && (
          <div className="col-span-3 md:col-span-1">
            <img
              src={event?.imageUrl}
              alt={`${event.name} image`}
              className="h-52 w-full object-cover object-center md:h-full"
            />
          </div>
        )}
        <Questions
          initialTab={initialTab}
          key={initialTab}
          closedCycles={closedCycles}
          eventId={eventId}
          openCycles={openCycles}
        />
      </section>
    </>
  );
}

function Questions({
  initialTab,
  openCycles,
  closedCycles,
  eventId,
}: {
  initialTab: string;
  openCycles: GetCycleResponse[] | undefined;
  eventId?: string;
  closedCycles: GetCycleResponse[] | undefined;
}) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabNames = ['upcoming', 'past'];

  const tabs = {
    upcoming: (
      <Cycles
        cycles={openCycles}
        eventId={eventId}
        fallback={{
          message: 'No upcoming questions available.',
          buttonMessage: 'Past questions',
          buttonOnClick: () => setActiveTab('past'),
        }}
      />
    ),
    past: (
      <Cycles
        cycles={closedCycles}
        eventId={eventId}
        fallback={{
          message: 'No past questions available.',
          buttonMessage: 'Upcoming questions',
          buttonOnClick: () => setActiveTab('upcoming'),
        }}
      />
    ),
  };

  return (
    <FlexColumn className="col-span-3">
      <section className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
        <Subtitle>Questions</Subtitle>
        <Tabs.TabsHeader tabNames={tabNames} activeTab={activeTab} onTabChange={setActiveTab} />
      </section>
      <FlexColumn className="cycles">
        <Tabs.TabsManager tabs={tabs} tab={activeTab} fallback={'Tab not found'} />
      </FlexColumn>
    </FlexColumn>
  );
}
export default Event;
