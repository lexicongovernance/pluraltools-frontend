// React and third-party libraries
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { SafeArea } from '../layout/Layout.styled';
import Link from '../components/link';

const ImageContainer = styled.div`
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  margin-inline: auto;
  overflow: hidden;
  width: 100%;

  @media (min-width: 640px) {
    width: 450px;
  }
`;

function Holding() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleRegistrationClick = () => {
    navigate(`/events/${eventId}/register`);
  };

  const handleDataPolicyClick = () => {
    navigate(`/data-policy`);
  };

  // TODO: Create functions to navigate to onboarding slides

  const handleOnboardingClick = () => {
    navigate(`/onboarding`);
  };

  return (
    <SafeArea>
      <FlexColumn $gap="2rem">
        <Body>Thank you for submitting!</Body>
        <Body>
          We might not be able to accommodate everyone, given limited space. But we hope to.
        </Body>
        <Body>
          Note: For entities operating in the MEV space (searcher, builder, relay, etc.), those
          backed by venture capital, or those controlled by parties with a financial interest, we
          kindly request that at least one senior researcher (holding a PhD or equivalent) or senior
          executive (e.g., CEO) represent your organization at the event. This ensures a balance of
          expertise and experience across participating entities, fostering an environment of
          in-depth research collaboration and preventing knowledge imbalances that could hinder open
          exchange.
        </Body>
        <Body>
          Click to{' '}
          <Link to="#" onClick={handleRegistrationClick}>
            edit your submission
          </Link>{' '}
          and to revisit the{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 2, previousPath: location.pathname }}
          >
            event rules
          </Link>
          ,{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 0, previousPath: location.pathname }}
          >
            trust assumptions
          </Link>
          , and the community’s{' '}
          <Link to="#" onClick={handleDataPolicyClick}>
            data policy
          </Link>
        </Body>
        <Body>We will notify participants on a rolling basis.</Body>
        <ImageContainer>
          <img
            src="/images/cats_dogs.webp"
            alt="Image of cats and dogs wearling sunglasses in front of Berlin Brandenburg gate"
          />
        </ImageContainer>
      </FlexColumn>
    </SafeArea>
  );
}

export default Holding;
