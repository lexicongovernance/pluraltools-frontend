import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import {
  fetchEvents,
  fetchRegistration,
  fetchRegistrationData,
  fetchRegistrationFields,
} from '../api';
import postRegistrationData from '../api/postRegistrationFields';
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
import { queryClient } from '../main';
import { AuthUser } from '../types/AuthUserType';
import { DBEvent } from '../types/DBEventType';
import { GetRegistrationDataResponse } from '../types/RegistrationDataType';
import { RegistrationFieldOption } from '../types/RegistrationFieldOptionType';
import { GetRegistrationFieldsResponse } from '../types/RegistrationFieldType';
import { GetRegistrationResponseType } from '../types/RegistrationType';

function Register() {
  // TODO: Create useLocalStorage hook
  const [skipOnboarding, setSkipOnboarding] = useState(localStorage.getItem('skip_onboarding'));

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
    setSkipOnboarding('true');
    localStorage.setItem('skip_onboarding', 'true');
  };

  if (isLoading || registrationDataIsLoading) {
    return <h1>Loading...</h1>;
  }

  if (skipOnboarding == 'true') {
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
  const {
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{
    [fieldId: string]: string;
  }>({
    defaultValues: props.registrationData?.reduce(
      (acc, field) => ({
        ...acc,
        [field.registrationFieldId]: field.value,
      }),
      {}
    ),
  });

  const { mutate: mutateRegistrationData } = useMutation({
    mutationFn: postRegistrationData,
    onSuccess: (body) => {
      if (body) {
        // reset errors
        clearErrors();
        queryClient.invalidateQueries({ queryKey: ['registration', 'data'] });
      }
    },
  });

  const isValidated = (): boolean => {
    // check if all required fields are filled
    const requiredFields = props.registrationFields?.filter((field) => field.isRequired);
    const requiredFieldsIds = requiredFields?.map((field) => field.id);
    const requiredFieldsValues = requiredFieldsIds?.map((fieldId) => getValues(fieldId));
    const requiredFieldsFilled = requiredFieldsValues?.every((value) => value);

    if (!requiredFieldsFilled) {
      console.log('not all required fields are filled');
      requiredFields?.forEach((field) => {
        if (!getValues(field.id)) {
          setError(field.id, {
            type: 'required',
            message: `${field.name} is required`,
          });
        }
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (props.events?.[0].id) {
      if (!isValidated()) {
        return;
      }

      mutateRegistrationData({
        eventId: props.events[0].id,
        body: {
          status: 'DRAFT',
          registrationData: Object.entries(getValues()).map(([key, value]) => ({
            registrationFieldId: key,
            value,
          })),
        },
      });
    }
  };

  return (
    <>
      {props.user ? (
        <FlexColumn>
          <h2>REGISTER</h2>
          {props.registration?.status && <Chip>{props.registration.status}</Chip>}
          <form>
            <FlexColumn $gap="0.75rem">
              {props.registrationFields?.map((field, idx) => (
                <FormField
                  field={field}
                  idx={idx}
                  disabled={props.registration?.status === 'PUBLISHED'}
                  errors={errors}
                  onChange={(event) => {
                    setValue(`${field.id}`, event.target.value);
                  }}
                  defaultValue={getValues(`${field.id}`)}
                />
              ))}
            </FlexColumn>
          </form>
          <FlexRow $alignSelf="flex-end">
            <Button onClick={handleSubmit}>Save</Button>
          </FlexRow>
        </FlexColumn>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  );
}

function FormField({
  field,
  idx,
  errors,
  disabled,
  defaultValue,
  onChange,
}: {
  field: GetRegistrationFieldsResponse[0];
  idx: number;
  errors: FieldErrors<{
    [fieldId: string]: string;
  }>;
  disabled: boolean;
  defaultValue?: string;
  onChange: (event: { target: { value: string } }) => void;
}) {
  switch (field.type) {
    case 'TEXT':
      return (
        <TextInput
          key={field.id}
          idx={idx}
          id={field.id}
          name={field.name}
          onChange={onChange}
          defaultValue={defaultValue}
          required={field.isRequired}
          disabled={disabled}
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
          name={field.name}
          onChange={onChange}
          defaultValue={defaultValue}
          options={field.registrationFieldOptions}
          required={field.isRequired}
          disabled={disabled}
          errors={errors}
        />
      );
    default:
      return null;
  }
}

function TextInput(props: {
  idx: number;
  id: string;
  name: string;
  defaultValue?: string;
  required: boolean | null;
  disabled: boolean;
  onChange: (event: { target: { value: string } }) => void;
  errors: FieldErrors<{
    [fieldId: string]: string;
  }>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.name} required={!!props.required}>
        {props.name}
      </Label>
      <Input
        defaultValue={props.defaultValue}
        type="text"
        name={props.name}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      {props.errors?.[props.id] && <ErrorText>{props.errors?.[props.id]?.message}</ErrorText>}
    </FlexColumn>
  );
}

function SelectInput(props: {
  idx: number;
  id: string;
  name: string;
  title: string;
  required: boolean | null;
  disabled: boolean;
  onChange: (event: { target: { value: string } }) => void;
  defaultValue?: string;
  options: RegistrationFieldOption[];
  errors: FieldErrors<{
    [fieldId: string]: string;
  }>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.name} required={!!props.required}>
        {props.title}
      </Label>
      <Select
        id={props.id}
        name={props.name}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        disabled={props.disabled}
      >
        <option value="" selected={props.defaultValue ? false : true} disabled>
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
