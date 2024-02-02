import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import fetchGroups from '../api/fetchGroups';
import fetchUserAttributes from '../api/fetchUserAttributes';
import fetchUserGroups from '../api/fetchUserGroups';
import updateUserData from '../api/updateUserData';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/typography/Label';
import Title from '../components/typography/Title';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { useAppStore } from '../store';
import { AuthUser } from '../types/AuthUserType';
import { GetGroupsResponse } from '../types/GroupType';
import Select from '../components/select';
import { fetchEvents } from '../api';
import { DBEvent } from '../types/DBEventType';

const ACADEMIC_CREDENTIALS = ['Bachelors', 'Masters', 'PhD', 'JD', 'None'];

type CredentialsGroup = {
  credential: string;
  institution: string;
  field: string;
}[];

type UserAttributes = {
  name: string;
  institution: string;
  role: string;
  publications: { value: string }[];
  contributions: { value: string }[];
  credentialsGroup: CredentialsGroup;
};

type InitialUser = {
  username: string;
  email: string;
  group: string;
  userAttributes: UserAttributes | undefined;
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

  const { data: userAttributes, isLoading: userAttributesIsLoading } = useQuery({
    queryKey: ['user', user?.id, 'attributes'],
    queryFn: () => fetchUserAttributes(user?.id || ''),
    enabled: !!user?.id,
  });

  const initialUser = {
    username: user?.username || '',
    email: user?.email || '',
    group: (userGroups && userGroups[0]?.id) || '',
    userAttributes: userAttributes?.reduce(
      (acc, curr) => {
        if (curr.attributeKey === 'credentialsGroup') {
          const json = JSON.parse(curr.attributeValue) as CredentialsGroup;
          acc.credentialsGroup = json;
          return acc;
        } else if (curr.attributeKey === 'publications' || curr.attributeKey === 'contributions') {
          const json = JSON.parse(curr.attributeValue) as { value: string }[];
          acc[curr.attributeKey] = json;
          return acc;
        } else {
          acc[
            curr.attributeKey as keyof Omit<
              UserAttributes,
              'credentialsGroup' | 'publications' | 'contributions'
            >
          ] = curr.attributeValue;
          return acc;
        }
      },
      {
        name: '',
        institution: '',
        role: '',
        publications: [{ value: '' }],
        contributions: [{ value: '' }],
        credentialsGroup: [
          {
            credential: '',
            institution: '',
            field: '',
          },
        ],
      } as UserAttributes
    ),
  };

  if (userIsLoading || userGroupsIsLoading || userAttributesIsLoading) {
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
    setValue,
    trigger,
  } = useForm({
    defaultValues: initialUser,
    mode: 'all',
  });

  const {
    fields: fieldsCredentialsGroup,
    remove: removeCredentialsGroup,
    insert: insertCredentialsGroup,
  } = useFieldArray({
    name: 'userAttributes.credentialsGroup' as const,
    control,
  });

  const {
    fields: fieldsPublications,
    remove: removePublications,
    insert: insertPublications,
  } = useFieldArray({
    name: 'userAttributes.publications' as const,
    control,
  });

  const {
    fields: fieldsContributions,
    remove: removeContributions,
    insert: insertContributions,
  } = useFieldArray({
    name: 'userAttributes.contributions' as const,
    control,
  });

  const onSubmit = (value: typeof initialUser) => {
    if (user && user.id) {
      mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        groupIds: [value.group],
        userAttributes: {
          ...value.userAttributes,
          credentialsGroup: JSON.stringify(value.userAttributes?.credentialsGroup),
          publications: JSON.stringify(value.userAttributes?.publications),
          contributions: JSON.stringify(value.userAttributes?.contributions),
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
            <Input {...register('userAttributes.name')} />
            <ErrorText>{errors.userAttributes?.name?.message}</ErrorText>
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
                  options={groups?.map((group) => ({ name: group.name, id: group.id })) || []}
                  placeholder="Select group"
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                />
              )}
            />
            <ErrorText>{errors.group?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Role</Label>
            <Input
              {...register('userAttributes.role')}
              placeholder="e.g. Founder, Developer, Researcher"
            />
            <ErrorText>{errors.userAttributes?.name?.message}</ErrorText>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label $required>Academic Credentials</Label>
            {fieldsCredentialsGroup.map((field, i) => (
              <FlexColumn $gap="0.5rem" key={field.id}>
                <FlexRow $gap="0.5rem" $alignItems="center">
                  <Controller
                    name={
                      `userAttributes.credentialsGroup.${i}.credential` as `userAttributes.credentialsGroup.${number}.credential`
                    }
                    control={control}
                    rules={{ required: 'Credential is required' }}
                    render={({ field }) => (
                      <Select
                        options={
                          ACADEMIC_CREDENTIALS.map((credential) => ({
                            name: credential,
                            id: credential,
                          })) || []
                        }
                        placeholder="Select or create credential"
                        onChange={(value) => {
                          field.onChange(value);
                          // Check if selected credential is 'None' and set default values accordingly
                          if (value === 'None') {
                            setValue(`userAttributes.credentialsGroup.${i}.institution`, 'None');
                            setValue(`userAttributes.credentialsGroup.${i}.field`, 'None');
                            // Manually trigger validation
                            trigger(`userAttributes.credentialsGroup.${i}.institution`);
                            trigger(`userAttributes.credentialsGroup.${i}.field`);
                          }
                        }}
                        onBlur={field.onBlur}
                        value={field.value}
                        onOptionCreate={field.onChange}
                      />
                    )}
                  />
                  <Input
                    {...register(`userAttributes.credentialsGroup.${i}.institution` as const, {
                      required: 'Institution is required',
                    })}
                    placeholder="Institution (e.g. University of London)"
                  />
                  <Input
                    {...register(`userAttributes.credentialsGroup.${i}.field` as const, {
                      required: 'Field is required',
                    })}
                    placeholder="Field (e.g. Economics)"
                  />
                  <Button variant="text" onClick={() => removeCredentialsGroup(i)}>
                    Remove
                  </Button>
                </FlexRow>
                <div>
                  <ErrorText>
                    {errors.userAttributes?.credentialsGroup?.[i]?.credential?.message}
                  </ErrorText>
                  <ErrorText>
                    {errors.userAttributes?.credentialsGroup?.[i]?.institution?.message}
                  </ErrorText>
                  <ErrorText>
                    {errors.userAttributes?.credentialsGroup?.[i]?.field?.message}
                  </ErrorText>
                </div>
              </FlexColumn>
            ))}
            {/* add a new field button */}
            <Button
              type="button"
              onClick={() => {
                insertCredentialsGroup(fieldsCredentialsGroup.length, {
                  credential: '',
                  institution: '',
                  field: '',
                });
              }}
            >
              Add new credential
            </Button>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Publications (URLs)</Label>
            {fieldsPublications.map((field, i) => (
              <FlexColumn $gap="0.5rem" key={field.id}>
                <FlexRow $gap="0.5rem" $alignItems="center">
                  <Input
                    {...register(`userAttributes.publications.${i}.value` as const, {
                      required: 'URL is required',
                    })}
                    placeholder="URL"
                  />
                  <Button variant="text" onClick={() => removePublications(i)}>
                    Remove
                  </Button>
                </FlexRow>
                <div>
                  <ErrorText>{errors.userAttributes?.publications?.[i]?.value?.message}</ErrorText>
                </div>
              </FlexColumn>
            ))}
            {/* add a new field button */}
            <Button
              type="button"
              onClick={() => {
                insertPublications(fieldsPublications.length, {
                  value: '',
                });
              }}
            >
              Add new publication
            </Button>
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Contributions to MEV (URLs) </Label>
            {fieldsContributions.map((field, i) => (
              <FlexColumn $gap="0.5rem" key={field.id}>
                <FlexRow $gap="0.5rem" $alignItems="center">
                  <Input
                    {...register(`userAttributes.contributions.${i}.value` as const)}
                    placeholder="URL"
                  />
                  <Button variant="text" onClick={() => removeContributions(i)}>
                    Remove
                  </Button>
                </FlexRow>
                <div>
                  <ErrorText>{errors.userAttributes?.contributions?.[i]?.value?.message}</ErrorText>
                </div>
              </FlexColumn>
            ))}
            {/* add a new field button */}
            <Button
              type="button"
              onClick={() => {
                insertContributions(fieldsContributions.length, {
                  value: '',
                });
              }}
            >
              Add new contribution
            </Button>
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
