// React and third-party libraries
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { UseFormReturn, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

// API
import {
  GetEventResponse,
  GetGroupCategoriesResponse,
  GetRegistrationsResponseType,
  GetUsersToGroupsResponse,
  deleteUsersToGroups,
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
import { FormInput, SelectInput } from '../components/form';
import Select from '../components/select';
import Label from '../components/typography/Label';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { SafeArea } from '../layout/Layout.styled';
import { MultiSelect } from '@/components/multi-select/MultiSelect';
import { GROUP_CATEGORY_NAME_TENSION } from '@/utils/constants';
import { LabelContainer } from '@/components/select/Select.styled';
import { Carousel } from '@/components/carousel';

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

  const defaultStep = useMemo(() => {
    // check if the user is already in all required groups for the event
    const requiredCategories = groupCategories?.filter((category) => category.required);
    const userGroups = usersToGroups?.map((userToGroup) => userToGroup.group.groupCategoryId);

    if (requiredCategories && userGroups) {
      const userGroupCategories = requiredCategories.map((category) => category.id);

      if (userGroupCategories.every((category) => userGroups.includes(category))) {
        return 1;
      }
    }

    return 0;
  }, [groupCategories, usersToGroups]);

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

  const onRegistrationFormCreate = (newRegistrationId: string) => {
    // select the newly created registration form
    setSelectedRegistrationFormKey(newRegistrationId);
  };

  if (isLoading) {
    return <Subtitle>Loading...</Subtitle>;
  }

  return (
    <SafeArea>
      <CarouselWrapper
        defaultStep={defaultStep}
        groupCategories={groupCategories}
        usersToGroups={usersToGroups}
        user={user}
        registrations={registrations}
        selectedRegistrationFormKey={selectedRegistrationFormKey}
        multipleRegistrationData={multipleRegistrationData}
        registrationFields={registrationFields}
        event={event}
        onRegistrationFormCreate={onRegistrationFormCreate}
        setSelectedRegistrationFormKey={setSelectedRegistrationFormKey}
      />
    </SafeArea>
  );
}

const CarouselWrapper = ({
  groupCategories,
  usersToGroups,
  user,
  registrations,
  selectedRegistrationFormKey,
  multipleRegistrationData,
  registrationFields,
  event,
  onRegistrationFormCreate,
  setSelectedRegistrationFormKey,
}: {
  defaultStep: number;
  groupCategories: GetGroupCategoriesResponse | null | undefined;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  user: GetUserResponse | null | undefined;
  registrations: GetRegistrationsResponseType | undefined | null;
  selectedRegistrationFormKey: string | undefined;
  multipleRegistrationData: Record<
    string,
    {
      data: GetRegistrationDataResponse | null | undefined;
      loading: boolean;
    }
  >;
  registrationFields: GetRegistrationFieldsResponse | null | undefined;
  event: GetEventResponse | null | undefined;
  onRegistrationFormCreate: (newRegistrationId: string) => void;
  setSelectedRegistrationFormKey: (key: string) => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const redirectToNextPage = (isApproved: boolean, eventId: string) => {
    if (!isApproved) {
      navigate(`/events/${eventId}/holding`);
    }

    navigate(`/events/${eventId}/cycles`);
  };

  const { mutateAsync: postRegistrationMutation, isPending: postRegistrationIsPending } =
    useMutation({
      mutationFn: postRegistration,
      onSuccess: async (body) => {
        if (body) {
          toast.success('Registration saved successfully!');
          await queryClient.invalidateQueries({
            queryKey: ['event', body.eventId, 'registrations'],
          });

          // invalidate user registrations, this is for the 1 event use case
          // where the authentication is because you are approved to the event
          await queryClient.invalidateQueries({
            queryKey: [user?.id, 'registrations'],
          });
        } else {
          toast.error('Failed to save registration, please try again');
        }
      },
      onError: (error) => {
        console.error('Error saving registration:', error);
        toast.error('Failed to save registration, please try again');
      },
    });

  const { mutateAsync: updateRegistrationMutation, isPending: updateRegistrationIsPending } =
    useMutation({
      mutationFn: putRegistration,
      onSuccess: async (body) => {
        if (body) {
          toast.success('Registration updated successfully!');

          await queryClient.invalidateQueries({
            queryKey: ['event', event?.id, 'registrations'],
          });
        } else {
          toast.error('Failed to update registration, please try again');
        }
      },
      onError: (error) => {
        console.error('Error updating registration:', error);
        toast.error('Failed to update registration, please try again');
      },
    });

  const handleSubmit = async () => {
    const foundRegistration = registrations?.at(0);

    if (foundRegistration) {
      await updateRegistrationMutation({
        registrationId: foundRegistration.id || '',
        body: {
          eventId: event?.id || '',
          groupId: null,
          status: 'DRAFT',
          registrationData: [],
        },
      });
    } else {
      await postRegistrationMutation({
        body: {
          eventId: event?.id || '',
          groupId: null,
          status: 'DRAFT',
          registrationData: [],
        },
      });
    }
  };

  return (
    <Carousel
      onComplete={async () => {
        // query registration to check if it is approved
        const registrations = await queryClient.fetchQuery({
          queryKey: ['event', event?.id, 'registrations'],
          queryFn: () => fetchRegistrations(event?.id || ''),
        });

        redirectToNextPage(
          registrations?.some((reg) => reg.status === 'APPROVED') ?? false,
          event?.id || '',
        );
      }}
      steps={[
        {
          isEnabled: (groupCategories?.filter((category) => category.required).length ?? 0) > 0,
          render: ({ isLastStep, handleStepComplete }) => (
            <EventGroupsForm
              // re render on user to groups change
              key={JSON.stringify(usersToGroups)}
              groupCategories={groupCategories}
              usersToGroups={usersToGroups}
              user={user}
              onStepComplete={async () => {
                if (updateRegistrationIsPending || postRegistrationIsPending) {
                  return;
                }

                if (isLastStep) {
                  await handleSubmit();
                }

                await handleStepComplete();
              }}
            />
          ),
        },
        {
          isEnabled: (registrationFields?.length ?? 0) > 0,
          render: ({ handleStepComplete }) => (
            <RegistrationForm
              registrations={registrations}
              usersToGroups={usersToGroups}
              selectedRegistrationFormKey={selectedRegistrationFormKey}
              multipleRegistrationData={multipleRegistrationData}
              registrationFields={registrationFields}
              user={user}
              event={event}
              onRegistrationFormCreate={onRegistrationFormCreate}
              onSelectedRegistrationFormKeyChange={setSelectedRegistrationFormKey}
              onStepComplete={handleStepComplete}
            />
          ),
        },
      ]}
    />
  );
};

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

function SelectRegistrationDropdown({
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
}) {
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
      return 'Create a new artefact';
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
        <Label>Select Artefact</Label>
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
}

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

function EventGroupsForm({
  groupCategories,
  usersToGroups,
  user,
  onStepComplete,
}: {
  groupCategories: GetGroupCategoriesResponse | null | undefined;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  user: GetUserResponse | null | undefined;
  onStepComplete?: () => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    mode: 'all',
    // user to groups keyed by group category id
    defaultValues: usersToGroups?.reduce(
      (acc, userToGroup) => {
        if (!userToGroup.group.groupCategoryId) {
          return acc;
        }

        if (!acc[userToGroup.groupCategoryId ?? '']) {
          acc[userToGroup.group.groupCategoryId] = [];
        }

        acc[userToGroup.group.groupCategoryId].push(userToGroup.group.id);
        return acc;
      },
      {} as Record<string, string[]>,
    ),
  });

  const watchedForm = useWatch({ control: form.control });

  const { mutateAsync: postUsersToGroupsMutation, isPending: postUsersToGroupsIsPending } =
    useMutation({
      mutationFn: postUsersToGroups,
      onSuccess: (body) => {
        if (!body) {
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
      },
      onError: () => {
        toast.error('Something went wrong.');
      },
    });

  const { mutateAsync: deleteUsersToGroupsMutation, isPending: deleteUsersToGroupsIsPending } =
    useMutation({
      mutationFn: deleteUsersToGroups,
      onSuccess: (body) => {
        if (body) {
          if ('errors' in body) {
            toast.error(body.errors[0]);
            return;
          }

          queryClient.invalidateQueries({ queryKey: ['user', user?.id, 'users-to-groups'] });
        }
      },
    });

  const tensionsGroupCategory = groupCategories?.find(
    (groupCategory) => groupCategory.name === GROUP_CATEGORY_NAME_TENSION,
  );

  const { data: groups } = useQuery({
    queryKey: ['group-category', tensionsGroupCategory?.id, 'groups'],
    queryFn: () => fetchGroups({ groupCategoryId: tensionsGroupCategory?.id ?? '' }),
    enabled: !!tensionsGroupCategory?.id,
  });

  const onSubmit = async (values: Record<string, string[]>) => {
    const formGroupIds = Object.values<string[]>(values).flat();
    const previousGroupIds = usersToGroups?.map((userToGroup) => userToGroup.group.id) || [];

    // add groups that are new
    // delete groups that are no longer selected
    const groupsToAdd = formGroupIds.filter((groupId) => !previousGroupIds.includes(groupId));
    const groupsToDelete = previousGroupIds.filter((groupId) => !formGroupIds.includes(groupId));

    try {
      await Promise.all(
        groupsToAdd.map((groupId) =>
          postUsersToGroupsMutation({
            groupId,
          }),
        ),
      );

      await Promise.all(
        groupsToDelete.map(async (groupId) => {
          const userToGroup = usersToGroups?.find(
            (userToGroup) => userToGroup.group.id === groupId,
          );
          if (userToGroup) {
            await deleteUsersToGroupsMutation({ userToGroupId: userToGroup.id });
          }
        }),
      );

      await onStepComplete?.();
    } catch (e) {
      console.error('Error saving groups:', e);
    }

    for (const groupId of groupsToDelete) {
      const userToGroup = usersToGroups?.find((userToGroup) => userToGroup.group.id === groupId);
      if (userToGroup) {
        await deleteUsersToGroupsMutation({ userToGroupId: userToGroup.id });
      }
    }

    await onStepComplete?.();
  };

  return (
    <FlexColumn>
      {groupCategories
        ?.filter((groupCategory) => groupCategory.required)
        .map((groupCategory) => (
          <SelectEventGroup key={groupCategory.id} groupCategory={groupCategory} form={form} />
        ))}
      {tensionsGroupCategory && (
        <FlexColumn $gap="0">
          <LabelContainer>
            <Label>Select tensions</Label>
          </LabelContainer>
          <MultiSelect
            options={groups?.map((group) => ({ value: group.id, label: group.name })) || []}
            defaultValue={watchedForm[tensionsGroupCategory.id] || []}
            onValueChange={(value) => {
              form.setValue(tensionsGroupCategory?.id || '', value);
            }}
            maxCount={100}
            name={GROUP_CATEGORY_NAME_TENSION}
          />
        </FlexColumn>
      )}
      <Button
        disabled={postUsersToGroupsIsPending || deleteUsersToGroupsIsPending}
        onClick={form.handleSubmit(onSubmit)}
      >
        Save
      </Button>
    </FlexColumn>
  );
}

function SelectEventGroup({
  groupCategory,
  form,
}: {
  groupCategory: GetGroupCategoriesResponse[number] | null | undefined;
  form: UseFormReturn<Record<string, string[]>>;
}) {
  const { data: groups } = useQuery({
    queryKey: ['group-category', groupCategory?.id, 'groups'],
    queryFn: () => fetchGroups({ groupCategoryId: groupCategory?.id ?? '' }),
    enabled: !!groupCategory?.id,
  });

  return (
    <SelectInput
      form={form}
      label={`Which of these best describes you?`}
      options={groups?.map((group) => ({ value: group.id, name: group.name })) || []}
      // group category id is the key for the form
      // and the form supports multiple groups hence the array key
      name={`${groupCategory?.id}.[0]`}
      required
    />
  );
}

function RegistrationForm({
  registrationFields,
  event,
  multipleRegistrationData,
  registrations,
  selectedRegistrationFormKey,
  user,
  usersToGroups,
  onRegistrationFormCreate,
  onSelectedRegistrationFormKeyChange,
  onStepComplete,
}: {
  registrations: GetRegistrationsResponseType | undefined | null;
  usersToGroups: GetUsersToGroupsResponse | undefined | null;
  selectedRegistrationFormKey: string | undefined;
  multipleRegistrationData: Record<
    string,
    {
      data: GetRegistrationDataResponse | null | undefined;
      loading: boolean;
    }
  >;
  registrationFields: GetRegistrationFieldsResponse | null | undefined;
  user: GetUserResponse | null | undefined;
  event: GetEventResponse | null | undefined;
  onRegistrationFormCreate?: (newRegistrationId: string) => void;
  onSelectedRegistrationFormKeyChange: (key: string) => void;
  onStepComplete?: () => void;
}) {
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

  return (
    <>
      <SelectRegistrationDropdown
        onSelectedRegistrationFormKeyChange={onSelectedRegistrationFormKeyChange}
        registrations={registrations}
        usersToGroups={usersToGroups}
        selectedRegistrationFormKey={selectedRegistrationFormKey}
        multipleRegistrationData={multipleRegistrationData}
        registrationFields={registrationFields}
      />
      {createRegistrationForms({ registrations, usersToGroups }).map((form, idx) => {
        return (
          <DynamicRegistrationFieldsForm
            show={showRegistrationForm({
              selectedRegistrationFormKey,
              registrationId: form.registration?.id,
            })}
            usersToGroups={usersToGroups}
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
            onStepComplete={onStepComplete}
          />
        );
      })}
    </>
  );
}

function DynamicRegistrationFieldsForm(props: {
  user: GetUserResponse | null | undefined;
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
  onStepComplete?: () => void;
}) {
  const queryClient = useQueryClient();

  // i want to differentiate between when a group is selected and it is not
  // so i can show the correct registration fields
  // i will use the selectedGroupId to do this
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const prevSelectGroupId = props.groupId ?? 'none';

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

        // invalidate user registrations, this is for the 1 event use case
        // where the authentication is because you are approved to the event
        await queryClient.invalidateQueries({
          queryKey: [props.user?.id, 'registrations'],
        });

        props.onRegistrationFormCreate?.(body.id);

        props.onStepComplete?.();
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

        props.onStepComplete?.();
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
