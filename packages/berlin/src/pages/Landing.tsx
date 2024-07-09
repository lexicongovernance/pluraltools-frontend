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
          Part of the Ethereum Foundation’s{' '}
          <Link to="https://summerofprotocols.com">2024 Summer of Protocols</Link> program, the
          Protocol Pill Incepting Lore and Literacy (recursively, PILL) Challenge awarded $1000
          microgrants to individuals who want to create a protocol-themed creative work with memetic
          potential over the summer, such as a short story, graphic novel, illustration, poster,
          meme campaign, or short audio/video works.
        </Body>
        <Body>The drafts have now been submitted!</Body>
        <Body>
          If you’re a member of the 2024 or 2023 Summer of Protocols cohorts or the organizing team,
          please log in with your{' '}
          <ZupassButton $variant="link">
            <Bold>ZuPass.</Bold>
          </ZupassButton>{' '}
          and vote on your favourite PILL project to receive a follow-on grant.
        </Body>
        <Body>
          The data generated through this tool will be used as part of the{' '}
          <Link to="https://forum.summerofprotocols.com/t/pig-plurality-in-practice/980">
            Plurality in Practice
          </Link>{' '}
          Protocol during Orienteering Grant, which aims to analyze the efficiency, effectiveness
          and risks of quadratic and plural voting mechanisms.
        </Body>
      </FlexColumn>
    </SafeArea>
  );
}

export default Landing;
