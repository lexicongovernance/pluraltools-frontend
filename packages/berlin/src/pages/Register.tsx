// React and third-party libraries
import { Control, Controller, FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import toast from 'react-hot-toast';

// API
import {
  fetchEvent,
  fetchRegistrationData,
  fetchRegistrationFields,
  fetchRegistrations,
  fetchUserGroups,
  GetRegistrationsResponseType,
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
import { SafeArea } from '../layout/Layout.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import Button from '../components/button';
import CharacterCounter from '../components/typography/CharacterCount.styled';
import Input from '../components/input';
import Select from '../components/select';
import Textarea from '../components/textarea';
import Label from '../components/typography/Label';

function Register() {
  const { user, isLoading } = useUser();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const groupCategoryParam = searchParams.get('groupCategory');
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null | undefined>();

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

  // this query runs if there is a groupCategory query param.
  const { data: userGroups } = useQuery({
    queryKey: ['user', 'groups', user?.id],
    queryFn: () => fetchUserGroups(user?.id || ''),
    enabled: !!user?.id && !!groupCategoryParam,
  });

  const groupId = useMemo(() => {
    return userGroups?.find((group) => group.groupCategory?.name === groupCategoryParam)?.id;
  }, [groupCategoryParam, userGroups]);

  const { data: registrationData, isLoading: registrationDataIsLoading } = useQuery({
    queryKey: ['registrations', selectedRegistrationId, 'data'],
    queryFn: () => fetchRegistrationData(selectedRegistrationId || ''),
    enabled: !!selectedRegistrationId,
  });

  useEffect(() => {
    // select the first registration if it exists
    if (registrations) {
      setSelectedRegistrationId(sortRegistrationsByCreationDate(registrations)[0]?.id || '1');
    }
  }, [registrations]);

  const sortRegistrationsByCreationDate = (registrations: GetRegistrationResponseType[]) => {
    return [
      ...registrations.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }),
    ];
  };

  const createRegistrationForms = (
    registrations: GetRegistrationResponseType[] | undefined | null,
  ) => {
    // max 5 registrations
    // when there are no registrations, return an array of 5 empty objects with id 'empty'
    // the name should be the index of the array + 1

    const sortedByCreationDate = sortRegistrationsByCreationDate(registrations || []);

    const newArray = Array.from({ length: 5 }).map((_, idx) => {
      return {
        id: sortedByCreationDate?.[idx]?.id || idx.toString(),
        name: `Proposal ${idx + 1}`,
        mode: sortedByCreationDate?.[idx]?.id ? 'edit' : 'create',
      };
    });

    return newArray;
  };

  const showRegistrationsSelect = (
    registrations: GetRegistrationsResponseType | null | undefined,
    client: 'user' | 'group',
  ): boolean => {
    if (client == 'group') {
      return false;
    }
    // only show select when user has previously registered
    return !!registrations && registrations.length > 0;
  };

  if (isLoading || registrationDataIsLoading) {
    return <h1>Loading...</h1>;
  }

  if (groupCategoryParam && !groupId) {
    return <h1>User is not authorized to register</h1>;
  }

  return (
    <SafeArea>
      <FlexColumn $gap="0.5rem">
        {/* only show select when user has previously registered */}
        {showRegistrationsSelect(registrations, groupId ? 'group' : 'user') && (
          <>
            <Label>Select Proposal</Label>
            <Select
              value={selectedRegistrationId ?? ''}
              options={createRegistrationForms(registrations)}
              placeholder="Select a Proposal"
              onChange={(val) => {
                setSelectedRegistrationId(
                  registrations?.find((registration) => registration.id === val)?.id || val,
                );
              }}
            />
          </>
        )}
      </FlexColumn>
      {createRegistrationForms(registrations).map((form, idx) => {
        return form.mode === 'edit' ? (
          <RegisterForm
            show={selectedRegistrationId === form.id}
            key={idx}
            user={user}
            registrationFields={registrationFields}
            registrationId={selectedRegistrationId}
            mode="edit"
            registrationData={registrationData}
            event={event}
            groupId={groupId}
          />
        ) : (
          <RegisterForm
            show={selectedRegistrationId === idx.toString()}
            key={idx}
            user={user}
            registrationFields={registrationFields}
            registrationId={idx.toString()}
            mode="create"
            registrationData={undefined}
            event={event}
            groupId={groupId}
          />
        );
      })}
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
  registrationFields?: GetRegistrationFieldsResponse | null | undefined;
  registrationId?: string | null | undefined;
  registrationData?: GetRegistrationDataResponse | null | undefined;
  event: DBEvent | null | undefined;
  groupId?: string;
  show: boolean;
  mode: 'edit' | 'create';
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors, isValid },
    control,
    handleSubmit,
    getValues,
    reset,
  } = useForm({
    defaultValues: useMemo(
      () => getDefaultValues(props.registrationData),
      [props.registrationData],
    ),
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(getDefaultValues(props.registrationData));
  }, [props.registrationData, reset]);

  const sortedRegistrationFields = useMemo(() => {
    const sortedFields = filterRegistrationFields(
      props.registrationFields || [],
      props.groupId ? 'group' : 'user',
    );

    // Sort by field_display_rank in ascending order
    sortedFields?.sort((a, b) => (a.fieldDisplayRank || 0) - (b.fieldDisplayRank || 0));

    return sortedFields;
  }, [props.registrationFields, props.groupId]);

  const { mutate: mutateRegistrationData } = useMutation({
    mutationFn: postRegistration,
    onSuccess: async (body) => {
      if (body) {
        toast.success('Registration saved successfully!');
        await queryClient.invalidateQueries({
          queryKey: ['registration'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['registration', 'data'],
        });
        navigate(`/events/${props.event?.id}/holding`);
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
        navigate(`/events/${props.event?.id}/holding`);
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
          groupId: props.groupId || null,
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value: value,
          })),
        },
      });
    } else {
      mutateRegistrationData({
        body: {
          eventId: props.event?.id || '',
          groupId: props.groupId || null,
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value,
          })),
        },
      });
    }
  };

  return props.show ? (
    <FlexColumn>
      <Subtitle>{props.event?.registrationDescription}</Subtitle>
      <form style={{ width: '100%' }}>
        <FlexColumn $gap="0.75rem">
          {sortedRegistrationFields?.map((regField) => (
            <FormField
              key={regField.id}
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
        </FlexColumn>
      </form>
      <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
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
          register={register}
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
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
  control: Control<Record<string, string>>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Controller
        name={props.id}
        control={props.control}
        render={({ field }) => (
          <Select
            label={props.name}
            placeholder="Choose a value"
            required={!!props.required}
            options={props.options.map((option) => ({ id: option.id, name: option.value }))}
            disabled={props.disabled}
            {...field}
          />
        )}
      />
      {props.errors?.[props.id] && <Error>{props.errors?.[props.id]?.message}</Error>}
    </FlexColumn>
  );
}

export default Register;
