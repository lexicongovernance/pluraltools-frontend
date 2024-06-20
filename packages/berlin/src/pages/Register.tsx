// React and third-party libraries
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

// API
import {
  GetEventResponse,
  GetGroupCategoriesResponse,
  GetRegistrationsResponseType,
  GetUsersToGroupsResponse,
  fetchEvent,
  fetchEventGroupCategories,
  fetchGroups,
  fetchRegistrationData,
  fetchRegistrationFields,
  fetchRegistrations,
  fetchUsersToGroups,
  postRegistration,
  postUsersToGroups,
  putRegistration,
  putUsersToGroups,
  type GetRegistrationDataResponse,
  type GetRegistrationFieldsResponse,
  type GetRegistrationResponseType,
  type GetUserResponse,
} from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import Button from '../components/button';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Form } from '../components/containers/Form.styled';
import { FormInput } from '../components/form';
import Select from '../components/select';
import Label from '../components/typography/Label';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { SafeArea } from '../layout/Layout.styled';

const sortRegistrationsByCreationDate = (registrations: GetRegistrationResponseType[]) => {
  return [
    ...registrations.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }),
  ];
};

const createRegistrationForms = ({
  registrations,
  usersToGroups,
}: {
  registrations: GetRegistrationsResponseType | undefined | null;
  usersToGroups: GetUsersToGroupsResponse | undefined | null;
}) => {
  const sortedRegistrationsByCreationDate = sortRegistrationsByCreationDate(registrations || []);

  const registrationForms: {
    key: string | 'create';
    registration?: GetRegistrationResponseType;
    group?: GetUsersToGroupsResponse[number]['group'];
    mode: 'edit' | 'create';
  }[] = sortedRegistrationsByCreationDate.map((reg) => {
    return {
      key: reg.id || '',
      registration: reg,
      group: usersToGroups?.find((userToGroup) => userToGroup.group.id === reg.groupId)?.group,
      mode: 'edit',
    };
  });

  registrationForms.push({
    key: 'create',
    mode: 'create',
  });

  return registrationForms;
};

