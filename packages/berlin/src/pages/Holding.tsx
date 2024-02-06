// Components
import Link from '../components/link';

// Styled components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';

function HoldingPage() {
  return (
    <FlexColumn $gap="2rem">
      <Body>
        Thank you for submitting!
      </Body>
      <Body>
        We might not be able to accommodate everyone given limited space, but we hope to.
      </Body>
      <Body>
        We will inform you of the status by April 15, at the latest.
      </Body>
      <Body>
        If you need to edit your submission, then <Link to="/event-registration">click here</Link>.
      </Body>
    </FlexColumn>
  );
}

export default HoldingPage;