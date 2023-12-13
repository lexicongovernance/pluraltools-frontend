import Button from '../button'
import { Section, FlexColumn } from './Hero.styled'

function Hero() {
  return (
    <Section>
      <img src="/landing-graphic.svg" alt="Graphic" />
      <FlexColumn gap={'3rem'}>
        <FlexColumn gap={'1.5rem'}>
          <h1>Unlock the Future of MEV Research with Plural MEV Grants</h1>
          <p>
            Shape the future of MEV research. Join Plural MEV, earn a share of
            100,000 ARB grants, and be part of a groundbreaking conference.
            Connect your Zupass wallet and contribute to a decentralized MEV
            ecosystem.
          </p>
        </FlexColumn>
        <Button>Get started</Button>
      </FlexColumn>
    </Section>
  )
}

export default Hero
