// React and third-party libraries
import { useParams, useNavigate } from 'react-router-dom';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import { Title } from '../components/typography/Title.styled';
import Link from '../components/link';

function Holding() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleRegistrationClick = () => {
    navigate(`/events/${eventId}/register`);
  };

  return (
    <FlexColumn $gap="2rem">
      <Title>Thank you for submitting!</Title>
      <Body>We might not be able to accommodate everyone given limited space, but we hope to.</Body>
      <Body>We will notify participants on a rolling basis.</Body>
      <Body>
        If you need to edit your submission, then{' '}
        <Link to="#" onClick={handleRegistrationClick}>
          click here
        </Link>
        .
      </Body>
    </FlexColumn>
  );
}

export default Holding;
