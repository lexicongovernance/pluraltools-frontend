import { FlexColumn } from '../containers/FlexColum.styled';
import { Title } from '../typography/Title.styled';
import CycleTable from '../tables/cycle-table';
import type { GetCycleResponse } from 'api';

type VotingCardsProps = {
  state: string;
  cards: GetCycleResponse[];
};

function VotingCards({ state, cards }: VotingCardsProps) {
  return (
    <FlexColumn>
      <Title style={{ textTransform: 'capitalize' }}>{state} Agendas</Title>
      {cards && cards.map((card) => <CycleTable key={card.id} cycle={card} />)}
    </FlexColumn>
  );
}

export default VotingCards;
