// React and third-party libraries
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// API Calls
import {
  fetchEvents,
  fetchGroups,
  fetchUserAttributes,
  fetchUserGroups,
  updateUserData,
} from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import { Title } from '../components/typography/Title.styled';
import Button from '../components/button';
import Checkbox from '../components/checkbox';
import IconButton from '../components/iconButton';
import Input from '../components/input';
import Label from '../components/typography/Label';
import Select from '../components/select';
import { DevTool } from '@hookform/devtools';

// Hooks
import useUser from '../hooks/useUser';

// Types
import { AuthUser } from '../types/AuthUserType';
import { DBEvent } from '../types/DBEventType';
import { GetGroupsResponse } from '../types/GroupType';
import { formatGroups } from '../utils/formatGroups';

// Store
import { useAppStore } from '../store';

const ACADEMIC_CREDENTIALS = ['Bachelors', 'Masters', 'PhD', 'JD', 'None'];

type CredentialsGroup = {
  credential: string;
  institution: string;
  field: string;
}[];

type UserAttributes = {
  institution: string;
  role: string;
  otherGroupName?: string;
  publications: { value: string }[];
  contributions: { value: string }[];
  credentialsGroup: CredentialsGroup;
};

type InitialUser = {
  username: string;
  name: string;
  emailNotification: boolean;
  email: string;
  group: string;
  userAttributes: UserAttributes | undefined;
};

function Account() {
  const { user, isLoading: userIsLoading } = useUser();

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

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

  const initialUser: InitialUser = {
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    emailNotification: user?.emailNotification ?? true,
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
      } as UserAttributes,
    ),
  };

  if (userIsLoading || userGroupsIsLoading || userAttributesIsLoading) {
    return <Title>Loading...</Title>;
  }

  return <AccountForm initialUser={initialUser} user={user} groups={groups} events={events} />;
}

