import IconButton from '../icon-button';
import { Body } from '../typography/Body.styled';
import { Author, Card, Comment, Date, Likes } from './CommentsColumns.styled';

type CycleColumnsProps = {
  onColumnClick: (column: string) => void;
};

function CycleColumns({ onColumnClick }: CycleColumnsProps) {
  return (
    <Card>
      <Comment>
        <Body>Comment</Body>
      </Comment>
      <Author onClick={() => onColumnClick('author')}>
        <Body>Author</Body>
      </Author>
      <Date>
        <Body>Date</Body>
      </Date>
      <Likes onClick={() => onColumnClick('likes')}>
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/icons/thumb-up-active.svg`, alt: 'Thumbs up icon' }}
        />
      </Likes>
    </Card>
  );
}

export default CycleColumns;
