import { FlexColumn } from '../../layout/Layout.styled';
import Heading from '../typography/Heading';
import ZupassLoginButton from '../zupassLoginButton';
import { Body, ImageContainer, Section } from './Hero.styled';

type HeroProps = {
  data: {
    title: string;
    body: string;
    button: string;
  };
};

function Hero({ data }: HeroProps) {
  return (
    <Section>
      <ImageContainer>
        <img src="/images/berlin.png" alt="Berlin graphic" />
      </ImageContainer>
      <FlexColumn $gap={'3rem'}>
        <FlexColumn $gap={'2rem'}>
          <Heading>{data.title}</Heading>
          <Body>{data.body}</Body>
        </FlexColumn>
        <ZupassLoginButton>{data.button}</ZupassLoginButton>
      </FlexColumn>
    </Section>
  );
}

export default Hero;
