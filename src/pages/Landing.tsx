import styled from 'styled-components';
import Card from '../components/card';
import Hero from '../components/hero';
import ZupassLoginButton from '../components/zupassLoginButton';
import landing from '../data/landing';
import { FlexColumn, Grid } from '../layout/Layout.styled';

const Subtitle = styled.h3`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.25rem;
  line-height: 2.125rem;
  text-align: center;
`;

const Text = styled.p<{ center?: boolean }>`
  text-align: ${(props) => props.center && 'center'};
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
`;

const ListItem = styled(Text).attrs({ as: 'li' })``;

function Landing() {
  return (
    <FlexColumn $gap="10rem">
      <Hero data={landing.hero} />
      <FlexColumn $gap="4rem">
        <Subtitle>{landing.explore.title}</Subtitle>
        <Grid $columns={3}>
          {landing.explore.cards.map((card) => (
            <Card key={card.id} icon={card.icon} title={card.title} body={card.body} />
          ))}
        </Grid>
      </FlexColumn>
      <FlexColumn $gap="4rem">
        <Subtitle>{landing.benefits.title}</Subtitle>
        <Grid $columns={2} $rows={2} $gap="2rem">
          {landing.benefits.items.map((item, itemIndex) => (
            <ListItem key={itemIndex}>{item}</ListItem>
          ))}
        </Grid>
      </FlexColumn>
      <FlexColumn $gap="4rem">
        <Subtitle>{landing.spark.title}</Subtitle>
        <Text center>{landing.spark.body}</Text>
        <ZupassLoginButton center>{landing.spark.button}</ZupassLoginButton>
      </FlexColumn>
    </FlexColumn>
  );
}

export default Landing;
