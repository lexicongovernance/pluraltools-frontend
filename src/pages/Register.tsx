import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import fetchRegistrations from '../api/fetchRegistration';
import fetchRegistrationOptions from '../api/fetchRegistrationOptions';
import postRegistration from '../api/postRegistration';
import Button from '../components/button';
import Chip from '../components/chip';
import ErrorText from '../components/form/ErrorText';
import Input from '../components/form/Input';
import Label from '../components/form/Label';
import Select from '../components/form/Select';
import Textarea from '../components/form/Textarea';
import Onboarding from '../components/onboarding';
import register from '../data/register';
import useGroups from '../hooks/useGroups';
import useUser from '../hooks/useUser';
import { FlexColumn, FlexRow } from '../layout/Layout.styled';
import { PostProposalType } from '../types/ProposalType';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string().min(4).required('Required'),
  groupId: Yup.string().required('Please choose a group'),
  proposalTitle: Yup.string().required('Required'),
  proposalAbstract: Yup.string(),
});

type InitialValues = {
  email: string | undefined;
  username: string | undefined;
  proposalTitle: string;
  proposalAbstract: string | undefined;
  status: 'DRAFT' | 'PUBLISHED' | undefined;
  groupId?: string;
  registrationOptions: { [category: string]: string };
};

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
  const queryClient = useQueryClient();
  const { groups } = useGroups();
  const { user, isLoading } = useUser();
  const [initialValues, setInitialValues] = useState<InitialValues>({
    email: '',
    username: '',
    proposalTitle: '',
    proposalAbstract: '',
    status: undefined,
    groupId: '',
    registrationOptions: {},
  });

  const { data: registration } = useQuery({
    queryKey: ['registration'],
    queryFn: () => fetchRegistrations(user?.id || ''),
    staleTime: 10000,
    enabled: !!user?.id,
  });

  const { data: registrationOptions } = useQuery({
    queryKey: ['registration', 'options'],
    queryFn: fetchRegistrationOptions,
    staleTime: 10000,
  });

  const { mutate: mutateRegistrations } = useMutation({
    mutationFn: postRegistration,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['registration'] });
      }
    },
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      if (user && formik.values.groupId) {
        const postValues: PostProposalType = {
          ...values,
          userId: user?.id,
          groupIds: [formik.values.groupId],
          registrationOptionIds: Object.values(formik.values.registrationOptions),
        };
        mutateRegistrations(postValues);
      }

      // Reset the form using Formik's resetForm method
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (registration && registration.id) {
      setInitialValues({
        email: registration.email,
        username: registration.username,
        proposalTitle: registration.proposalTitle,
        proposalAbstract: registration.proposalAbstract,
        status: registration.status === 'DRAFT' ? registration.status : 'DRAFT',
        groupId: registration.groups?.[0].groupId,
        registrationOptions: registration.registrationOptions.reduce(
          (acc, next) => {
            acc[next.registrationOption.category] = next.registrationOptionId;
            return acc;
          },
          {} as InitialValues['registrationOptions']
        ),
      });
    }
  }, [registration]);

  useEffect(() => {
    console.log('Status', registration?.status);
  }, [registration]);

  // TODO: This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      {user ? (
        <FlexColumn>
          <h2>{register.form.title}</h2>
          {registration?.status && <Chip>{registration.status}</Chip>}
          <form onSubmit={formik.handleSubmit}>
            <FlexColumn $gap="0.75rem">
              <FlexColumn $gap="0.5rem">
                <Label htmlFor="email" required>
                  Email:
                </Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  disabled={registration?.status === 'PUBLISHED'}
                />
                {formik.touched.email && formik.errors.email && (
                  <ErrorText>{formik.errors.email}</ErrorText>
                )}
              </FlexColumn>
              <FlexColumn $gap="0.5rem">
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
              {registrationOptions &&
                Object.entries(registrationOptions).map(([category, options]) => (
                  <FlexColumn key={category} $gap="0.5rem">
                    <Label htmlFor={category}>{category}:</Label>
                    <Select
                      id={`registrationOptions.${category}`}
                      name={`registrationOptions.${category}`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.registrationOptions?.[category]}
                      disabled={registration?.status === 'PUBLISHED'}
                    >
                      <option value="" disabled>
                        Choose a {category}
                      </option>
                      {options.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Select>
                    {formik.touched.registrationOptions?.[category] &&
                      formik.errors.registrationOptions?.[category] && (
                        <ErrorText>{formik.errors.registrationOptions?.[category]}</ErrorText>
                      )}
                  </FlexColumn>
                ))}
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
              </FlexRow>
            </FlexColumn>
          </form>
        </FlexColumn>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  );
}
export default Register;
