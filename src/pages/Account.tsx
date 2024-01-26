import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodValidator } from '@tanstack/zod-form-adapter';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import fetchGroups from '../api/fetchGroups';
import fetchUserAttributes from '../api/fetchUserAttributes';
import fetchUserGroups from '../api/fetchUserGroups';
import updateUserData from '../api/updateUserData';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Select from '../components/form/Select';
import Label from '../components/typography/Label';
import Title from '../components/typography/Title';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { useAppStore } from '../store';

const ACADEMIC_CREDENTIALS = ['Bachelors', 'Masters', 'PhD', 'JD', 'None', 'Other'];

function Account() {
  const { user } = useUser();
  const userStatus = useAppStore((state) => state.userStatus);
  const setUserStatus = useAppStore((state) => state.setUserStatus);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 10000,
    retry: false,
  });

  const { data: userGroups } = useQuery({
    queryKey: ['user', user?.id, 'groups'],
    queryFn: () => fetchUserGroups(user?.id || ''),
    enabled: !!user?.id,
    staleTime: 10000,
    retry: false,
  });

  const { data: userAttributes } = useQuery({
    queryKey: ['user', user?.id, 'attributes'],
    queryFn: () => fetchUserAttributes(user?.id || ''),
    enabled: !!user?.id,
    retry: false,
  });

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

  const initialUser = {
    username: user?.username || '',
    email: user?.email || '',
    group: (userGroups && userGroups[0]?.id) || '',
    userAttributes: userAttributes?.reduce(
      (acc, curr) => {
        acc[curr.attributeKey] = curr.attributeValue;
        return acc;
      },
      {
        institution: '',
        publications: '',
        'academic-credentials': '',
      } as Record<string, string>
    ),
  };

  const form = useForm({
    defaultValues: initialUser,
    onSubmit: ({ value }) => {
      if (user && user.id) {
        mutateUserData({
          userId: user.id,
          username: value.username,
          email: value.email,
          groupIds: [value.group],
          userAttributes: value.userAttributes ?? {},
        });

        toast.success('User data updated!');

        if (userStatus === 'INCOMPLETE') {
          setUserStatus('COMPLETE');
          navigate('/events');
        }
      }
    },
  });

  const { Provider, Field, Subscribe } = form;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  const userRegistered = userGroups && userGroups?.length > 0;

  return (
    <FlexColumn>
      <FlexRow $justifyContent="space-between">
        <Title>{userRegistered ? 'Your Account' : 'Complete your profile'}</Title>
        {userRegistered && <Chip>Registered</Chip>}
      </FlexRow>
      <Provider>
        <form onSubmit={(e) => handleSubmit(e)}>
          <FlexColumn>
            <Field
              name="username"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z
                  .string()
                  .min(3, { message: 'Username must be 3 characters or longer.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label $required>Username</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="email"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().email('Not a valid email').nullable(),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label>Email</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="group"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().min(1, { message: 'Please select a value.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label $required>Affiliation</Label>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Please choose an affiliation
                    </option>
                    {groups?.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="userAttributes.institution"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().min(1, { message: 'Please select a value.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label $required>Institution</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="userAttributes.publications"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().min(1, { message: 'Please select a value.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label $required>Publications</Label>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <Field
              name="userAttributes.academic-credentials"
              validatorAdapter={zodValidator}
              validators={{
                onChange: z.string().min(1, { message: 'Please select a value.' }),
              }}
              children={(field) => (
                <FlexColumn $gap="0.5rem">
                  <Label $required>Academic Credentials</Label>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Please choose an academic credential
                    </option>
                    {ACADEMIC_CREDENTIALS?.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                  <ErrorText>{field.state.meta.errors}</ErrorText>
                </FlexColumn>
              )}
            />
            <FlexRow $alignSelf="flex-end">
              <Subscribe
                selector={(state) => [state.canSubmit, state.values]}
                children={([canSubmit, values]) => {
                  const isEqual = JSON.stringify(values) === JSON.stringify(initialUser);
                  return (
                    <Button type="submit" disabled={isEqual || !canSubmit}>
                      Submit
                    </Button>
                  );
                }}
              />
            </FlexRow>
          </FlexColumn>
        </form>
      </Provider>
    </FlexColumn>
  );
}

export default Account;
