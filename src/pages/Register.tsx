import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/button';
import Input from '../components/form/Input';
import Textarea from '../components/form/Textarea';
import { FlexColumn, FlexRow } from '../components/hero/Hero.styled';
import ErrorText from '../components/form/ErrorText';
import Label from '../components/form/Label';
import useUser from '../hooks/useUser';
import { PostProposalType } from '../types/ProposalType';
import { useEffect, useState } from 'react';
import postRegistration from '../api/postRegistration';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../main';
import fetchRegistrations from '../api/fetchRegistration';
import useGroups from '../hooks/useGroups';
import Select from '../components/form/Select';
import Chip from '../components/chip';
import fetchRegistrationOptions from '../api/fetchRegistrationOptions';

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
  const [skipOnboarding, setSkipOnboarding] = useState(localStorage.getItem('skip_onboarding'));
  const handleSkip = () => {
    setSkipOnboarding('true');
    localStorage.setItem('skip_onboarding', 'true');
  };
  // check if is visited
  if (skipOnboarding == 'true') {
    return <RegisterForm />;
  }

  // make a component that shows onboarding if not visited
  return <OnboardingRegisterForm handleSkip={handleSkip} />;
}

function OnboardingRegisterForm({ handleSkip }: { handleSkip: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const texts = [
    `Welcome to our platform! We're thrilled to have you join our vibrant community. As you
  embark on this exciting journey with us, you'll discover a plethora of features designed to
  enhance your experience. Our platform is tailored to foster engagement, learning, and
  collaboration.`,
    `Whether you're here to gain new insights, share your expertise, or connect
  with like-minded individuals, you're in the right place. To get started, we recommend
  exploring our diverse forums and groups. They are the perfect spaces to engage in
  discussions, ask questions, and offer your unique perspectives. To make the most of your
  time here, don't hesitate to dive into creating and participating in various events and
  discussions.`,
    `Your contributions are valuable and help in creating a rich, diverse, and
  informative environment for all members. If you have any questions or need assistance, our
  dedicated support team is always here to help. Remember, this is your community too, and
  your active participation shapes its future. Welcome aboard, and let's embark on this
  journey of discovery and growth together!`,
  ];

  return (
    <FlexColumn
      style={{
        width: '50%',
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      <p>{texts[currentStep]}</p>
      <FlexRow $alignSelf="center">
        {Array.from({ length: texts.length }).map((_, i) =>
          i === currentStep ? <p>*</p> : <p>.</p>
        )}
      </FlexRow>
      <FlexRow $alignSelf="flex-end">
        <Button variant="text" color="secondary" onClick={handleSkip}>
          Skip
        </Button>
        <Button
          onClick={() =>
            currentStep === texts.length - 1 ? handleSkip() : setCurrentStep((prev) => prev + 1)
          }
        >
          Continue
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}

function RegisterForm() {
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
          <h2>Register Page:</h2>
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
              {registrationOptions &&
                Object.entries(registrationOptions).map(([category, options]) => (
                  <FlexColumn key={category} $gap="0.5rem">
                    <Label htmlFor={category}>{category}</Label>
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
