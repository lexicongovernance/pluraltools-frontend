import * as Yup from 'yup'
import { useFormik } from 'formik'
import Button from '../components/button'
import Input from '../components/form/Input'
import Textarea from '../components/form/Textarea'
import { FlexColumn, FlexRow } from '../components/hero/Hero.styled'
import ErrorText from '../components/form/ErrorText'
import Label from '../components/form/Label'
import useUser from '../hooks/useUser'

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string().min(4).required('Required'),
  proposalTitle: Yup.string().required('Required'),
  proposalAbstract: Yup.string(),
})

function Register() {
  const { user, isLoading } = useUser()

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      proposalTitle: '',
      proposalAbstract: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      // TODO: Simulating an asynchronous submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Log the values
      console.log('Form submitted with values:', values)

      // Reset the form using Formik's resetForm method
      formik.resetForm()
    },
  })

  // TODO: This will be a loading skeleton
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
      {user ? (
        <>
          <h2>Register Page:</h2>
          <br />
          <form onSubmit={formik.handleSubmit}>
            <FlexColumn gap="0.75rem">
              <FlexColumn gap="0.5rem">
                <Label isRequired htmlFor="email" title="Required">
                  Email:
                </Label>
                <Input
                  type="text"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <ErrorText>{formik.errors.email}</ErrorText>
                )}
              </FlexColumn>
              <FlexColumn gap="0.5rem">
                <Label isRequired htmlFor="username" title="Required">
                  Username:
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username && (
                  <ErrorText>{formik.errors.username}</ErrorText>
                )}
              </FlexColumn>

              <FlexColumn gap="0.5rem">
                <Label isRequired htmlFor="proposalTitle" title="Required">
                  Proposal Title:
                </Label>
                <Input
                  type="text"
                  id="proposalTitle"
                  name="proposalTitle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.proposalTitle}
                />
                {formik.touched.proposalTitle &&
                  formik.errors.proposalTitle && (
                    <ErrorText>{formik.errors.proposalTitle}</ErrorText>
                  )}
              </FlexColumn>

              <FlexColumn gap="0.5rem">
                <Label htmlFor="proposalAbstract">Proposal Abstract:</Label>
                <Textarea
                  id="proposalAbstract"
                  name="proposalAbstract"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.proposalAbstract}
                />
                {formik.touched.proposalAbstract &&
                  formik.errors.proposalAbstract && (
                    <ErrorText>{formik.errors.proposalAbstract}</ErrorText>
                  )}
              </FlexColumn>

              <FlexRow alignSelf="flex-end">
                <Button color="secondary" type="button">
                  Save as draft
                </Button>
                <Button type="submit">Submit</Button>
              </FlexRow>
            </FlexColumn>
          </form>
        </>
      ) : (
        <h2>Please login</h2>
      )}
    </>
  )
}

export default Register
