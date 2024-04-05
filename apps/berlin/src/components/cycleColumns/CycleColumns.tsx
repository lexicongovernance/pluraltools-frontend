import IconButton from '../iconButton';
import { Body } from '../typography/Body.styled';
import { Affiliation, Author, Card, Hearts, Plurality, Proposal } from './CycleColumns.styled';

type CycleColumnsProps = {
  onColumnClick: (column: string) => void;
};

function CycleColumns({ onColumnClick }: CycleColumnsProps) {
  return (
    <Card>
      <Proposal>
        <Body>Proposal</Body>
      </Proposal>
      <Author onClick={() => onColumnClick('author')}>
        <Body>Author</Body>
      </Author>
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
      <Plurality onClick={() => onColumnClick('voteScore')}>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
        />
      </Plurality>
    </Card>
  );
}

export default CycleColumns;
