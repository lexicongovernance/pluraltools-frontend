// React and third-party libraries
import { useParams } from 'react-router-dom';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import { Title } from '../components/typography/Title.styled';
import Link from '../components/link';

function Holding() {
  const { eventId } = useParams();

  return (
    <FlexColumn $gap="2rem">
      <Title>Thank you for submitting!</Title>
      <Body>We might not be able to accommodate everyone given limited space, but we hope to.</Body>
      <Body>We will inform you of the status by April 15, at the latest.</Body>
      <Body>
        If you need to edit your submission, then{' '}
        <Link to={`/events/${eventId}/register`}>click here</Link>.
      </Body>
    </FlexColumn>
  );
}

export default Holding;
