// React and third-party libraries
import { Control, Controller, FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import ContentLoader from 'react-content-loader';
import toast from 'react-hot-toast';

// API
import {
  fetchEvent,
  fetchRegistrationData,
  fetchRegistrationFields,
  fetchRegistrations,
  fetchUsersToGroups,
  GetRegistrationsResponseType,
  GetUsersToGroupsResponse,
  postRegistration,
  putRegistration,
  type GetRegistrationDataResponse,
  type GetRegistrationFieldsResponse,
  type GetRegistrationResponseType,
  type GetUserResponse,
  type RegistrationFieldOption,
} from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Types
import { DBEvent } from '../types/DBEventType';

// Components
import { Body } from '../components/typography/Body.styled';
import { Error } from '../components/typography/Error.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Form } from '../components/containers/Form.styled';
import { SafeArea } from '../layout/Layout.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import CharacterCounter from '../components/typography/CharacterCount.styled';
import Input from '../components/input';
import Label from '../components/typography/Label';
import Select from '../components/select';
import Textarea from '../components/textarea';

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
    queryKey: ['user', 'groups', user?.id],
    queryFn: () => fetchUsersToGroups(user?.id || ''),
    enabled: !!user?.id,
  });

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
        setSelectedRegistrationFormKey(firstRegistrationId);
      }
    }
  }, [registrations, selectedRegistrationFormKey]);

  const sortRegistrationsByCreationDate = (registrations: GetRegistrationResponseType[]) => {
    return [
      ...registrations.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    ];
  };

  const createRegistrationForms = (
    registrations: GetRegistrationsResponseType | undefined | null,
  ) => {
    const sortedRegistrationsByCreationDate = sortRegistrationsByCreationDate(registrations || []);

    const registrationForms: {
      key: string | 'create';
      registrationId?: string;
      groupId?: string;
      name: string;
      mode: 'edit' | 'create';
    }[] = sortedRegistrationsByCreationDate.map((reg, idx) => {
      return {
        key: reg.id || '',
        registrationId: reg.id,
        groupId: reg.groupId ?? undefined,
        name: `Proposal ${idx + 1}`,
        mode: 'edit',
      };
    });

    registrationForms.push({
      key: 'create',
      name: 'Create a new proposal',
      mode: 'create',
    });

    return registrationForms;
  };

  const showRegistrationsSelect = (
    registrations: GetRegistrationsResponseType | null | undefined,
  ): boolean => {
    // only show select when user has previously registered
    return !!registrations && registrations.length > 0;
  };

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
        {/* only show select when user has previously registered */}
        {showRegistrationsSelect(registrations) && (
          <FlexColumn $gap="0.5rem">
            <Label>Select Proposal</Label>
            <Select
              value={selectedRegistrationFormKey ?? ''}
              options={createRegistrationForms(registrations).map((form) => ({
                id: form.key,
                name: form.name,
              }))}
              placeholder="Select a Proposal"
              onChange={setSelectedRegistrationFormKey}
            />
          </FlexColumn>
        )}
        {createRegistrationForms(registrations).map((form, idx) => {
          return (
            <RegisterForm
              show={showRegistrationForm({
                selectedRegistrationFormKey,
                registrationId: form.registrationId,
              })}
              usersToGroups={usersToGroups}
              userIsApproved={
                registrations?.some((registration) => registration.status === 'APPROVED')
                  ? true
                  : false
              }
              key={idx}
              user={user}
              groupId={form.groupId}
              registrationFields={registrationFields}
              registrationId={form.registrationId}
              mode={form.mode}
              event={event}
              onRegistrationFormCreate={onRegistrationFormCreate}
            />
          );
        })}
      </FlexColumn>
    </SafeArea>
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

function RegisterForm(props: {
  user: GetUserResponse | null | undefined;
  userIsApproved: boolean;
  usersToGroups: GetUsersToGroupsResponse | null | undefined;
  registrationFields: GetRegistrationFieldsResponse | null | undefined;
  registrationId: string | null | undefined;
  groupId: string | null | undefined;
  event: DBEvent | null | undefined;
  show: boolean;
  mode: 'edit' | 'create';
  onRegistrationFormCreate?: (newRegistrationId: string) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(props.groupId ?? 'none');

  const { data: registrationData, isLoading } = useQuery({
    queryKey: ['registrations', props.registrationId, 'registration-data'],
    queryFn: () => fetchRegistrationData(props.registrationId || ''),
    enabled: !!props.registrationId,
  });

  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: useMemo(() => getDefaultValues(registrationData), [registrationData]),
    mode: 'all',
  });

  useEffect(() => {
    reset(getDefaultValues(registrationData));
  }, [registrationData, reset]);

  const sortedRegistrationFields = useMemo(() => {
    const sortedFields = filterRegistrationFields(
      props.registrationFields || [],
      selectedGroupId === 'none' ? 'user' : 'group',
    );

    // Sort by field_display_rank in ascending order
    sortedFields?.sort((a, b) => (a.fieldDisplayRank || 0) - (b.fieldDisplayRank || 0));

    return sortedFields;
  }, [props.registrationFields, selectedGroupId]);

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
          queryKey: [props.registrationId, 'registration'],
        });
        await queryClient.invalidateQueries({
          queryKey: [props.registrationId, 'registration', 'data'],
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
    if (props.mode === 'edit') {
      updateRegistrationData({
        registrationId: props.registrationId || '',
        body: {
          eventId: props.event?.id || '',
          groupId: selectedGroupId === 'none' ? null : selectedGroupId,
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value: value || '',
          })),
        },
      });
    } else {
      mutateRegistrationData({
        body: {
          eventId: props.event?.id || '',
          groupId: selectedGroupId === 'none' ? null : selectedGroupId,
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value: value || '',
          })),
        },
      });
    }
  };

  if (isLoading) {
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
        selectedGroupId={selectedGroupId}
        onChange={setSelectedGroupId}
      />
      <Subtitle>{props.event?.registrationDescription}</Subtitle>
      <Form>
        {sortedRegistrationFields?.map((regField) => (
          <FormField
            key={`${props.registrationId}-${regField.id}`}
            disabled={false}
            errors={errors}
            required={regField.required}
            id={regField.id}
            name={regField.name}
            characterLimit={regField.characterLimit}
            options={regField.registrationFieldOptions}
            type={regField.type}
            register={register}
            control={control}
            value={getValues()[regField.id] ?? ''} // Current input value
          />
        ))}
      </Form>
      <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isPending}>
        Save
      </Button>
      <Body>
        Need more time? Feel free to come back to these questions later. The deadline is May 15th.
      </Body>
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

