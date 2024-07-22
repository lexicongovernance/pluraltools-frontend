// Styled components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { SafeArea } from '../layout/Layout.styled';
import ZupassButton from '../components/zupass-button';
import Link from '../components/link';

function Landing() {
  return (
    <SafeArea>
      <FlexColumn $gap="2rem">
        <Body>
          This tool is designed to demonstrate Lexicon’s plural governance tooling. Users can
          register, discuss, and vote on proposals, with vote results calculated quadratically or
          plurally, with bridging bonuses calculated based on relationships between participants.
        </Body>
        <Body>
          If you’re here as part of a demo, please login with{' '}
          <ZupassButton $variant="link">
            <Bold>Zupass</Bold>
          </ZupassButton>{' '}
          to continue.
        </Body>
        <Body>
          If you’ve arrived here by other means, please check out our{' '}
          <Link to="https://github.com/lexicongovernance">GitHub</Link> or{' '}
          <Link to="link to be inserted">click here</Link> to request a demonstration.
        </Body>
      </FlexColumn>
    </SafeArea>
  );
}

export default Landing;
