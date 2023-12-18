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
import { useState } from 'react';
import postRegistration from '../api/postRegistration';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../main';
import fetchRegistrations from '../api/fetchRegistration';
import useGroups from '../hooks/useGroups';
import Select from '../components/form/Select';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string().min(4).required('Required'),
  group: Yup.string().required('Please choose a group'),
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
};

function Register() {
  const { groups } = useGroups();
  const { user, isLoading } = useUser();
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | undefined>();
  const [initialValues, setInitialValues] = useState<InitialValues>({
    email: '',
    username: '',
    proposalTitle: '',
    proposalAbstract: '',
    status,
    groupId: '',
  });

  const { data: registration } = useQuery({
    queryKey: ['registration'],
    queryFn: () => fetchRegistrations(user?.id || ''),
    staleTime: 10000,
    enabled: !!user?.id,
  });

  const { mutate: mutateRegistrations } = useMutation({
    mutationFn: postRegistration,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['registration'] });
      }
    },
  });

  // useEffect(() => {
  //   console.log('Initial values:', initialValues);
  //   if (registration) {
  //     setInitialValues({
  //       email: registration.email,
  //       username: registration.username,
  //       proposalTitle: registration.proposalTitle,
  //       proposalAbstract: registration.proposalAbstract,
  //       status: registration.status === 'DRAFT' ? registration.status : 'DRAFT',
  //       groupId: registration.groups?.[0].groupId,
  //     });
  //   }
  // }, [registration]);

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      if (user && formik.values.groupId) {
        const postValues: PostProposalType = {
          ...values,
          userId: user?.id,
          groupIds: [formik.values.groupId],
          status,
        };
        mutateRegistrations(postValues);
      }

      // Reset the form using Formik's resetForm method
      formik.resetForm();
    },
  });

  // TODO: This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      {user ? (
        <>
          <h2>Register Page:</h2>
          <br />
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
                />
                {formik.touched.proposalAbstract && formik.errors.proposalAbstract && (
                  <ErrorText>{formik.errors.proposalAbstract}</ErrorText>
                )}
              </FlexColumn>
              <FlexRow $alignSelf="flex-end">
                <Button color="secondary" type="button" onClick={() => setStatus('DRAFT')}>
                  Save as draft
                </Button>
                <Button type="submit" onClick={() => setStatus('PUBLISHED')}>
                  Submit
                </Button>
              </FlexRow>
            </FlexColumn>
          </form>
          <pre>{JSON.stringify(registration, null, 2)}</pre>
        </>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  );
}

export default Register;
