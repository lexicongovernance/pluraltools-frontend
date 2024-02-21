import { FlexColumn } from '../containers/FlexColum.styled';
import { Grid } from '../containers/Grid.styled';
import { Title } from '../typography/Title.styled';
import CycleCard from '../cycleCard';
import type { GetCycleResponse } from 'api';

type VotingCardsProps = {
  state: string;
  cards: GetCycleResponse[];
};

function VotingCards({ state, cards }: VotingCardsProps) {
  return (
    <FlexColumn>
      <Title style={{ textTransform: 'capitalize' }}>{state} Votes</Title>
      {cards && (
        <Grid $columns={2}>
          {cards.map((card) => (
            <CycleCard key={card.id} cycle={card} />
          ))}
        </Grid>
      )}
    </FlexColumn>
  );
}

export default VotingCards;
