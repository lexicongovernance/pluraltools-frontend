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
  postRegistration,
  putRegistration,
  type GetGroupsResponse,
  type GetRegistrationDataResponse,
  type GetRegistrationFieldsResponse,
  type GetRegistrationsResponseType,
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

function Register() {
  const { user, isLoading } = useUser();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const groupCategory = searchParams.get('groupCategory');

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

  const { data: usersGroups } = useQuery({
    queryKey: ['user', 'groups', user?.id],
    queryFn: () => fetchUserGroups(user?.id || ''),
    enabled: !!user?.id && !!groupCategory,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registrations', 'fields'],
    queryFn: () => fetchRegistrationFields(eventId || ''),
    enabled: !!eventId,
  });

  const registration = registrations;

  const { data: registrationData, isLoading: registrationDataIsLoading } = useQuery({
    queryKey: ['registrations', registration?.id, 'data'],
    queryFn: () => fetchRegistrationData(registration?.id || ''),
    enabled: !!registration?.id,
  });

  console.log('usersGroups:', usersGroups);
  console.log('groupCategory:', groupCategory);
  // console.log('registration:', registration);

  const foundGroup = usersGroups?.find((group) => group?.groupCategory?.name === groupCategory);
  console.log('foundGroup:', foundGroup);

  if (isLoading || registrationDataIsLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <RegisterForm
      event={event}
      user={user}
      registration={registration}
      registrationFields={registrationFields}
      registrationData={registrationData}
      foundGroup={foundGroup}
    />
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

function RegisterForm(props: {
  user: GetUserResponse | null | undefined;
  registrationFields?: GetRegistrationFieldsResponse | null | undefined;
  registration?: GetRegistrationsResponseType | null | undefined;
  registrationData?: GetRegistrationDataResponse | null | undefined;
  event: DBEvent | null | undefined;
  foundGroup: GetGroupsResponse | undefined;
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

  const values = getValues();

  const sortedRegistrationFields = useMemo(() => {
    const sortedFields = [...(props.registrationFields || [])];

    // Sort by field_display_rank in ascending order
    sortedFields.sort((a, b) => (a.fieldDisplayRank || 0) - (b.fieldDisplayRank || 0));

    return sortedFields;
  }, [props.registrationFields]);

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
          queryKey: [props.registration?.id, 'registration'],
        });
        await queryClient.invalidateQueries({
          queryKey: [props.registration?.id, 'registration', 'data'],
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
    if (props.registration) {
      updateRegistrationData({
        registrationId: props.registration?.id || '',
        body: {
          eventId: props.event?.id || '',
          groupId: props.foundGroup?.id || '',
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value,
          })),
        },
      });
    } else {
      mutateRegistrationData({
        body: {
          eventId: props.event?.id || '',
          groupId: props.foundGroup?.id || '',
          status: 'DRAFT',
          registrationData: Object.entries(values).map(([key, value]) => ({
            registrationFieldId: key,
            value,
          })),
        },
      });
    }
  };

  return (
    <SafeArea>
      <FlexColumn>
        <Subtitle>{props.event?.registrationDescription}</Subtitle>
        <form style={{ width: '100%' }}>
          <FlexColumn $gap="0.75rem">
            {sortedRegistrationFields.map((regField) => (
              <FormField
                key={regField.id}
                disabled={props.registration?.status === 'PUBLISHED'}
                errors={errors}
                required={regField.required}
                id={regField.id}
                name={regField.name}
                characterLimit={regField.characterLimit}
                options={regField.registrationFieldOptions}
                type={regField.type}
                register={register}
                control={control}
                value={values[regField.id] ?? ''} // Current input value
              />
            ))}
          </FlexColumn>
        </form>
        <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
        <Body>
          Need more time? Feel free to come back to these questions later. The deadline is April
          15th.
        </Body>
      </FlexColumn>
    </SafeArea>
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
  control: Control<Record<string, string>, any>;
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
  control: Control<Record<string, string>, any>;
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
