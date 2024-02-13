// Components
// import Link from '../components/link';

// Styled components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import ZupassButton from '../components/zupassButton';

function Landing() {
  return (
    <FlexColumn $gap="2rem">
      <Body>
        We are a <Bold>community of open-source researchers</Bold> committed to solving the hardest
        problems in decentralization, including the challenge of maintaining research and academic
        independence in the wake of technological vertical integration and hyper-financialization.
        Using plural mechanism design, we experiment with novel ways to surface ideas in the public
        interest that transcend our biases — protocol, politics, purse — while encouraging
        collaboration and insights across unlikely intersections where breakthroughs tend to emerge.
      </Body>
      <Body>
        Our first convening is <Bold>May 23</Bold> in Berlin, where the community is tasked to
        allocate 100,000 ARB in research grants. The first topic broadly is MEV, though we accept
        other proposals related to decentralization, including privacy, security, identity,
        censorship resistance, data dignity, and partial common ownership—to name just a few.
        Surprise us.
      </Body>
      <Body>
        Sign up with{' '}
        <ZupassButton $variant="link">
          <Bold>Zupass here.</Bold>
        </ZupassButton>{' '}
        Submissions received before March 31 will get more attention.
      </Body>
      <Body>
        The experiment will be <Bold>novel, fun, and weird</Bold> — like the best of research… and
        Berlin. Through a series of structured interactions, the community will decide how to
        prioritize research and allocate funds, relying on structured, high-bandwidth deliberations
        that surface research public goods, while elevating truth and expertise with peer
        prediction. The community is interdisciplinary, drawing on insights from science of science,
        social science, economics, complexity science, cryptography, and philosophy, among other
        intersections. The community will test and evolve these mechanisms through multiple cycles
        of <Bold>feedback</Bold> and <Bold>adaptation</Bold>.
      </Body>
    </FlexColumn>
  );
}

export default Landing;
