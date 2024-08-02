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
import { useNavigate } from 'react-router-dom';

function Account() {
  const { user: initialUser, isLoading: userIsLoading } = useUser();
  const isFirstLogin = !initialUser?.username;
  const [tab, setTab] = useState<'view' | 'edit'>(isFirstLogin ? 'edit' : 'view');
  const navigate = useNavigate();

  if (userIsLoading) {
    return <Title>Loading...</Title>;
  }

  const tabs = {
    edit: (
      <AccountForm
        user={initialUser}
        initialUser={{
          email: initialUser?.email ?? '',
          firstName: initialUser?.firstName ?? '',
          lastName: initialUser?.lastName ?? '',
          username: initialUser?.username ?? '',
        }}
        title={isFirstLogin ? 'Complete Account' : 'Edit Account'}
        afterSubmit={() => {
          if (isFirstLogin) {
            navigate('/events');
          }

          setTab('view');
        }}
      />
    ),
    view: <AccountHub user={initialUser} />,
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
    queryFn: () =>
      fetchUserRegistrations({
        userId: user?.id ?? '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
  });

  const { data: options } = useQuery({
    queryKey: ['users', user?.id, 'options'],
    queryFn: () =>
      fetchUserOptions({ userId: user?.id ?? '', serverUrl: import.meta.env.VITE_SERVER_URL }),
  });

  const { data: usersToGroups } = useQuery({
    queryKey: ['users', user?.id, 'groups'],
    queryFn: () =>
      fetchUsersToGroups({ userId: user?.id ?? '', serverUrl: import.meta.env.VITE_SERVER_URL }),
  });

  const cycles = useQueries({
    queries:
      // can be improved by filtering repeated cycles
      options?.map((option) => ({
        queryKey: ['cycles', option.question.cycleId],
        queryFn: () =>
          fetchCycle({
            cycleId: option.question.cycleId,
            serverUrl: import.meta.env.VITE_SERVER_URL,
          }),
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
              key={option.id}
              to={`/events/${cycles.find((c) => c.data?.id === option.question.cycleId)?.data?.eventId}/cycles/${option.question.cycleId}/options/${option.id}`}
            >
              - {option.title}
            </Link>
          ))}
        </FlexColumn>
      </div>
      <div>
        <Subtitle>Groups</Subtitle>
        <FlexColumn>
          {usersToGroups?.map((userToGroup) => (
            <Underline key={userToGroup.group?.id}>- {userToGroup.group?.name}</Underline>
          ))}
        </FlexColumn>
      </div>
    </FlexColumn>
  );
}

export default Account;
