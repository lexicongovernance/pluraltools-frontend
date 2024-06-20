// React and third-party libraries
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import {
  fetchEvent,
  fetchEventCycles,
  fetchEventGroupCategories,
  GetGroupCategoriesResponse,
} from 'api';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Cycles from '../components/cycles';
import EventCard from '../components/event-card';
import Link from '../components/link';
import TabsHeader from '../components/tabs-header';
import TabsManager from '../components/tabs-manager';

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

  const { data: groupCategories } = useQuery({
    queryKey: ['event', eventId, 'group-categories'],
    queryFn: () => fetchEventGroupCategories(eventId || ''),
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

  const tabNames = ['upcoming', 'past'];
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const tabs = {
    upcoming: <Cycles cycles={openCycles} errorMessage="No upcoming events" />,
    past: <Cycles cycles={closedCycles} errorMessage="No past events" />,
  };

  // TODO: flag for showing groups.
  const showGroups = true;

  return (
    <FlexColumn $gap="2rem">
      {event && <EventCard event={event} />}
      <Subtitle>Questions</Subtitle>
      <TabsHeader tabNames={tabNames} onTabChange={setActiveTab} />
      <TabsManager tabs={tabs} tab={activeTab} fallback={'Tab not found'} />
      {showGroups && <Groups groups={groupCategories} />}
      <RunningText />
    </FlexColumn>
  );
}

function RunningText() {
  const navigate = useNavigate();

  const handleDataPolicyClick = () => {
    navigate(`/data-policy`);
  };

  const handleOnboardingClick = () => {
    navigate(`/onboarding`);
  };

  return (
    <Body>
      Click to revisit the{' '}
      <Link
        to="#"
        onClick={handleOnboardingClick}
        state={{ onboardingStep: 2, previousPath: location.pathname }}
      >
        event rules
      </Link>
      ,{' '}
      <Link
        to="#"
        onClick={handleOnboardingClick}
        state={{ onboardingStep: 0, previousPath: location.pathname }}
      >
        trust assumptions
      </Link>
      , and the community’s{' '}
      <Link to="#" onClick={handleDataPolicyClick}>
        data policy
      </Link>
      .
    </Body>
  );
}

function Groups({ groups }: { groups: GetGroupCategoriesResponse | null | undefined }) {
  const navigate = useNavigate();

  return groups ? (
    <>
      <Subtitle>Groups</Subtitle>
      <FlexRow $wrap>
        {groups.map((group) => (
          <Button
            key={group.id}
            onClick={() => navigate(`/secret-groups?groupCategory=${group.name}`)}
          >
            {group.name}
          </Button>
        ))}
      </FlexRow>
    </>
  ) : (
    <Body>No groups</Body>
  );
}

export default Event;
