// React and third-party libraries
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

// API Calls
import { putUser, type GetUserResponse } from 'api';

// Components
import Button from '../button';
import { FlexColumn } from '../containers/FlexColumn.styled';
import { Subtitle } from '../typography/Subtitle.styled';

// Store
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';
import { FormTextInput } from '../form-input';
import { z } from 'zod';
import { returnZodError } from '../../utils/validation';

type InitialUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export function AccountForm({
  initialUser,
  user,
  title,
  afterSubmit,
}: {
  initialUser: InitialUser;
  user: GetUserResponse | null | undefined;
  afterSubmit?: () => void;
  title: string;
}) {
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

      toast.success('User data updated!');

      if (afterSubmit) {
        afterSubmit();
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
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
    }
  };

  return (
    <FlexColumn>
      <Subtitle>{title}</Subtitle>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FlexColumn>
          <FlexRowToColumn>
            <FormTextInput
              form={form}
              name="firstName"
              label="First name"
              placeholder="Enter your first name"
              required
            />
            <FormTextInput
              form={form}
              name="lastName"
              label="Last name"
              placeholder="Enter your last name"
              required
            />
          </FlexRowToColumn>
          <FormTextInput
            form={form}
            name="username"
            label="Username"
            placeholder="Enter your username"
            required
          />
          <FormTextInput
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
