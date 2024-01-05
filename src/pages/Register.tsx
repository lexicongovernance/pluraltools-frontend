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
                          disabled={registration?.status === 'PUBLISHED'}
                          errors={errors}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              {/* <FlexColumn $gap="0.5rem">
                <Label htmlFor="username" required>
                  Username:
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  disabled={registration?.status === 'PUBLISHED'}
                />
                {formik.touched.username && formik.errors.username && (
                  <ErrorText>{formik.errors.username}</ErrorText>
                )}
              </FlexColumn>
              <FlexColumn $gap="0.5rem">
                <Label htmlFor="groupId" required>
                  Select Group:
                </Label>
                <Select
                  id="groupId"
                  name="groupId"
                  placeholder="Choose a group"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.groupId}
                  disabled={registration?.status === 'PUBLISHED'}
                >
                  <option value="" disabled>
                    Choose a group
                  </option>
                  {groups &&
                    groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                </Select>
                {formik.touched.groupId && formik.errors.groupId && (
                  <ErrorText>{formik.errors.groupId}</ErrorText>
                )}
              </FlexColumn>
              <FlexColumn $gap="0.5rem">
                <Label htmlFor="proposalTitle" required>
                  Proposal Title:
                </Label>
                <Input
                  type="text"
                  id="proposalTitle"
                  name="proposalTitle"
                  placeholder="Enter your proposal title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.proposalTitle}
                  disabled={registration?.status === 'PUBLISHED'}
                />
                {formik.touched.proposalTitle && formik.errors.proposalTitle && (
                  <ErrorText>{formik.errors.proposalTitle}</ErrorText>
                )}
              </FlexColumn>
              <FlexColumn $gap="0.5rem">
                <Label htmlFor="proposalAbstract">Proposal Abstract:</Label>
                <Textarea
                  id="proposalAbstract"
                  name="proposalAbstract"
                  placeholder="Enter your proposal abstract"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.proposalAbstract}
                  disabled={registration?.status === 'PUBLISHED'}
                />
                {formik.touched.proposalAbstract && formik.errors.proposalAbstract && (
                  <ErrorText>{formik.errors.proposalAbstract}</ErrorText>
                )}
              </FlexColumn>
              <FlexRow $alignSelf="flex-end">
                <Button
                  color="secondary"
                  type="submit"
                  onClick={() => formik.setValues((prev) => ({ ...prev, status: 'DRAFT' }))}
                  disabled={registration?.status === 'PUBLISHED'}
                >
                  Save as draft
                </Button>
                <Button
                  type="submit"
                  onClick={() => formik.setValues((prev) => ({ ...prev, status: 'PUBLISHED' }))}
                  disabled={registration?.status === 'PUBLISHED'}
                >
                  Submit
                </Button>
              </FlexRow> */}
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
  register: UseFormRegister<{
    fields: GetRegistrationDataResponse;
  }>;
  disabled: boolean;
  errors: FieldErrors<{
    fields: GetRegistrationDataResponse;
  }>;
}) {
  return (
    <FlexColumn $gap="0.5rem">
      <Label htmlFor={props.title} required>
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
export default Register;
