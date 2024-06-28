import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';
import { Lead, Card, Hearts, Proposal, Plurality } from './CycleColumns.styled';

type CycleColumnsProps = {
  onColumnClick: (column: string) => void;
  showScore?: boolean;
};

function CycleColumns({ onColumnClick, showScore }: CycleColumnsProps) {
  return (
    <Card>
      <Proposal>
        <Body>Vote Items</Body>
      </Proposal>
      <Lead onClick={() => onColumnClick('lead')}>
        <Body>Creator</Body>
      </Lead>
      <Hearts onClick={() => onColumnClick('numOfVotes')}>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/heart-full.svg`, alt: 'Full heart' }}
        />
      </Hearts>
      {showScore && (
        <Plurality onClick={() => onColumnClick('voteScore')}>
          <IconButton
            $padding={0}
            $color="secondary"
            icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
          />
        </Plurality>
      )}
    </Card>
  );
}

export default CycleColumns;
