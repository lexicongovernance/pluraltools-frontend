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
          As part of the Ethereum Foundation’s 2024{' '}
          <Link to="https://summerofprotocols.com">Summer of Protocols</Link> program, we have
          created this tool to analyze the efficiency, effectiveness and risks of quadratic and
          plural voting mechanisms. You can learn more about the plural voting mechanism
          <Link to="https://github.com/lexicongovernance/pluraltools-backend/wiki/Plural-Voting-Model">
          {' '}here
          </Link>
          .
        </Body>
        <Body>
          If you’re a member of the 2024 or 2023 Summer of Protocols cohorts or the organizing team,
          please log in with your{' '}
          <ZupassButton $variant="link">
            <Bold>ZuPass</Bold>
          </ZupassButton>{' '}
          and vote.
        </Body>
        <Body>
          The tool has already been used to distribute follow-on grants for the Protocol Pill
          Incepting Lore and Literacy (recursively, PILL) Challenge.
        </Body>
        <Body>
          The data generated through this tool will be anonymized and used as part of the{' '}
          <Link to="https://forum.summerofprotocols.com/t/pig-plurality-in-practice/980">
            Plurality in Practice
          </Link>{' '}
          Protocol Orienteering Grant.
        </Body>
      </FlexColumn>
    </SafeArea>
  );
}

export default Landing;
