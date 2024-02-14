import Hero from '../components/hero';
import ZupassLoginButton from '../components/zupassLoginButton';
import landing from '../data/landing';
import { FlexColumn, MobileColumn } from '../layout/Layout.styled';
import Body from '../components/typography/Body';
import Subtitle from '../components/typography/Subtitle';

function Landing() {
  return (
    <FlexColumn $gap="8rem">
      <Hero data={landing.hero} />
      <MobileColumn $gap="2rem">
        <Subtitle $align="center">{landing.innovation.title}</Subtitle>
        <Body $align="center">{landing.innovation.body}</Body>
      </MobileColumn>
      <MobileColumn $gap="2rem">
        <Subtitle $align="center">{landing.when.title}</Subtitle>
        <Body $align="center">{landing.when.body}</Body>
      </MobileColumn>
      <MobileColumn $gap="2rem">
        <Subtitle $align="center">{landing.what.title}</Subtitle>
        <Body $align="center">{landing.what.body}</Body>
      </MobileColumn>
      <MobileColumn $gap="2rem">
        <Subtitle $align="center">{landing.how.title}</Subtitle>
        <Body $align="center">{landing.how.body}</Body>
        <ZupassLoginButton center>{landing.how.button}</ZupassLoginButton>
      </MobileColumn>
    </FlexColumn>
  );
}

export default Landing;
