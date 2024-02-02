// Components
import Button from '../components/button';

// Styled components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';

function Register() {
  return (
    <FlexColumn>
      <Title>Register for []</Title>
      <Subtitle>props.event?.registrationDescription</Subtitle>
      <form></form>
      <Button>Save</Button>
    </FlexColumn>
  );
}

export default Register;
