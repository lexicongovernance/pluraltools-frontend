// React and third-party libraries
import { useQuery } from '@tanstack/react-query';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import Link from '../components/link';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// API Calls
import { fetchEvents } from 'api';

function Holding() {
  const navigate = useNavigate();

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (eventsLoading) {
    return <Body>Loading events...</Body>;
  }

  // Define onClick handler to navigate to registration page and trigger reload
  const handleRegistrationClick = () => {
    navigate(`/events/${events?.[0]?.id}/register`, { replace: true }); 
    window.location.reload();
  };

  return (
    <FlexColumn $gap="2rem">
      <Body>Thank you for submitting!</Body>
      <Body>We might not be able to accommodate everyone given limited space, but we hope to.</Body>
      <Body>We will inform you of the status by April 15, at the latest.</Body>
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
