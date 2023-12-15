import { useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Button from '../components/button'
import Input from '../components/form/Input'
import Textarea from '../components/form/Textarea'
import { FlexRow } from '../components/hero/Hero.styled'
import fetchUserData from '../api/fetchUserData'

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string().required('Required'),
  proposalTitle: Yup.string().required('Required'),
  proposalAbstract: Yup.string().required('Required'),
})

function Register() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    retry: false,
    staleTime: 10000,
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      proposalTitle: '',
      proposalAbstract: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log('Form submitted with values:', values)
    },
  })

  // This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      <h2>Register Page:</h2>
      <br />
      {user ? (
        <>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">Email:</label>
            <Input
              type="text"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div>{formik.errors.email}</div>
            )}

            <label htmlFor="username">Username:</label>
            <Input
              type="text"
              id="username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div>{formik.errors.username}</div>
            )}

            <label htmlFor="proposalTitle">Proposal Title:</label>
            <Input
              type="text"
              id="proposalTitle"
              name="proposalTitle"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.proposalTitle}
            />
            {formik.touched.proposalTitle && formik.errors.proposalTitle && (
              <div>{formik.errors.proposalTitle}</div>
            )}

            <label htmlFor="proposalAbstract">Proposal Abstract:</label>
            <Textarea
              id="proposalAbstract"
              name="proposalAbstract"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.proposalAbstract}
            />
            {formik.touched.proposalAbstract &&
              formik.errors.proposalAbstract && (
                <div>{formik.errors.proposalAbstract}</div>
              )}
            <FlexRow>
              <Button color="secondary" type="submit">
                Save as draft
              </Button>
              <Button type="submit">Submit</Button>
            </FlexRow>
          </form>
        </>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  )
}

export default Register
