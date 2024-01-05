import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import {
  fetchEvents,
  fetchRegistration,
  fetchRegistrationData,
  fetchRegistrationFields,
} from '../api';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/form/Label';
import Onboarding from '../components/onboarding';
import register from '../data/register';
import useUser from '../hooks/useUser';
import { FlexColumn } from '../layout/Layout.styled';
import { GetRegistrationDataResponse } from '../types/RegistrationDataType';
import Select from '../components/form/Select';
import { RegistrationFieldOption } from '../types/RegistrationFieldOptionType';

function Register() {
  // TODO: Create useLocalStorage hook
  const [skipOnboarding, setSkipOnboarding] = useState(localStorage.getItem('skip_onboarding'));
  const handleSkip = () => {
    setSkipOnboarding('true');
    localStorage.setItem('skip_onboarding', 'true');
  };

  if (skipOnboarding == 'true') {
    return <RegisterForm />;
  }

  return <Onboarding data={register.onboarding} handleSkip={handleSkip} />;
}

function RegisterForm() {
  const { user, isLoading } = useUser();

  const { data: events } = useQuery({
    queryKey: ['event'],
    queryFn: () => fetchEvents(),
    staleTime: 10000,
  });

  const { data: registration } = useQuery({
    queryKey: ['registration'],
    queryFn: () => fetchRegistration(user?.id || ''),
    staleTime: 10000,
    enabled: !!user?.id,
  });

  const { data: registrationFields } = useQuery({
    queryKey: ['registration', 'fields'],
    queryFn: () => fetchRegistrationFields(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  const { data: registrationData } = useQuery({
    queryKey: ['registration', 'data'],
    queryFn: () => fetchRegistrationData(events?.[0].id || ''),
    staleTime: 10000,
    enabled: !!events?.[0].id,
  });

  const {
    register,
    formState: { errors },
  } = useForm<{ fields: NonNullable<typeof registrationData> }>();

  // TODO: This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      {user ? (
        <FlexColumn>
          <h2>REGISTER</h2>
          {registration?.status && <Chip>{registration.status}</Chip>}
          <form onSubmit={() => {}}>
            <FlexColumn $gap="0.75rem">
              {registrationFields &&
                registrationFields.map((field, idx) => {
                  switch (field.type) {
                    case 'TEXT':
                      return (
                        <TextInput
                          key={field.id}
                          idx={idx}
                          id={field.id}
                          title={field.name}
                          register={register}
                          required={field.isRequired}
                          disabled={registration?.status === 'PUBLISHED'}
                          errors={errors}
                        />
                      );
                    case 'SELECT':
                      return (
                        <SelectInput
                          key={field.id}
                          idx={idx}
                          id={field.id}
                          title={field.name}
                          options={field.registrationFieldOptions}
                          register={register}
                          required={field.isRequired}
                          disabled={registration?.status === 'PUBLISHED'}
                          errors={errors}
                        />
                      );
                    default:
                      return null;
                  }
                })}
            </FlexColumn>
          </form>
        </FlexColumn>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  );
}

function TextInput(props: {
  idx: number;
  id: string;
  title: string;
  required: boolean | null;
  disabled: boolean;
  register: UseFormRegister<{
    fields: GetRegistrationDataResponse;
  }>;
  errors: FieldErrors<{
    fields: GetRegistrationDataResponse;
  }>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.title} required={!!props.required}>
        {props.title}
      </Label>
      <Input
        type="text"
        disabled={props.disabled}
        {...props.register(`fields.${props.idx}.value` as const)}
      />
      {props.errors.fields?.[props.idx]?.id && (
        <ErrorText>{props.errors.fields?.[props.idx]?.message}</ErrorText>
      )}
    </FlexColumn>
  );
}

function SelectInput(props: {
  idx: number;
  id: string;
  title: string;
  required: boolean | null;
  disabled: boolean;
  options: RegistrationFieldOption[];
  register: UseFormRegister<{
    fields: GetRegistrationDataResponse;
  }>;
  errors: FieldErrors<{
    fields: GetRegistrationDataResponse;
  }>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.title} required={!!props.required}>
        {props.title}
      </Label>
      <Select
        id={props.id}
        disabled={props.disabled}
        {...props.register(`fields.${props.idx}.value` as const)}
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
      {props.errors.fields?.[props.idx]?.id && (
        <ErrorText>{props.errors.fields?.[props.idx]?.message}</ErrorText>
      )}
    </FlexColumn>
  );
}
export default Register;
