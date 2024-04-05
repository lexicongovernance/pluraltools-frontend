import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, fetchGroups, fetchUserGroups, updateUserData } from 'api';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Select from '../components/select';
import Label from '../components/typography/Label';
import Title from '../components/typography/Title';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { useAppStore } from '../store';
import { AuthUser } from '../types/AuthUserType';
import { DBEvent } from '../types/DBEventType';
import { GetGroupsResponse } from '../types/GroupType';
import { formatGroups } from '../utils/formatGroups';

type InitialUser = {
  username: string;
  name: string;
  email: string;
  group: string;
};

function Account() {
  const { user, isLoading: userIsLoading } = useUser();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    enabled: !!user?.id,
  });

  const { data: userGroups, isLoading: userGroupsIsLoading } = useQuery({
    queryKey: ['user', user?.id, 'groups'],
    queryFn: () => fetchUserGroups(user?.id || ''),
    enabled: !!user?.id,
  });

  const initialUser = {
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    group: (userGroups && userGroups[0]?.id) || '',
  };

  if (userIsLoading || userGroupsIsLoading) {
    return <Title>Loading...</Title>;
  }

  return (
    <AccountForm
      initialUser={initialUser}
      user={user}
      groups={groups}
      userGroups={userGroups}
      events={events}
    />
  );
}

function AccountForm({
  initialUser,
  user,
  groups,
  userGroups,
  events,
}: {
  initialUser: InitialUser;
  user: AuthUser | null | undefined;
  groups: GetGroupsResponse[] | null | undefined;
  userGroups: GetGroupsResponse[] | null | undefined;
  events: DBEvent[] | null | undefined;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);

  const { mutate: mutateUserData } = useMutation({
    mutationFn: updateUserData,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['user-groups'] });
      }
    },
    onError: () => {
      toast.error('There was an error, please try again.');
    },
  });

  const {
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    defaultValues: initialUser,
    mode: 'all',
  });

  const onSubmit = (value: typeof initialUser) => {
    if (user && user.id) {
      mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        groupIds: [value.group],
        userAttributes: {
          name: value.name,
        },
      });

      toast.success('User data updated!');

      if (userStatus === 'INCOMPLETE') {
        setUserStatus('COMPLETE');
        if (events?.length === 1) {
          navigate(`/events/${events[0].id}/register`);
        } else {
          navigate('/events');
        }
      }
    }
  };

  const userRegistered = userGroups && userGroups?.length > 0;

  return (
    <FlexColumn>
      <FlexRow $justifyContent="space-between">
        <Title>{userRegistered ? 'Your Account' : 'Complete your profile'}</Title>
        {userRegistered && <Chip>Registered</Chip>}
      </FlexRow>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label $required>Username</Label>
            <Input {...register('username', { required: 'Username is required', minLength: 3 })} />
            <ErrorText>{errors.username?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Name</Label>
            <Input {...register('name')} />
            <ErrorText>{errors.name?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Email</Label>
            <Input {...register('email')} />
            <ErrorText>{errors.email?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label $required>Affiliation</Label>
            <Controller
              name="group"
              control={control}
              rules={{ required: 'Group is required' }}
              render={({ field }) => (
                <Select
                  options={formatGroups(groups).map((group) => ({
                    name: group.name,
                    id: group.id,
                  }))}
                  placeholder="Select group"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                />
              )}
            />
            <ErrorText>{errors.group?.message}</ErrorText>
          </FlexColumn>
          <FlexRow $alignSelf="flex-end">
            <Button type="submit" disabled={!isValid}>
              Submit
            </Button>
          </FlexRow>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
