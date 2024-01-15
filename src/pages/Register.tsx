import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchEvents,
  fetchRegistration,
  fetchRegistrationData,
  fetchRegistrationFields,
  postRegistrationData,
} from '../api';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/form/Label';
import Select from '../components/form/Select';
import Onboarding from '../components/onboarding';
import register from '../data/register';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { AuthUser } from '../types/AuthUserType';
import { DBEvent } from '../types/DBEventType';
import { GetRegistrationDataResponse } from '../types/RegistrationDataType';
import { RegistrationFieldOption } from '../types/RegistrationFieldOptionType';
import { GetRegistrationFieldsResponse } from '../types/RegistrationFieldType';
import { GetRegistrationResponseType } from '../types/RegistrationType';
import { useForm, ValidationError } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';

function Register() {
  const onboardingStatus = useAppStore((state) => state.onboardingStatus);
  const setOnboardingStatus = useAppStore((state) => state.setOnboardingStatus);

  const { user, isLoading } = useUser();

  const { data: events } = useQuery({
    queryKey: ['event'],
    queryFn: () => fetchEvents(),
    staleTime: 10000,
  });

  const { data: registration } = useQuery({
    queryKey: ['registration'],
    queryFn: () => fetchRegistration(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['registration', 'fields'],
    queryFn: () => fetchRegistrationFields(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  const { data: registrationData, isLoading: registrationDataIsLoading } = useQuery({
    queryKey: ['registration', 'data'],
    queryFn: () => fetchRegistrationData(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  const handleSkip = () => {
    setOnboardingStatus('COMPLETE');
  };

  if (isLoading || registrationDataIsLoading) {
    return <h1>Loading...</h1>;
  }

  if (onboardingStatus === 'COMPLETE') {
    return (
      <RegisterForm
        user={user}
        events={events}
        registration={registration}
        registrationFields={registrationFields}
        registrationData={registrationData}
      />
    );
  }

  return <Onboarding data={register.onboarding} handleSkip={handleSkip} />;
}

function RegisterForm(props: {
  user: AuthUser | null | undefined;
  registrationFields?: GetRegistrationFieldsResponse | null | undefined;
  registration?: GetRegistrationResponseType | null | undefined;
  registrationData?: GetRegistrationDataResponse | null | undefined;
  events: DBEvent[] | null | undefined;
}) {
  const navigate = useNavigate();
  const setRegistrationStatus = useAppStore((state) => state.setRegistrationStatus);

  const queryClient = useQueryClient();
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: props.registrationData?.reduce(
      (acc, curr) => {
        acc[curr.registrationFieldId] = curr.value;
        return acc;
      },
      {} as Record<string, string>
    ),
    onSubmit: (form) => {
      mutateRegistrationData({
        eventId: props.events![0].id,
        body: {
          status: 'DRAFT',
          registrationData: Object.entries(form.value).map(([key, value]) => ({
            registrationFieldId: key,
            value,
          })),
        },
      });
      setRegistrationStatus('COMPLETE');
      navigate('/events');
    },
  });

  const { mutate: mutateRegistrationData } = useMutation({
    mutationFn: postRegistrationData,
    onSuccess: (body) => {
      if (body) {
        toast.success('Registration saved successfully!');
        queryClient.invalidateQueries({ queryKey: ['registration', 'data'] });
      }
    },
    onError: (error) => {
      console.error('Error saving registration:', error);
      toast.error('Failed to save registration, please try again');
    },
  });

  const handleValidation = (
    type: 'TEXT' | 'SELECT' | 'NUMBER' | 'DATE' | 'BOOLEAN',
    required: boolean | null
  ) => {
    if (!required) {
      return;
    }

    if (type === 'TEXT') {
      return z.string().min(1, { message: 'Please enter a value' });
    }

    if (type === 'SELECT') {
      return z.string().min(1, { message: 'Please select a value' });
    }
  };

  return (
    <>
      {props.user ? (
        <FlexColumn>
          <FlexRow $justifyContent="space-between">
            <h2>Register: {props.events?.[0].name}</h2>
            {props.registration?.status && <Chip>{props.registration.status}</Chip>}
          </FlexRow>
          <form.Provider>
            <form>
              <FlexColumn $gap="0.75rem">
                {props.registrationFields?.map((regField) => (
                  <form.Field
                    name={regField.id}
                    key={regField.id}
                    validators={{
                      onBlur: handleValidation(regField.type, regField.required),
                      onChange: handleValidation(regField.type, regField.required),
                    }}
                    children={(field) => (
                      <FormField
                        disabled={props.registration?.status === 'PUBLISHED'}
                        errors={field.state.meta.errors}
                        required={regField.required}
                        id={regField.id}
                        name={regField.name}
                        options={regField.registrationFieldOptions}
                        type={regField.type}
                        onChange={(event) => field.handleChange(event.target.value)}
                        onBlur={field.handleBlur}
                        value={field.state.value}
                      />
                    )}
                  />
                ))}
              </FlexColumn>
            </form>
          </form.Provider>
          <FlexRow $alignSelf="flex-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button disabled={!canSubmit} onClick={form.handleSubmit}>
                  Save
                </Button>
              )}
            />
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
  value,
  onChange,
  onBlur,
}: {
  id: string;
  name: string;
  required: boolean | null;
  type: 'TEXT' | 'SELECT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  options: RegistrationFieldOption[];
  errors: ValidationError[];
  disabled: boolean;
  value: string;
  onChange: (event: { target: { value: string } }) => void;
  onBlur: (event: { target: { value: string } }) => void;
}) {
  switch (type) {
    case 'TEXT':
      return (
        <TextInput
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          required={required}
          disabled={disabled}
          errors={errors}
        />
      );
    case 'SELECT':
      return (
        <SelectInput
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
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
  value?: string;
  required: boolean | null;
  disabled: boolean;
  onChange: (event: { target: { value: string } }) => void;
  onBlur: (event: { target: { value: string } }) => void;
  errors: ValidationError[];
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.name} required={!!props.required}>
        {props.name}
      </Label>
      <Input
        value={props.value}
        type="text"
        name={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      {props.errors?.[0] && <ErrorText>{props.errors?.[0]}</ErrorText>}
    </FlexColumn>
  );
}

function SelectInput(props: {
  id: string;
  name: string;
  required: boolean | null;
  disabled: boolean;
  onChange: (event: { target: { value: string } }) => void;
  onBlur: (event: { target: { value: string } }) => void;
  value?: string;
  options: RegistrationFieldOption[];
  errors: ValidationError[];
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.name} required={!!props.required}>
        {props.name}
      </Label>
      <Select
        id={props.id}
        name={props.name}
        value={props.value}
        defaultValue={''}
        onBlur={props.onBlur}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        <option value="" disabled>
          Choose a value
        </option>
        {props.options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
      {props.errors?.[0] && <ErrorText>{props.errors?.[0]}</ErrorText>}
    </FlexColumn>
  );
}
export default Register;
