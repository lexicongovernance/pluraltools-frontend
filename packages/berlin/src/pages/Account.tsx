// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// API Calls
import { GetEventsResponse, fetchEvents, putUser, type GetUserResponse } from 'api';

// Components
import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';

// Hooks
import useUser from '../hooks/useUser';

// Store
import { useMemo } from 'react';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import { TextInput } from '../components/form';
import { z } from 'zod';
import { returnZodError } from '../utils/validation';

type InitialUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

function Account() {
  const { user, isLoading: userIsLoading } = useUser();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

  const initialUser: InitialUser = useMemo(() => {
    return {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    };
  }, [user]);

  if (userIsLoading) {
    return <Title>Loading...</Title>;
  }

  return (
    <AccountForm key={initialUser.email} initialUser={initialUser} user={user} events={events} />
  );
}

function AccountForm({
  initialUser,
  user,
  events,
}: {
  initialUser: InitialUser;
  user: GetUserResponse | null | undefined;
  events: GetEventsResponse | null | undefined;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: mutateUserData } = useMutation({
    mutationFn: putUser,
    onSuccess: async (body) => {
      if (!body) {
        return;
      }

      if ('errors' in body) {
        toast.error(`There was an error: ${body.errors.join(', ')}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['user'] });
      await queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'groups'] });

      toast.success('User data updated!');

      if (events?.length === 1) {
        navigate(`/events/${events?.[0].id}/register`);
      }
    },
    onError: () => {
      toast.error('There was an error, please try again.');
    },
  });

  const form = useForm({
    defaultValues: initialUser,
    mode: 'all',
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const onSubmit = async (value: typeof initialUser) => {
    if (isValid && user && user.id) {
      await mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
      });
    }
  };

  return (
    <FlexColumn>
      <Subtitle>Complete your registration</Subtitle>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FlexColumn>
          <FlexRowToColumn>
            <TextInput
              form={form}
              name="firstName"
              label="First name"
              placeholder="Enter your first name"
              required
            />
            <TextInput
              form={form}
              name="lastName"
              label="Last name"
              placeholder="Enter your last name"
              required
            />
          </FlexRowToColumn>
          <TextInput
            form={form}
            name="username"
            label="Username"
            placeholder="Enter your username"
            required
          />
          <TextInput
            form={form}
            name="email"
            label="Email"
            placeholder="Enter your email"
            required
            customValidation={(value) => returnZodError(() => z.string().email().parse(value))}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
