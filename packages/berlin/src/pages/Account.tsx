// React and third-party libraries
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// API Calls
import {
  type GetUserResponse,
  fetchEvents,
  fetchGroups,
  fetchUserAttributes,
  fetchUsersToGroups,
  putUser,
  putUsersToGroups,
  postUsersToGroups,
  GetGroupsResponse,
  GetEventsResponse,
} from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRowToColumn } from '../components/containers/FlexRowToColumn.styled';
import { Title } from '../components/typography/Title.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import IconButton from '../components/icon-button';
import Input from '../components/input';
import Label from '../components/typography/Label';
import Select from '../components/select';

// Hooks
import useUser from '../hooks/useUser';

import { formatGroups } from '../utils/formatGroups';

// Store
import { useAppStore } from '../store';
import { Body } from '../components/typography/Body.styled';
import { useEffect, useMemo } from 'react';

const ACADEMIC_CREDENTIALS = ['Bachelors', 'Masters', 'PhD', 'JD', 'None'];

type CredentialsGroup = {
  credential: string;
  institution: string;
  field: string;
}[];

type UserAttributes = {
  role: string;
  customGroupName?: string;
  publications: { value: string }[];
  contributions: { value: string }[];
  credentialsGroup: CredentialsGroup;
};

type InitialUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userToGroupId?: string;
  groupId: string;
  telegram: string | null;
  userAttributes: UserAttributes | undefined;
};

function Account() {
  const { user, isLoading: userIsLoading } = useUser();

  const { data: groups } = useQuery({
    queryKey: ['group-categories', 'affiliation', 'groups'],
    queryFn: () => fetchGroups({ groupCategoryName: 'affiliation' }),
    enabled: !!user?.id,
  });

  const { data: usersToGroups, isLoading: userGroupsIsLoading } = useQuery({
    queryKey: ['user', user?.id, 'users-to-groups'],
    queryFn: () => fetchUsersToGroups(user?.id || ''),
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

  const initialUser: InitialUser = useMemo(() => {
    return {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      telegram: user?.telegram || null,
      userToGroupId: usersToGroups?.find((g) => g.group.groupCategory?.name === 'affiliation')?.id,
      groupId:
        usersToGroups?.find((g) => g.group.groupCategory?.name === 'affiliation')?.group.id || '',
      userAttributes: userAttributes?.reduce(
        (acc, curr) => {
          if (curr.attributeKey === 'credentialsGroup') {
            const json = JSON.parse(curr.attributeValue) as CredentialsGroup;
            acc.credentialsGroup = json;
            return acc;
          } else if (
            curr.attributeKey === 'publications' ||
            curr.attributeKey === 'contributions'
          ) {
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
  }, [user, usersToGroups, userAttributes]);

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
  user: GetUserResponse | null | undefined;
  groups: GetGroupsResponse[] | null | undefined;
  events: GetEventsResponse | null | undefined;
}) {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
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

  const { mutate: mutatePostUsersToGroups } = useMutation({
    mutationFn: postUsersToGroups,
    onSuccess: async (body) => {
      if (!body) {
        return;
      }

      if ('errors' in body) {
        toast.error(`There was an error: ${body.errors.join(', ')}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
    },
  });

  const { mutate: mutatePutUsersToGroups } = useMutation({
    mutationFn: putUsersToGroups,
    onSuccess: async (body) => {
      if (!body) {
        return;
      }

      if ('errors' in body) {
        toast.error(`There was an error: ${body.errors.join(', ')}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
    },
  });

  const {
    control,
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    setValue,
    reset,
    trigger,
  } = useForm({
    defaultValues: useMemo(() => initialUser, [initialUser]),
    mode: 'all',
  });

  useEffect(() => {
    reset(initialUser);
  }, [initialUser, reset]);

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

  const watchedGroupInputId = useWatch({ control, name: 'groupId' });
  const customGroupName = 'Custom Affiliation';
  const customGroup = groups?.find(
    (group) => group.name.toLocaleLowerCase() === customGroupName.toLocaleLowerCase(),
  );

  const onSubmit = async (value: typeof initialUser) => {
    if (isValid && user && user.id) {
      await mutateUserData({
        userId: user.id,
        username: value.username,
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        telegram: value.telegram?.trim() !== '' ? value.telegram?.trim() : null,
        userAttributes: {
          ...value.userAttributes,
          credentialsGroup: JSON.stringify(value.userAttributes?.credentialsGroup),
          publications: JSON.stringify(value.userAttributes?.publications),
          contributions: JSON.stringify(value.userAttributes?.contributions),
        },
      });

      // Create user to group if it doesn't exist
      if (!value.userToGroupId) {
        await mutatePostUsersToGroups({
          groupId: value.groupId,
        });
      } else {
        await mutatePutUsersToGroups({
          groupId: value.groupId,
          userToGroupId: value.userToGroupId,
        });
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

  const groupOnCreate = (
    groups: GetGroupsResponse[] | null | undefined,
    customGroupName: string,
    value: string,
  ) => {
    const customGroup = groups?.find(
      (group) => group.name.toLocaleLowerCase() === customGroupName.toLocaleLowerCase(),
    );

    if (customGroup) {
      // set group to custom group id
      setValue('groupId', customGroup?.id);
      trigger('groupId');
    }
    // set otherGroupName to value
    setValue('userAttributes.customGroupName', value);
    trigger('userAttributes.customGroupName');
  };

  return (
    <FlexColumn>
      <Subtitle>Complete your registration</Subtitle>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <FlexColumn>
          <Input
            label="Username"
            placeholder="Enter your Username"
            autoComplete="off"
            required
            {...register('username', { required: 'Username is required', minLength: 3 })}
            errors={errors.username ? [errors.username.message ?? ''] : []}
          />
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
          <Input label="Email" placeholder="Enter your Email" {...register('email')} />
          <Input
            label="Telegram"
            autoComplete="off"
            placeholder="Enter your Telegram handle (e.g., @username)"
            {...register('telegram')}
          />
          <Controller
            name="groupId"
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
                  placeholder={field.value ? field.value : 'Select or create affiliation'}
                  required
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  onOptionCreate={(value) => groupOnCreate(groups, customGroupName, value)}
                  value={field.value}
                  errors={[errors.groupId?.message ?? '']}
                />
                {watchedGroupInputId === customGroup?.id &&
                  initialUser.userAttributes?.customGroupName && (
                    <Body>
                      Your chosen affiliation, {initialUser.userAttributes?.customGroupName}, is
                      being processed and will be updated shortly
                    </Body>
                  )}
              </FlexColumn>
            )}
          />
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
                      placeholder={field.value ? field.value : 'Select or create credential'}
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
                  $padding={0}
                  onClick={() => removeCredentialsGroup(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              $padding={0}
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
                  $padding={0}
                  onClick={() => removePublications(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              $padding={0}
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
                  $padding={0}
                  onClick={() => removeContributions(i)}
                  $color="secondary"
                  icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash icon' }}
                />
              </FlexRowToColumn>
            ))}
            <IconButton
              $padding={0}
              onClick={() => insertContributions(fieldsContributions.length, { value: '' })}
              $color="secondary"
              icon={{ src: `/icons/add-${theme}.svg`, alt: 'Add icon' }}
            />
          </FlexColumn>
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
