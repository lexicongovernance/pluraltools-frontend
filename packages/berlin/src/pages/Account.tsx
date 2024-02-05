// Components
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import fetchGroups from '../api/fetchGroups';
import fetchUserAttributes from '../api/fetchUserAttributes';
import fetchUserGroups from '../api/fetchUserGroups';
import updateUserData from '../api/updateUserData';
import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import Input from '../components/input';
import Select from '../components/select';
import Label from '../components/typography/Label';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';
import { AuthUser } from '../types/AuthUserType';
import { GetGroupsResponse } from '../types/GroupType';
import { DBEvent } from '../types/DBEventType';
import { fetchEvents } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

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

  const initialUser = {
    username: user?.username || '',
    email: user?.email || '',
    group: (userGroups && userGroups[0]?.id) || '',
    userAttributes: userAttributes?.reduce(
      (
        acc: { [x: string]: any; credentialsGroup: CredentialsGroup },
        curr: { attributeKey: string; attributeValue: string }
      ) => {
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

      if (events?.length ?? 0 > 1) {
        navigate(`/events/${events?.[0].id}/register`);
      }
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
          <Input label="Name" placeholder="Enter your Name" {...register('userAttributes.name')} />
          <Input label="Email" placeholder="Enter your Email" {...register('email')} />
          <Controller
            name="group"
            control={control}
            rules={{ required: 'Affiliation is required' }}
            render={({ field }) => (
              <FlexColumn $gap="0.5rem">
                <Select
                  options={groups?.map((group) => ({ name: group.name, id: group.id })) || []}
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
          <Input
            label="Role"
            placeholder="Enter your role (e.g., Founder, Researcher)"
            {...register('userAttributes.role')}
          />
          <FlexColumn>
            <FlexColumn $gap="0.5rem">
              <Label $required>Academic Credentials</Label>
              {fieldsCredentialsGroup.map((field, i) => (
                <FlexRow key={field.id}>
                  <Controller
                    name={
                      `userAttributes.credentialsGroup.${i}.credential` as `userAttributes.credentialsGroup.${number}.credential`
                    }
                    control={control}
                    rules={{ required: 'Credential is required' }}
                    render={({ field }) => (
                      <FlexColumn $gap="0.5rem">
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
                          placeholder="Select or create credential"
                          errors={[
                            errors.userAttributes?.credentialsGroup?.[i]?.credential?.message ?? '',
                          ]}
                        />
                      </FlexColumn>
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
                  <Button onClick={() => removeCredentialsGroup(i)} $color="secondary">
                    <div style={{ width: 24 }}>
                      <img src={`/icons/trash-${theme}.svg`} height={24} width={24} />
                    </div>
                  </Button>
                </FlexRow>
              ))}
            </FlexColumn>
            <Button
              onClick={() => {
                insertCredentialsGroup(fieldsCredentialsGroup.length, {
                  credential: '',
                  institution: '',
                  field: '',
                });
              }}
            >
              Add credential
            </Button>
          </FlexColumn>
          <FlexColumn>
            <FlexColumn $gap="0.5rem">
              <Label $required>Publications</Label>
              {fieldsPublications.map((field, i) => (
                <FlexRow key={field.id}>
                  <Input
                    placeholder="Add a relevant paper as a URL"
                    {...register(`userAttributes.publications.${i}.value` as const)}
                  />
                  <Button onClick={() => removePublications(i)} $color="secondary">
                    <div style={{ width: 24 }}>
                      <img src={`/icons/trash-${theme}.svg`} height={24} width={24} />
                    </div>
                  </Button>
                </FlexRow>
              ))}
            </FlexColumn>
            <Button
              onClick={() => {
                insertPublications(fieldsPublications.length, { value: '' });
              }}
            >
              Add publication
            </Button>
          </FlexColumn>
          <FlexColumn>
            <FlexColumn $gap="0.5rem">
              <Label $required>Contributions to MEV</Label>
              {fieldsContributions.map((field, i) => (
                <FlexRow key={field.id}>
                  <Input
                    placeholder="Add an MEV contribution as a URL"
                    {...register(`userAttributes.contributions.${i}.value` as const)}
                  />
                  <Button onClick={() => removeContributions(i)} $color="secondary">
                    <div style={{ width: 24 }}>
                      <img src={`/icons/trash-${theme}.svg`} height={24} width={24} />
                    </div>
                  </Button>
                </FlexRow>
              ))}
            </FlexColumn>
            <Button
              onClick={() => {
                insertContributions(fieldsContributions.length, { value: '' });
              }}
            >
              Add contribution
            </Button>
          </FlexColumn>
          <Button type="submit" disabled={!isValid}>
            Submit
          </Button>
        </FlexColumn>
      </form>
    </FlexColumn>
  );
}

export default Account;
