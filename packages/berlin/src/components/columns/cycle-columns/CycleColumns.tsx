import IconButton from '../../icon-button';
import { Body } from '../../typography/Body.styled';
import { Affiliation, Lead, Card, Hearts, Proposal, Plurality } from './CycleColumns.styled';

type CycleColumnsProps = {
  onColumnClick: (column: string) => void;
  showScore?: boolean;
};

function CycleColumns({ onColumnClick, showScore }: CycleColumnsProps) {
  return (
    <Card>
      <Proposal>
        <Body>Proposal</Body>
      </Proposal>
      <Lead onClick={() => onColumnClick('lead')}>
        <Body>Lead</Body>
      </Lead>
      <Affiliation onClick={() => onColumnClick('affiliation')}>
        <Body>Affiliation</Body>
      </Affiliation>
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
