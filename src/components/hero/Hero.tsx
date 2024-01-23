import ZupassLoginButton from '../zupassLoginButton';
import { Section, Body, ImageContainer } from './Hero.styled';
import { FlexColumn } from '../../layout/Layout.styled';
import Heading from '../typography/Heading';

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
        <img src="/berlin.png" alt="Graphic" />
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
