import { useState } from 'react';
import { AccountForm } from '../components/form/AccountForm';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { TabsManager } from '../components/tabs';
import { Edit, X } from 'lucide-react';
import {
  GetUserResponse,
  fetchCycle,
  fetchUserOptions,
  fetchUserRegistrations,
  fetchUsersToGroups,
} from 'api';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Separator } from '../components/separator';
import { Body } from '../components/typography/Body.styled';
import { useQueries, useQuery } from '@tanstack/react-query';
import Link from '../components/link';
import { Underline } from '../components/typography/Underline.styled';

function Account() {
  const { user, isLoading: userIsLoading } = useUser();
  const [tab, setTab] = useState<'view' | 'edit'>('view');

  if (userIsLoading) {
    return <Title>Loading...</Title>;
  }

  const tabs = {
    edit: (
      <AccountForm
        user={user}
        initialUser={{
          email: user?.email ?? '',
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          username: user?.username ?? '',
        }}
        title="Edit Account"
        afterSubmit={() => {
          setTab('view');
        }}
      />
    ),
    view: <AccountHub user={user} />,
  };

  return (
    <FlexColumn>
      <FlexRow $justify="flex-end">
        {tab === 'view' ? (
          <Edit
            onClick={() => {
              setTab('edit');
            }}
          />
        ) : (
          <X
            onClick={() => {
              setTab('view');
            }}
          />
        )}
      </FlexRow>
      <TabsManager tabs={tabs} tab={tab} fallback={<Title>Tab not found</Title>} />
    </FlexColumn>
  );
}

function AccountHub({ user }: { user: GetUserResponse | null | undefined }) {
  const { data: registrations } = useQuery({
    queryKey: ['users', user?.id, 'registrations'],
    queryFn: () => fetchUserRegistrations(user?.id ?? ''),
  });

  const { data: options } = useQuery({
    queryKey: ['users', user?.id, 'options'],
    queryFn: () => fetchUserOptions(user?.id ?? ''),
  });

  const { data: usersToGroups } = useQuery({
    queryKey: ['users', user?.id, 'groups'],
    queryFn: () => fetchUsersToGroups(user?.id ?? ''),
  });

  const cycles = useQueries({
    queries:
      // can be improved by filtering repeated cycles
      options?.map((option) => ({
        queryKey: ['cycles', option.forumQuestion.cycleId],
        queryFn: () => fetchCycle(option.forumQuestion.cycleId),
      })) ?? [],
  });

  return (
    <FlexColumn>
      <div>
        <Subtitle>
          {user?.firstName} {user?.lastName}
        </Subtitle>
        <Body>@{user?.username}</Body>
        <Body>{user?.email}</Body>
      </div>
      <Separator />
      <div>
        <Subtitle>Events</Subtitle>
        <FlexColumn>
          {registrations
            ?.filter((registrations) => registrations.status !== 'REJECTED')
            .map((registration) => (
              <Link key={registration.eventId} to={`/events/${registration.eventId}/cycles`}>
                - {registration.event?.name}
              </Link>
            ))}
        </FlexColumn>
      </div>
      <div>
        <Subtitle>Proposals</Subtitle>
        <FlexColumn>
          {options?.map((option) => (
            <Link
              to={`/events/${cycles.find((c) => c.data?.id === option.forumQuestion.cycleId)?.data?.eventId}/cycles/${option.forumQuestion.cycleId}/options/${option.id}`}
            >
              - {option.optionTitle}
            </Link>
          ))}
        </FlexColumn>
      </div>
      <div>
        <Subtitle>Groups</Subtitle>
        <FlexColumn>
          {usersToGroups?.map((userToGroup) => <Underline key={userToGroup.group?.id}>- {userToGroup.group?.name}</Underline>)}
        </FlexColumn>
      </div>
    </FlexColumn>
  );
}

export default Account;
