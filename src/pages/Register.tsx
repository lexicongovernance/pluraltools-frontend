import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '../components/button';
import Input from '../components/form/Input';
import Textarea from '../components/form/Textarea';
import { FlexColumn, FlexRow } from '../components/hero/Hero.styled';
import ErrorText from '../components/form/ErrorText';
import Label from '../components/form/Label';
import useUser from '../hooks/useUser';
import { ProposalType } from '../types/ProposalType';
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

function Register() {
  const { groups } = useGroups();
  const { user, isLoading } = useUser();
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | undefined>();

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
        queryClient.invalidateQueries({ queryKey: ['registrations'] });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      proposalTitle: '',
      proposalAbstract: '',
      status: 'DRAFT',
      group: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      // TODO: Simulating an asynchronous submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (user) {
        const postValues: ProposalType = {
          ...values,
          userId: user?.id,

          status,
        };
        console.log('🚀 ~ file: Register.tsx:31 ~ onSubmit: ~ values:', postValues);
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
                <Label htmlFor="group" required>
                  Select Group:
                </Label>
                <Select
                  id="group"
                  name="group"
                  placeholder="Choose a group"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.group}
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
                {formik.touched.group && formik.errors.group && (
                  <ErrorText>{formik.errors.group}</ErrorText>
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