function AccountForm({
  initialUser,
  user,
  groups,
  events,
}: {
  initialUser: InitialUser;
  user: AuthUser | null | undefined;
  groups: GetGroupsResponse[] | null | undefined;
  events: DBEvent[] | null | undefined;
}) {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const queryClient = useQueryClient();

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

  const watchedGroupInputId = useWatch({ control, name: 'group' });

  const otherGroup = groups?.find((group) => group.name.toLocaleLowerCase() === 'other');

  const onSubmit = (value: typeof initialUser) => {
    if (isValid && user && user.id) {
      mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        emailNotification: value.emailNotification,
        name: value.name,
        groupIds: [value.group],
        userAttributes: {
          ...value.userAttributes,
          credentialsGroup: JSON.stringify(value.userAttributes?.credentialsGroup),
          publications: JSON.stringify(value.userAttributes?.publications),
          contributions: JSON.stringify(value.userAttributes?.contributions),
        },
      });

      toast.success('User data updated!');

      if (events?.length ?? 0 > 1) {
        navigate(`/events/${events?.[0].id}/register`);
      }
    }
  };

  const credentialOnChange = (value: string, i: number) => {
    if (value === 'None') {
      setValue(`userAttributes.credentialsGroup.${i}.institution`, 'None');
      setValue(`userAttributes.credentialsGroup.${i}.field`, 'None');
      // Manually trigger validation
      trigger(`userAttributes.credentialsGroup.${i}.institution`);
      trigger(`userAttributes.credentialsGroup.${i}.field`);
    }
  };

  return (
    <FlexColumn>
      <Title>Complete your registration</Title>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FlexColumn>
          <Input
            label="Username"
            placeholder="Enter your Username"
            required
            {...register('username', { required: 'Username is required', minLength: 3 })}
            errors={errors.username ? [errors.username.message ?? ''] : []}
          />
          <Input label="Name" placeholder="Enter your Name" {...register('name')} />
          <Input label="Email" placeholder="Enter your Email" {...register('email')} />
          <Controller
            name="group"
            control={control}
            rules={{ required: 'Affiliation is required' }}
            render={({ field }) => (
              <FlexColumn $gap="0.5rem">
                <Select
                  options={formatGroups(groups).map((group) => ({
                    name: group.name,
                    id: group.id,
                  }))}
                  label="Affiliation"
                  placeholder="Select an affiliation"
                  required
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  value={field.value}
                  errors={[errors.group?.message ?? '']}
                />
              </FlexColumn>
            )}
          />
          {watchedGroupInputId === otherGroup?.id ? (
            <Input
              label="Other Affiliation (if applicable)"
              placeholder="Enter your other affiliation"
              {...register('userAttributes.otherGroupName')}
            />
          ) : null}
          <Input
            label="Role"
            placeholder="Enter your role (e.g., Founder, Researcher)"
            {...register('userAttributes.role')}
          />
          <FlexColumn $gap="0.5rem">
            <Label $required>Academic Credentials</Label>
            {fieldsCredentialsGroup.map((field, i) => (
              <FlexRowToColumn key={field.id}>
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
                      onChange={(value) => {
                        field.onChange(value);
                        // Check if selected credential is 'None' and set default values accordingly
                        credentialOnChange(value, i);
                      }}
                      onBlur={field.onBlur}
                      value={field.value}
                      onOptionCreate={field.onChange}
                      placeholder="Select or create credential"
                      errors={[
                        errors.userAttributes?.credentialsGroup?.[i]?.credential?.message ?? '',
                      ]}
                      $minWidth="208px"
                    />
                  )}
                />
                <Input
                  placeholder="Institution (e.g., MIT)"
                  {...register(`userAttributes.credentialsGroup.${i}.institution` as const, {
                    required: 'Institution is required',
                  })}
                  errors={[
                    errors.userAttributes?.credentialsGroup?.[i]?.institution?.message ?? '',
                  ]}
                />
                <Input
                  placeholder="Field (e.g., Economics)"
                  {...register(`userAttributes.credentialsGroup.${i}.field` as const, {
                    required: 'Field is required',
                  })}
                  errors={[errors.userAttributes?.credentialsGroup?.[i]?.field?.message ?? '']}
                />
                <IconButton
                  onClick={() => removeCredentialsGroup(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              onClick={() => {
                insertCredentialsGroup(fieldsCredentialsGroup.length, {
                  credential: '',
                  institution: '',
                  field: '',
                });
              }}
              $color="secondary"
              icon={{ src: `/icons/add-${theme}.svg`, alt: 'Add icon' }}
            />
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Publications</Label>
            {fieldsPublications.map((field, i) => (
              <FlexRowToColumn key={field.id}>
                <Input
                  placeholder="Add a relevant paper as a URL"
                  {...register(`userAttributes.publications.${i}.value` as const)}
                />
                <IconButton
                  onClick={() => removePublications(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              onClick={() => insertPublications(fieldsPublications.length, { value: '' })}
              $color="secondary"
              icon={{ src: `/icons/add-${theme}.svg`, alt: 'Add icon' }}
            />
          </FlexColumn>
          <FlexColumn $gap="0.5rem">
            <Label>Contributions to MEV</Label>
            {fieldsContributions.map((field, i) => (
              <FlexRowToColumn key={field.id}>
                <Input
                  placeholder="Add an MEV contribution as a URL"
                  {...register(`userAttributes.contributions.${i}.value` as const)}
                />
                <IconButton
                  onClick={() => removeContributions(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              onClick={() => insertContributions(fieldsContributions.length, { value: '' })}
              $color="secondary"
              icon={{ src: `/icons/add-${theme}.svg`, alt: 'Add icon' }}
            />
          </FlexColumn>
          <Controller
            name={`emailNotification`}
            control={control}
            render={({ field }) => (
              <Checkbox
                text="Would you like to receive email notifications?"
                {...field}
                onClick={() => field.onChange(!field.value)}
                value={field.value}
              />
            )}
          />
          <Button type="submit">Submit</Button>
          <DevTool control={control} />
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
