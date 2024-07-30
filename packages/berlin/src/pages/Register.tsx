// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
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
  fetchRegistrations,
  fetchUsersToGroups,
  postRegistration,
  postUsersToGroups,
  putRegistration,
  type GetUserResponse,
} from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import { dataSchema, fieldsSchema } from '@/utils/form-validation';
import { z } from 'zod';
import Button from '../components/button';
import { Carousel } from '../components/carousel';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { Form } from '../components/containers/Form.styled';
import { FormInput, FormSelectInput } from '../components/form-input';
import Select from '../components/select';
import Label from '../components/typography/Label';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { SafeArea } from '../layout/Layout.styled';

function Register() {
  const { user, isLoading } = useUser();
  const { eventId } = useParams();

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () =>
      fetchEvent({ eventId: eventId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!eventId,
  });

  const { data: registrations } = useQuery({
    queryKey: ['event', eventId, 'registrations'],
    queryFn: () =>
      fetchRegistrations({ eventId: eventId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!eventId,
  });

  const { data: usersToGroups } = useQuery({
    queryKey: ['user', user?.id, 'users-to-groups'],
    queryFn: () =>
      fetchUsersToGroups({ userId: user?.id || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!user?.id,
  });

  const { data: groupCategories } = useQuery({
    queryKey: ['event', eventId, 'group-categories'],
    queryFn: () =>
      fetchEventGroupCategories({
        eventId: eventId || '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
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
        event={event}
      />
    </SafeArea>
  );
}

const CarouselWrapper = ({
  groupCategories,
  usersToGroups,
  user,
  registrations,
  event,
  defaultStep,
}: {
  defaultStep: number;
  groupCategories: GetGroupCategoriesResponse | null | undefined;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  user: GetUserResponse | null | undefined;
  registrations: GetRegistrationsResponseType | undefined | null;
  event: GetEventResponse | null | undefined;
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
        if (!body) {
          toast.error('Failed to save registration, please try again');
          return;
        }

        if ('errors' in body) {
          toast.error(body.errors[0]);
          return;
        }

        toast.success('Registration saved successfully!');
        await queryClient.invalidateQueries({
          queryKey: ['event', body.eventId, 'registrations'],
        });

        // invalidate user registrations, this is for the 1 event use case
        // where the authentication is because you are approved to the event
        await queryClient.invalidateQueries({
          queryKey: [user?.id, 'registrations'],
        });
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
          data: {},
        },
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
    } else {
      await postRegistrationMutation({
        body: {
          eventId: event?.id || '',
          groupId: null,
          status: 'DRAFT',
          data: {},
        },
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
    }
  };

  return (
    <Carousel
      initialStep={defaultStep}
      onComplete={async () => {
        // query registration to check if it is approved
        const registrations = await queryClient.fetchQuery({
          queryKey: ['event', event?.id, 'registrations'],
          queryFn: () =>
            fetchRegistrations({
              eventId: event?.id || '',
              serverUrl: import.meta.env.VITE_SERVER_URL,
            }),
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
          isEnabled:
            (fieldsSchema.safeParse(event?.fields).success
              ? Object.values(fieldsSchema.parse(event?.fields)).length
              : 0) > 0,
          render: ({ handleStepComplete }) => (
            <RegistrationForm
              registrations={registrations}
              usersToGroups={usersToGroups}
              user={user}
              event={event}
              onStepComplete={handleStepComplete}
            />
          ),
        },
      ]}
    />
  );
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

  const { mutateAsync: postUsersToGroupsMutation, isPending: postUsersToGroupsIsLoading } =
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

  const { mutateAsync: deleteUsersToGroupsMutation, isPending: deleteUsersToGroupsIsLoading } =
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
            serverUrl: import.meta.env.VITE_SERVER_URL,
          }),
        ),
      );

      await Promise.all(
        groupsToDelete.map(async (groupId) => {
          const userToGroup = usersToGroups?.find(
            (userToGroup) => userToGroup.group.id === groupId,
          );
          if (userToGroup) {
            await deleteUsersToGroupsMutation({
              userToGroupId: userToGroup.id,
              serverUrl: import.meta.env.VITE_SERVER_URL,
            });
          }
        }),
      );

      await onStepComplete?.();
    } catch (e) {
      console.error('Error saving groups:', e);
    }
  };

  return (
    <FlexColumn>
      {groupCategories
        ?.filter((groupCategory) => groupCategory.required)
        .map((groupCategory) => (
          <SelectEventGroup key={groupCategory.id} groupCategory={groupCategory} form={form} />
        ))}
      <Button
        disabled={
          form.formState.isSubmitting || postUsersToGroupsIsLoading || deleteUsersToGroupsIsLoading
        }
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
    queryFn: () =>
      fetchGroups({
        groupCategoryId: groupCategory?.id ?? '',
        serverUrl: import.meta.env.VITE_SERVER_URL,
      }),
    enabled: !!groupCategory?.id,
  });

  return (
    <FormSelectInput
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
  event,
  registrations,
  user,
  usersToGroups,
  onStepComplete,
}: {
  registrations: GetRegistrationsResponseType | undefined | null;
  usersToGroups: GetUsersToGroupsResponse | undefined | null;
  user: GetUserResponse | null | undefined;
  event: GetEventResponse | null | undefined;
  onStepComplete?: () => void;
}) {
  const firstRegistration = registrations?.at(0);

  return (
    <>
      <DynamicRegistrationFieldsForm
        usersToGroups={usersToGroups}
        user={user}
        groupId={firstRegistration?.groupId}
        registrationId={firstRegistration?.id}
        mode={firstRegistration ? 'edit' : 'create'}
        data={firstRegistration?.data}
        event={event}
        onStepComplete={onStepComplete}
      />
    </>
  );
}

function DynamicRegistrationFieldsForm(props: {
  user: GetUserResponse | null | undefined;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  registrationId: string | null | undefined;
  groupId: string | null | undefined;
  event: GetEventResponse | null | undefined;
  data: GetRegistrationsResponseType[number]['data'] | null | undefined;
  mode: 'edit' | 'create';
  onStepComplete?: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const prevSelectGroupId = props.groupId ?? 'none';
  const registrationData = dataSchema.safeParse(props.data);
  const eventFields = fieldsSchema.safeParse(props.event?.fields);
  const dataIsClean = registrationData.success && eventFields.success;

  const form = useForm({
    defaultValues: dataIsClean
      ? Object.entries(eventFields.data).reduce(
          (acc, [key]) => {
            acc[key] = registrationData.data[key].value?.toString() ?? '';
            return acc;
          },
          {} as Record<string, string>,
        )
      : {},
    mode: 'all',
  });

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const sortedRegistrationFields = useMemo(() => {
    if (!eventFields.success) {
      return [];
    }

    return Object.values(eventFields.data)?.sort((a, b) => (a.position || 0) - (b.position || 0));
  }, [eventFields]);

  const { mutate: mutateRegistration, isPending } = useMutation({
    mutationFn: postRegistration,
    onSuccess: async (body) => {
      if (!body) {
        toast.error('Failed to save registration, please try again');
        return;
      }

      if ('errors' in body) {
        toast.error(body.errors[0]);
        return;
      }

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

      props.onStepComplete?.();
    },
    onError: (error) => {
      console.error('Error saving registration:', error);
      toast.error('Failed to save registration, please try again');
    },
  });

  const { mutate: updateRegistration } = useMutation({
    mutationFn: putRegistration,
    onSuccess: async (body) => {
      if (!body) {
        toast.error('Failed to update registration, please try again');
        return;
      }

      if ('errors' in body) {
        toast.error(body.errors[0]);
        return;
      }

      toast.success('Registration updated successfully!');

      await queryClient.invalidateQueries({
        queryKey: ['event', props.event?.id, 'registrations'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['registrations', props.registrationId, 'registration-data'],
      });

      props.onStepComplete?.();
    },
    onError: (error) => {
      console.error('Error updating registration:', error);
      toast.error('Failed to update registration, please try again');
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    if (!dataIsClean) {
      return;
    }

    const regGroupId = selectedGroupId || prevSelectGroupId;
    const client = regGroupId === 'none' ? 'user' : 'group';

    // Filter out empty values
    const filteredValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (value !== '') {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const formattedData = Object.entries(filteredValues).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          value,
          type: eventFields.data[key].type,
          fieldId: eventFields.data[key].id,
        };
        return acc;
      },
      {} as z.infer<typeof dataSchema>,
    );

    if (props.mode === 'edit') {
      updateRegistration({
        registrationId: props.registrationId || '',
        body: {
          eventId: props.event?.id || '',
          groupId: client === 'user' ? null : regGroupId,
          status: 'DRAFT',
          data: formattedData,
        },
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
    } else {
      mutateRegistration({
        body: {
          eventId: props.event?.id || '',
          groupId: client === 'user' ? null : regGroupId,
          status: 'DRAFT',
          data: formattedData,
        },
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
    }
  };

  if (!eventFields.success) {
    return <Subtitle>Failed to load registration fields</Subtitle>;
  }

  return (
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
            required={regField.validation.required}
            type={regField.type.toLocaleUpperCase()}
            options={regField.options?.map((value) => ({
              name: value,
              value: value,
            }))}
          />
        ))}
      </Form>
      <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isPending}>
        Save
      </Button>
    </FlexColumn>
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