function Register() {
  const { user, isLoading } = useUser();
  const { eventId } = useParams();
  const [selectedRegistrationFormKey, setSelectedRegistrationFormKey] = useState<
    string | undefined
  >();

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registrations } = useQuery({
    queryKey: ['event', eventId, 'registrations'],
    queryFn: () => fetchRegistrations(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registrations', 'fields'],
    queryFn: () => fetchRegistrationFields(eventId || ''),
    enabled: !!eventId,
  });

  const { data: usersToGroups } = useQuery({
    queryKey: ['user', user?.id, 'users-to-groups'],
    queryFn: () => fetchUsersToGroups(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: groupCategories } = useQuery({
    queryKey: ['event', eventId, 'group-categories'],
    queryFn: () => fetchEventGroupCategories(eventId || ''),
    enabled: !!eventId,
  });

  const multipleRegistrationData = useQueries({
    queries:
      registrations?.map((registration) => ({
        queryKey: ['registrations', registration.id, 'registration-data'],
        queryFn: () => fetchRegistrationData(registration.id || ''),
        enabled: !!registration.id,
      })) ?? [],
    combine: (results) => {
      // return a map of registration id to { data, loading }
      return results.reduce(
        (acc, result, idx) => {
          if (registrations && registrations[idx] && result.data) {
            acc[registrations[idx].id || ''] = {
              data: result.data,
              loading: result.isLoading,
            };
          }
          return acc;
        },
        {} as Record<
          string,
          { data: GetRegistrationDataResponse | null | undefined; loading: boolean }
        >,
      );
    },
  });

  const showRegistrationForm = ({
    registrationId,
    selectedRegistrationFormKey,
  }: {
    registrationId?: string;
    selectedRegistrationFormKey?: string;
  }) => {
    if (selectedRegistrationFormKey === 'create' && !registrationId) {
      // show create registration form
      return true;
    }

    return registrationId === selectedRegistrationFormKey;
  };

  const onRegistrationFormCreate = (newRegistrationId: string) => {
    // select the newly created registration form
    setSelectedRegistrationFormKey(newRegistrationId);
  };

  if (isLoading) {
    return <Subtitle>Loading...</Subtitle>;
  }

  return (
    <SafeArea>
      <FlexColumn $gap="1.5rem">
        {groupCategories
          ?.filter((groupCategory) => groupCategory.required)
          .map((groupCategory) => (
            <SelectEventGroup
              key={groupCategory.id}
              groupCategory={groupCategory}
              userToGroups={usersToGroups}
              user={user}
            />
          ))}
        <SelectRegistrationDropdown
          onSelectedRegistrationFormKeyChange={setSelectedRegistrationFormKey}
          registrations={registrations}
          usersToGroups={usersToGroups}
          selectedRegistrationFormKey={selectedRegistrationFormKey}
          multipleRegistrationData={multipleRegistrationData}
          registrationFields={registrationFields}
        />
        {createRegistrationForms({ registrations, usersToGroups }).map((form, idx) => {
          return (
            <RegisterForm
              show={showRegistrationForm({
                selectedRegistrationFormKey,
                registrationId: form.registration?.id,
              })}
              usersToGroups={usersToGroups}
              userIsApproved={
                registrations?.some((registration) => registration.status === 'APPROVED')
                  ? true
                  : false
              }
              registrationData={multipleRegistrationData[form.registration?.id || '']?.data}
              key={idx}
              user={user}
              groupId={form.group?.id}
              registrationFields={registrationFields}
              registrationId={form.registration?.id}
              mode={form.mode}
              isLoading={multipleRegistrationData[form.registration?.id || '']?.loading}
              event={event}
              onRegistrationFormCreate={onRegistrationFormCreate}
            />
          );
        })}
      </FlexColumn>
    </SafeArea>
  );
}

const SelectEventGroup = ({
  groupCategory,
  userToGroups,
  user,
}: {
  userToGroups: GetUsersToGroupsResponse | null | undefined;
  groupCategory: GetGroupCategoriesResponse[number] | null | undefined;
  user: GetUserResponse | null | undefined;
}) => {
  // fetch all the groups in the category
  // show a select with all the groups
  // if the user is in a group in that category, show that group as selected
  const [newGroup, setNewGroup] = useState<string | undefined>('');
  const queryClient = useQueryClient();
  const { data: groups } = useQuery({
    queryKey: ['group-category', groupCategory?.id, 'groups'],
    queryFn: () => fetchGroups({ groupCategoryId: groupCategory?.id ?? '' }),
    enabled: !!groupCategory?.id,
  });

  const { mutate: postUsersToGroupsMutation } = useMutation({
    mutationFn: postUsersToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
      toast.success(`Joined group successfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const { mutate: putUsersToGroupsMutation } = useMutation({
    mutationFn: putUsersToGroups,
    onSuccess: (body) => {
      if (!body) {
        return;
      }

      if ('errors' in body) {
        toast.error(body.errors.join(', '));
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
      toast.success(`Updated group successfully!`);
    },
    onError: () => {
      toast.error('Something went wrong.');
    },
  });

  const userGroup = userToGroups?.find(
    (userToGroup) => userToGroup.group.groupCategory?.id === groupCategory?.id,
  );

  const onSubmit = () => {
    if (userGroup && newGroup) {
      // update the group
      putUsersToGroupsMutation({
        groupId: newGroup,
        userToGroupId: userGroup.id,
      });
      return;
    }

    // create a new group
    postUsersToGroupsMutation({ groupId: newGroup });
  };

  return (
    <FlexColumn>
      <Label>Select {groupCategory?.name} group</Label>
      <Select
        value={newGroup || userGroup?.group.id || undefined}
        options={groups?.map((group) => ({ id: group.id, name: group.name })) || []}
        placeholder="Select a Group"
        onChange={setNewGroup}
      />
      <Button
        disabled={!newGroup || (userGroup && userGroup.group.id === newGroup)}
        onClick={onSubmit}
      >
        Save
      </Button>
    </FlexColumn>
  );
};

const SelectRegistrationDropdown = ({
  usersToGroups,
  selectedRegistrationFormKey,
  registrations,
  onSelectedRegistrationFormKeyChange,
  multipleRegistrationData,
  registrationFields,
}: {
  selectedRegistrationFormKey: string | undefined;
  registrations: GetRegistrationsResponseType | undefined | null;
  usersToGroups: GetUsersToGroupsResponse | undefined | null;
  onSelectedRegistrationFormKeyChange: (key: string) => void;
  multipleRegistrationData: Record<
    string,
    {
      data: GetRegistrationDataResponse | null | undefined;
      loading: boolean;
    }
  >;
  registrationFields: GetRegistrationFieldsResponse | null | undefined;
}) => {
  useEffect(() => {
    // select the first registration if it exists
    // and no registration form is selected
    if (
      registrations &&
      registrations.length &&
      registrations[0].id &&
      !selectedRegistrationFormKey
    ) {
      const firstRegistrationId = sortRegistrationsByCreationDate(registrations)[0].id;

      if (firstRegistrationId) {
        onSelectedRegistrationFormKeyChange(firstRegistrationId);
      }
    }
  }, [onSelectedRegistrationFormKeyChange, registrations, selectedRegistrationFormKey]);

  const showRegistrationsSelect = (
    registrations: GetRegistrationsResponseType | null | undefined,
  ): boolean => {
    // only show select when user has previously registered
    return !!registrations && registrations.length > 0;
  };

  const getRegistrationTitle = ({
    multipleRegistrationData,
    registration,
    registrationFields,
  }: {
    multipleRegistrationData: Record<
      string,
      {
        data: GetRegistrationDataResponse | null | undefined;
        loading: boolean;
      }
    >;
    registration: GetRegistrationResponseType | null | undefined;
    registrationFields: GetRegistrationFieldsResponse | null | undefined;
  }) => {
    const firstField = filterRegistrationFields(
      registrationFields,
      registration?.groupId ? 'group' : 'user',
    )?.sort((a, b) => (a.fieldDisplayRank ?? 0) - (b.fieldDisplayRank ?? 0))[0];

    if (!firstField) {
      return '';
    }

    const registrationData = multipleRegistrationData[registration?.id || '']?.data;

    if (!registrationData) {
      return '';
    }

    return (
      registrationData.find((data) => data.registrationFieldId === firstField.id)?.value ??
      'Untitled'
    );
  };

  const createOptionName = ({
    index,
    mode,
    groupName,
    multipleRegistrationData,
    registration,
    registrationFields,
  }: {
    multipleRegistrationData: Record<
      string,
      {
        data: GetRegistrationDataResponse | null | undefined;
        loading: boolean;
      }
    >;
    registration: GetRegistrationResponseType | null | undefined;
    registrationFields: GetRegistrationFieldsResponse | null | undefined;
    mode: 'edit' | 'create';
    index: number;
    groupName?: string;
  }) => {
    if (mode === 'create') {
      return 'Create a new proposal';
    }

    return `${index}. ${getRegistrationTitle({
      multipleRegistrationData,
      registration,
      registrationFields,
    })} ${groupName ? `[${groupName}]` : ''}`;
  };

  return (
    showRegistrationsSelect(registrations) && (
      <FlexColumn $gap="0.5rem">
        <Label>Select Proposal</Label>
        <Select
          value={selectedRegistrationFormKey ?? ''}
          options={createRegistrationForms({ registrations, usersToGroups }).map((form, idx) => ({
            id: form.key,
            name: createOptionName({
              multipleRegistrationData,
              registration: form.registration,
              registrationFields,
              mode: form.mode,
              index: idx + 1,
              groupName: form.group?.name,
            }),
          }))}
          placeholder="Select a Proposal"
          onChange={onSelectedRegistrationFormKeyChange}
        />
      </FlexColumn>
    )
  );
};

const getDefaultValues = (registrationData: GetRegistrationDataResponse | null | undefined) => {
  return registrationData?.reduce(
    (acc, curr) => {
      acc[curr.registrationFieldId] = curr.value;
      return acc;
    },
    {} as Record<string, string>,
  );
};

const filterRegistrationFields = (
  registrationFields: GetRegistrationFieldsResponse | null | undefined,
  client: 'user' | 'group',
) => {
  return registrationFields?.filter((field) => {
    if (field.forGroup && client == 'group') {
      return true;
    }

    if (field.forUser && client == 'user') {
      return true;
    }

    return false;
  });
};

function RegisterForm(props: {
  user: GetUserResponse | null | undefined;
  userIsApproved: boolean;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  registrationFields: GetRegistrationFieldsResponse | null | undefined;
  registrationId: string | null | undefined;
  groupId: string | null | undefined;
  event: GetEventResponse | null | undefined;
  show: boolean;
  mode: 'edit' | 'create';
  isLoading: boolean;
  onRegistrationFormCreate?: (newRegistrationId: string) => void;
  registrationData: GetRegistrationDataResponse | null | undefined;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const prevSelectGroupId = props.groupId ?? 'none';

  // i want to differentiate between when a group is selected and it is not
  // so i can show the correct registration fields
  // i will use the selectedGroupId to do this

  const form = useForm({
    defaultValues: useMemo(
      () => getDefaultValues(props.registrationData),
      [props.registrationData],
    ),
    mode: 'all',
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = form;

  useEffect(() => {
    reset(getDefaultValues(props.registrationData));
  }, [props.registrationData, reset]);

  const sortedRegistrationFields = useMemo(() => {
    const regGroupId = selectedGroupId || prevSelectGroupId;
    const client = regGroupId === 'none' ? 'user' : 'group';

    const sortedFields = filterRegistrationFields(props.registrationFields || [], client);

    // Sort by field_display_rank in ascending order
    sortedFields?.sort((a, b) => (a.fieldDisplayRank || 0) - (b.fieldDisplayRank || 0));

    return sortedFields;
  }, [props.registrationFields, selectedGroupId, prevSelectGroupId]);

  const redirectToHoldingPage = (isApproved: boolean) => {
    if (!isApproved) {
      navigate(`/events/${props.event?.id}/holding`);
    }
  };

  const { mutate: mutateRegistrationData, isPending } = useMutation({
    mutationFn: postRegistration,
    onSuccess: async (body) => {
      if (body) {
        toast.success('Registration saved successfully!');
        await queryClient.invalidateQueries({
          queryKey: ['event', body.eventId, 'registrations'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['registrations', body.id, 'registration-data'],
        });

        props.onRegistrationFormCreate?.(body.id);

        redirectToHoldingPage(props.userIsApproved);
      } else {
        toast.error('Failed to save registration, please try again');
      }
    },
    onError: (error) => {
      console.error('Error saving registration:', error);
      toast.error('Failed to save registration, please try again');
    },
  });

  const { mutate: updateRegistrationData } = useMutation({
    mutationFn: putRegistration,
    onSuccess: async (body) => {
      if (body) {
        toast.success('Registration updated successfully!');

        await queryClient.invalidateQueries({
          queryKey: ['event', props.event?.id, 'registrations'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['registrations', props.registrationId, 'registration-data'],
        });

        redirectToHoldingPage(props.userIsApproved);
      } else {
        toast.error('Failed to update registration, please try again');
      }
    },
    onError: (error) => {
      console.error('Error updating registration:', error);
      toast.error('Failed to update registration, please try again');
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    const regGroupId = selectedGroupId || prevSelectGroupId;
    const client = regGroupId === 'none' ? 'user' : 'group';

    // Filter out empty values
    const filteredValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (value.trim() !== '') {
          acc[key] = value.trim();
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const registrationData = Object.entries(filteredValues).map(([key, value]) => ({
      registrationFieldId: key,
      value: value || '',
    }));

    if (props.mode === 'edit') {
      updateRegistrationData({
        registrationId: props.registrationId || '',
        body: {
          eventId: props.event?.id || '',
          groupId: client === 'user' ? null : regGroupId,
          status: 'DRAFT',
          registrationData: registrationData,
        },
      });
    } else {
      mutateRegistrationData({
        body: {
          eventId: props.event?.id || '',
          groupId: client === 'user' ? null : regGroupId,
          status: 'DRAFT',
          registrationData: registrationData,
        },
      });
    }
  };

  if (props.isLoading) {
    return (
      props.show && (
        <>
          {sortedRegistrationFields?.map((_, idx) => (
            <ContentLoader
              key={idx}
              speed={1.75}
              width={'100%'}
              height={80}
              viewBox="0 0 100% 80"
              backgroundColor="var(--color-gray)"
              foregroundColor="var(--color-darkgray)"
              {...props}
            >
              <rect x="0" y="0" rx="0" ry="0" width="100" height="22" />
              <rect x="0" y="30" rx="4" ry="4" width="100%" height="50" />
            </ContentLoader>
          ))}
          <ContentLoader
            speed={1.75}
            width={'100%'}
            height={80}
            viewBox="0 0 100% 80"
            backgroundColor="var(--color-gray)"
            foregroundColor="var(--color-darkgray)"
            {...props}
          >
            <rect x="0" y="0" rx="8" ry="8" width="72" height="36" />
            <rect x="0" y="52" rx="0" ry="0" width="100%" height="28" />
          </ContentLoader>
        </>
      )
    );
  }

  return props.show ? (
    <FlexColumn>
      <RegisterGroupSelect
        usersToGroups={props.usersToGroups}
        selectedGroupId={selectedGroupId || prevSelectGroupId}
        onChange={setSelectedGroupId}
      />
      <Subtitle>{props.event?.registrationDescription}</Subtitle>
      <Form>
        {sortedRegistrationFields?.map((regField) => (
          <FormInput
            key={regField.id}
            form={form}
            name={regField.id}
            label={regField.name}
            required={regField.required}
            type={regField.type.toLocaleUpperCase()}
            options={regField.registrationFieldOptions?.map((option) => ({
              name: option.value,
              value: option.value,
            }))}
          />
        ))}
      </Form>
      <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isPending}>
        Save
      </Button>
    </FlexColumn>
  ) : (
    <></>
  );
}

function RegisterGroupSelect({
  usersToGroups,
  selectedGroupId,
  onChange,
}: {
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  selectedGroupId: string | null | undefined;
  onChange: (groupId: string) => void;
}) {
  const userGroups = useMemo(() => {
    const userGroups = usersToGroups
      // filter out groups that the user cannot view because they would be secret
      ?.filter((userToGroup) => !userToGroup.group.groupCategory?.userCanView)
      ?.map((userToGroup) => ({
        id: userToGroup.group.id,
        name: userToGroup.group.name,
      }));

    // add an option for the user to select themselves
    userGroups?.unshift({ id: 'none', name: 'None' });

    return userGroups;
  }, [usersToGroups]);

  // n > 1 because the user is always in the 'none' group
  return (
    userGroups &&
    userGroups.length > 1 && (
      <>
        <Label $required>Select group</Label>
        <Select
          required
          value={selectedGroupId ?? undefined}
          options={userGroups || []}
          placeholder="Select a Group"
          onChange={onChange}
        />
      </>
    )
  );
}

export default Register;
