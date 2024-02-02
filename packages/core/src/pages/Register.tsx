import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchEvent,
  fetchRegistration,
  fetchRegistrationData,
  fetchRegistrationFields,
  postRegistrationData,
} from '../api';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/typography/Label';
import Select from '../components/form/Select';
import Title from '../components/typography/Title';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { AuthUser } from '../types/AuthUserType';
import { DBEvent } from '../types/DBEventType';
import { GetRegistrationDataResponse } from '../types/RegistrationDataType';
import { RegistrationFieldOption } from '../types/RegistrationFieldOptionType';
import { GetRegistrationFieldsResponse } from '../types/RegistrationFieldType';
import { GetRegistrationResponseType } from '../types/RegistrationType';
import { useForm, FieldErrors, UseFormRegister } from 'react-hook-form';
import { z } from 'zod';
import Subtitle from '../components/typography/Subtitle';
import { useMemo, useState } from 'react';

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
    handleSubmit,
  } = useForm({
    defaultValues: props.registrationData?.reduce(
      (acc, curr) => {
        acc[curr.registrationFieldId] = curr.value;
        return acc;
      },
      {} as Record<string, string>
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
        navigate(`/events/${props.event?.id}`);
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
  };

  return (
    <>
      {props.user ? (
        <FlexColumn>
          <FlexRow $justifyContent="space-between">
            <Title>Register for {props.event?.name}</Title>
            {props.registration?.status && <Chip>{props.registration.status}</Chip>}
          </FlexRow>
          <Subtitle>{props.event?.registrationDescription}</Subtitle>
          <form>
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
                />
              ))}
            </FlexColumn>
          </form>
          <FlexRow $alignSelf="flex-end">
            <Button disabled={!isValid} onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </FlexRow>
        </FlexColumn>
      ) : (
        <h2>Please login</h2>
      )}
    </>
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
}: {
  id: string;
  name: string;
  required: boolean | null;
  type: 'TEXT' | 'SELECT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  options: RegistrationFieldOption[];
  disabled: boolean;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
  characterLimit: number;
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
      <Label htmlFor={props.name} $required={!!props.required}>
        {props.name}
      </Label>
      <Input
        type="text"
        {...props.register(props.id, {
          validate: (value) => {
            // validate character limit (0 character limit is no character limit)
            if (props.characterLimit > 0 && value.length > props.characterLimit) {
              return `Exceeds character limit of ${props.characterLimit}`;
            }
            // validate required
            if (!props.required) {
              return true;
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
      {props.errors?.[props.id] && <ErrorText>{props.errors?.[props.id]?.message}</ErrorText>}
      {props.characterLimit > 0 && (
        <p>
          {charCount}/{props.characterLimit} characters
        </p>
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
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.name} $required={!!props.required}>
        {props.name}
      </Label>
      <Select
        id={props.id}
        {...props.register(props.id, {
          validate: (value) => {
            if (!props.required) {
              return true;
            }

            const v = z.string().safeParse(value);

            if (v.success) {
              return true;
            }

            return v.error.message;
          },
        })}
        defaultValue={''}
        disabled={props.disabled}
      >
        <option value={''} disabled>
          Choose a value
        </option>
        {props.options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
      {props.errors?.[props.id] && <ErrorText>{props.errors?.[props.id]?.message}</ErrorText>}
    </FlexColumn>
  );
}
export default Register;
