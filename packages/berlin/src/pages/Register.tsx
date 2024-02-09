// Components
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/button';

// Styled components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';

import useUser from '../hooks/useUser';
import {
  fetchEvent,
  fetchRegistration,
  fetchRegistrationData,
  fetchRegistrationFields,
  postRegistrationData,
} from 'api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthUser } from '../types/AuthUserType';
import { GetRegistrationFieldsResponse } from '../types/RegistrationFieldType';
import { GetRegistrationResponseType } from '../types/RegistrationType';
import { GetRegistrationDataResponse } from '../types/RegistrationDataType';
import { DBEvent } from '../types/DBEventType';
import { Control, Controller, FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { RegistrationFieldOption } from '../types/RegistrationFieldOptionType';
import Input from '../components/input';
import Select from '../components/select';
import { Error } from '../components/typography/Error.styled';
import CharacterCounter from '../components/typography/CharacterCount.styled';
import { z } from 'zod';
import Textarea from '../components/textarea';

function Register() {
  const { user, isLoading } = useUser();
  const { eventId } = useParams();

  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registration } = useQuery({
    queryKey: ['event', eventId, 'registration'],
    queryFn: () => fetchRegistration(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['event', eventId, 'registration', 'fields'],
    queryFn: () => fetchRegistrationFields(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registrationData, isLoading: registrationDataIsLoading } = useQuery({
    queryKey: ['event', eventId, 'registration', 'data'],
    queryFn: () => fetchRegistrationData(eventId || ''),
    enabled: !!eventId,
  });

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
    />
  );
}

function RegisterForm(props: {
  user: AuthUser | null | undefined;
  registrationFields?: GetRegistrationFieldsResponse | null | undefined;
  registration?: GetRegistrationResponseType | null | undefined;
  registrationData?: GetRegistrationDataResponse | null | undefined;
  event: DBEvent | null | undefined;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors, isValid },
    control,
    handleSubmit,
  } = useForm({
    defaultValues: props.registrationData?.reduce(
      (acc, curr) => {
        acc[curr.registrationFieldId] = curr.value;
        return acc;
      },
      {} as Record<string, string>,
    ),
    mode: 'onBlur',
  });

  const sortedRegistrationFields = useMemo(() => {
    const sortedFields = [...(props.registrationFields || [])];

    // Sort by field_display_rank in ascending order
    sortedFields.sort((a, b) => (a.fieldDisplayRank || 0) - (b.fieldDisplayRank || 0));

    return sortedFields;
  }, [props.registrationFields]);

  const { mutate: mutateRegistrationData } = useMutation({
    mutationFn: postRegistrationData,
    onSuccess: async (body) => {
      if (body) {
        toast.success('Registration saved successfully!');
        await queryClient.invalidateQueries({
          queryKey: ['event', props.event?.id, 'registration'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['event', props.event?.id, 'registration', 'data'],
        });
      }
    },
    onError: (error) => {
      console.error('Error saving registration:', error);
      toast.error('Failed to save registration, please try again');
    },
  });

  const onSubmit = (values: Record<string, string>) => {
    mutateRegistrationData({
      eventId: props.event?.id || '',
      body: {
        status: 'DRAFT',
        registrationData: Object.entries(values).map(([key, value]) => ({
          registrationFieldId: key,
          value,
        })),
      },
    });
    navigate(`/events/${props.event?.id}/holding`);
  };

  return (
    <FlexColumn>
      <Title>{props.event?.registrationDescription}</Title>
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
            />
          ))}
        </FlexColumn>
      </form>
      <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
        Save
      </Button>
    </FlexColumn>
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
}) {
  const [charCount, setCharCount] = useState(0);

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
}) {
  const [charCount, setCharCount] = useState(0);

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
