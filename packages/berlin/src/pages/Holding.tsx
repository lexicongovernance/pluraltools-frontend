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

  // TODO: Create functions to navigate to onboarding slides

  return (
    <FlexColumn $gap="2rem">
      <Title>Thank you for submitting!</Title>
      <Body>
        We might not be able to accommodate everyone, given limited space. But we hope to.
      </Body>
      <Body>
        Note: For entities operating in the MEV space (searcher, builder, relay), those backed by
        venture capital, or those controlled by parties with a financial interest, we kindly request
        that at least one senior researcher (holding a PhD or equivalent) to represent your
        organization at the event. This ensures a balance of expertise and experience across
        participating entities, fostering an environment of in-depth research collaboration and
        preventing knowledge imbalances that could hinder open exchange.
      </Body>
      <Body>
        Click on the following links to edit/review{' '}
        <Link to="#" onClick={handleRegistrationClick}>
          your submission
        </Link>{' '}
        and to revisit the{' '}
        <Link to="#" onClick={() => {}}>
          community guiding principles
        </Link>
        ,{' '}
        <Link to="#" onClick={() => {}}>
          privacy ambitions and trust assumptions
        </Link>
        , and{' '}
        <Link to="#" onClick={() => {}}>
          proposal guidelines
        </Link>
        .
      </Body>
      <Body>We will notify participants on a rolling basis.</Body>
    </FlexColumn>
  );
}

export default Holding;
