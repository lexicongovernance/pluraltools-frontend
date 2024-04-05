import type { GetCycleResponse } from 'api';
import { FlexColumn } from '../containers/FlexColum.styled';
import CycleCard from '../cycleCard';
import { Title } from '../typography/Title.styled';

type VotingCardsProps = {
  state: string;
  cards: GetCycleResponse[];
};

function VotingCards({ state, cards }: VotingCardsProps) {
  return (
    <FlexColumn>
      <Title style={{ textTransform: 'capitalize' }}>{state} Agendas</Title>
      {cards && cards.map((card) => <CycleCard key={card.id} cycle={card} />)}
    </FlexColumn>
  );
}

export default VotingCards;
