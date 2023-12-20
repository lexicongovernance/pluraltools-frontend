import ZupassLoginButton from '../zupassLoginButton';
import { Section, Body } from './Hero.styled';
import { FlexColumn } from '../../layout/Layout.styled';

function Hero() {
  return (
    <Section>
      <img src="/landing-graphic.svg" alt="Graphic" />
      <FlexColumn $gap={'3rem'}>
        <FlexColumn $gap={'2rem'}>
          <h1>Unlock the Future of MEV Research with Plural MEV Grants</h1>
          <Body>
            Shape the future of MEV research. Join Plural MEV, earn a share of 100,000 ARB grants,
            and be part of a groundbreaking conference. Connect your Zupass wallet and contribute to
            a decentralized MEV ecosystem.
          </Body>
        </FlexColumn>
        <ZupassLoginButton>Get started</ZupassLoginButton>
      </FlexColumn>
    </Section>
  );
}

export default Hero;