function FormField({
  id,
  name,
  required,
  type,
  errors,
  options,
  disabled,
  register,
  characterLimit,
  control,
  value,
}: {
  id: string;
  name: string;
  required: boolean | null;
  type: 'TEXT' | 'SELECT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'TEXTAREA';
  options: RegistrationFieldOption[];
  disabled: boolean;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
  characterLimit: number;
  control: Control<Record<string, string>>;
  value: string;
}) {
  switch (type) {
    case 'TEXT':
      return (
        <TextInput
          id={id}
          name={name}
          register={register}
          required={required}
          disabled={disabled}
          errors={errors}
          characterLimit={characterLimit}
          value={value}
        />
      );
    case 'SELECT':
      return (
        <SelectInput
          id={id}
          name={name}
          options={options}
          required={required}
          disabled={disabled}
          errors={errors}
          control={control}
        />
      );
    case 'TEXTAREA':
      return (
        <TextAreaInput
          id={id}
          name={name}
          register={register}
          required={required}
          disabled={disabled}
          errors={errors}
          characterLimit={characterLimit}
          value={value}
        />
      );
    default:
      return null;
  }
}

function TextInput(props: {
  id: string;
  name: string;
  required: boolean | null;
  characterLimit: number;
  disabled: boolean;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
  value: string;
}) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(props.value.length);
  }, [props.value.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setCharCount(inputValue.length);
    props.register(props.id, {
      value: inputValue,
    });
  };

  return (
    <FlexColumn $gap="0.5rem">
      <Input
        type="text"
        label={props.name}
        required={!!props.required}
        placeholder="Enter a value"
        {...props.register(props.id, {
          validate: (value) => {
            if (!props.required) {
              return true;
            }

            // validate character limit (0 character limit is no character limit)
            if (props.characterLimit > 0 && value.length > props.characterLimit) {
              return `Character count of ${charCount} exceeds character limit of ${props.characterLimit}`;
            }

            const v = z.string().min(1, 'Value is required').safeParse(value);

            if (v.success) {
              return true;
            }

            return v.error.errors[0].message;
          },
        })}
        disabled={props.disabled}
        onChange={handleInputChange}
      />
      {props.errors?.[props.id] ? (
        <Error>{props.errors?.[props.id]?.message}</Error>
      ) : (
        props.characterLimit > 0 && (
          <CharacterCounter count={charCount} limit={props.characterLimit} />
        )
      )}
    </FlexColumn>
  );
}

function TextAreaInput(props: {
  id: string;
  name: string;
  required: boolean | null;
  characterLimit: number;
  disabled: boolean;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
  value: string;
}) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(props.value.length);
  }, [props.value.length]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    setCharCount(inputValue.length);
    props.register(props.id, {
      value: inputValue,
    });
  };

  return (
    <FlexColumn $gap="0.5rem">
      <Textarea
        label={props.name}
        $required={!!props.required}
        placeholder="Enter a value"
        {...props.register(props.id, {
          validate: (value) => {
            if (!props.required) {
              return true;
            }

            // validate character limit (0 character limit is no character limit)
            if (props.characterLimit > 0 && value.length > props.characterLimit) {
              return `Character count of ${charCount} exceeds character limit of ${props.characterLimit}`;
            }

            const v = z.string().min(1, 'Value is required').safeParse(value);

            if (v.success) {
              return true;
            }

            return v.error.errors[0].message;
          },
        })}
        onChange={handleInputChange}
      />
      {props.errors?.[props.id] ? (
        <Error>{props.errors?.[props.id]?.message}</Error>
      ) : (
        props.characterLimit > 0 && (
          <CharacterCounter count={charCount} limit={props.characterLimit} />
        )
      )}
    </FlexColumn>
  );
}

function SelectInput(props: {
  id: string;
  name: string;
  required: boolean | null;
  disabled: boolean;
  options: RegistrationFieldOption[];
  errors: FieldErrors<Record<string, string>>;
  control: Control<Record<string, string>>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Controller
        name={props.id}
        control={props.control}
        rules={{ required: props.required ? 'Value is required' : false }}
        render={({ field }) => (
          <Select
            label={props.name}
            placeholder="Choose a value"
            required={!!props.required}
            options={props.options.map((option) => ({ id: option.value, name: option.value }))}
            errors={props.errors[props.id] ? [props.errors[props.id]?.message ?? ''] : []}
            onBlur={field.onBlur}
            onChange={(val) => field.onChange(val)}
            value={field.value}
          />
        )}
      />
    </FlexColumn>
  );
}

export default Register;
