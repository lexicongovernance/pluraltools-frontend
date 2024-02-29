import IconButton from '../iconButton';
import { Body } from '../typography/Body.styled';
import { Affiliation, Author, Card, Hearts, Plurality, Proposal } from './CycleColumns.styled';

function CycleColumns() {
  return (
    <Card>
      <Proposal>
        <Body>Proposal</Body>
      </Proposal>
      <Author>
        <Body>Author</Body>
      </Author>
      <Affiliation>
        <Body>Affiliation</Body>
      </Affiliation>
      <Hearts>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/heart-full.svg`, alt: 'Full heart' }}
        />
      </Hearts>
      <Plurality>
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
