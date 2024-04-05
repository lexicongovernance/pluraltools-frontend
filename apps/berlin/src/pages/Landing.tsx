// Styled components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { SafeArea } from '../layout/Layout.styled';
import ZupassButton from '../components/zupassButton';

function Landing() {
  return (
    <SafeArea>
      <FlexColumn $gap="2rem">
        <Body>
          We are a <Bold>community of open-source researchers</Bold> committed to solving the
          hardest problems in decentralization, including the challenge of maintaining research and
          academic independence in the wake of technological vertical integration and
          hyper-financialization. Using <Bold>plural mechanism design</Bold>, we experiment with
          novel ways to surface ideas in the public interest that transcend our biases — protocol,
          politics, purse — while encouraging collaboration and insights across unlikely
          intersections where breakthroughs tend to emerge.
        </Body>
        <Body>
          Our first convening is <Bold>May 28 in Berlin</Bold>, where the community is tasked to
          allocate 100,000 ARB in research grants.
        </Body>
        <Body>
          The <Bold>funding mandate is MEV</Bold>. We invite research proposals that explore MEV
          narrowly and broadly — within and across execution layers (L1), rollups (L2s), oracles,
          applications, etc. The mandate also extends to related topics such as chain abstraction,
          account abstraction, gas fee optimization, AI agents, ZK, trusted hardware, and topics
          related to decentralization — including richer notions of identity, contextual integrity
          (“privacy”), collusion resistance, and partial common ownership.
        </Body>
        <Body>
          This is a community event, <Bold>where researchers set the agenda.</Bold>{' '}
          Through a series of structured interactions, the community will prioritize research and
          allocate funds, relying on plural mechanisms — <Bold>deliberation, plural voting, peer 
          prediction, and healthy social recombination</Bold> — to surface research in the broader public good. 
        </Body>
        <Body>
          The experiment will be novel, fun, and weird — like the best of research… and Berlin. Surprise the community with your proposals!
        </Body>
        <Body>
          Sign up with{' '}
          <ZupassButton $variant="link">
            <Bold>Zupass here.</Bold>
          </ZupassButton>{' '}
          Submissions received before April 15 will get more attention.
        </Body>
      </FlexColumn>
    </SafeArea>
  );
}

export default Landing;
