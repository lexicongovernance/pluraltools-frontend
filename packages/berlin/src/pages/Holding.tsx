// React and third-party libraries
import { useParams, useNavigate } from 'react-router-dom';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import { Title } from '../components/typography/Title.styled';
import Link from '../components/link';
import styled from 'styled-components';
import { SafeArea } from '../layout/Layout.styled';

const ImageContainer = styled.div`
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
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

  // TODO: Create functions to navigate to onboarding slides

  const handleOnboardingClick = () => {
    navigate(`/onboarding`);
  };

  return (
    <SafeArea>
      <FlexColumn $gap="2rem">
        <Title>Thank you for submitting!</Title>
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
          Click on the following links to edit/review{' '}
          <Link to="#" onClick={handleRegistrationClick}>
            your submission
          </Link>{' '}
          and to revisit the{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 2, previousPath: location.pathname }}
          >
            event rules
          </Link>{' '}
          and{' '}
          <Link
            to="#"
            onClick={handleOnboardingClick}
            state={{ onboardingStep: 0, previousPath: location.pathname }}
          >
            trust assumptions
          </Link>
          .
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
