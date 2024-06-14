// React and third-party libraries
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// API Calls
import { type GetUserResponse, fetchEvents, putUser, GetEventsResponse } from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Title } from '../components/typography/Title.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import Input from '../components/input';

// Hooks
import useUser from '../hooks/useUser';

// Store
import { useEffect, useMemo } from 'react';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';

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

  return <AccountForm initialUser={initialUser} user={user} events={events} />;
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

  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: useMemo(() => initialUser, [initialUser]),
    mode: 'all',
  });

  useEffect(() => {
    reset(initialUser);
  }, [initialUser, reset]);

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
            <Input
              label="First name"
              autoComplete="off"
              placeholder="Enter your first name"
              required
              {...register('firstName', { required: 'First name is required' })}
              errors={errors.firstName ? [errors.firstName.message ?? ''] : []}
            />
            <Input
              label="Last name"
              autoComplete="off"
              placeholder="Enter your last name"
              required
              {...register('lastName', { required: 'Last name is required' })}
              errors={errors.lastName ? [errors.lastName.message ?? ''] : []}
            />
          </FlexRowToColumn>
          <Input
            label="Username"
            placeholder="Enter your Username"
            autoComplete="off"
            required
            {...register('username', { required: 'Username is required', minLength: 3 })}
            errors={errors.username ? [errors.username.message ?? ''] : []}
          />
          <Input label="Email" placeholder="Enter your Email" {...register('email')} />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
