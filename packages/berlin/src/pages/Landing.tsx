// Styled components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { SafeArea } from '../layout/Layout.styled';
import ZupassButton from '../components/zupass-button';
import Link from '@/components/link';

function Landing() {
  return (
    <SafeArea>
      <FlexColumn $gap="2rem">
        <Body>
          <Link to="https://summerofprotocols.com/protocol-week">Protocol Worlds</Link> during{' '}
          <Link to="https://www.edgeesmeralda.com/">Edge Esmeralda</Link> is a week-long practical
          inquiry into the intersection of paradigm-shifting futures. Participants gather tensions,
          imagine protocols which might exist to resolve them and then conjure the artefacts which
          could exist at the intersection
        </Body>
        <Body>
          If you’re a participant in Protocol Worlds, login with your{' '}
          <ZupassButton $variant="link">
            <Bold>ZuPass.</Bold>
          </ZupassButton>{' '}
          to submit your artefacts, discuss and vote on various questions about these imagined
          future worlds and the tensions which brought us there.
        </Body>
        <Body>
          The data generated through this tool will be used as part of the{' '}
          <Link to="https://summerofprotocols.com/protocol-week">Plurality in Practice</Link>{' '}
          Protocol during Orienteering Grant, which aims to analyze the efficiency, effectiveness
          and risks of quadratic and plural voting mechanisms.
        </Body>
      </FlexColumn>
    </SafeArea>
  );
}

export default Landing;
