import { Author, Card, Comment, Time, Likes } from './CommentsColumns.styled';

function CycleColumns() {
  return (
    <Card $columns={4}>
      <Comment>Comment</Comment>
      <Author>Author</Author>
      <Time>Time</Time>
      <Likes>Likes</Likes>
    </Card>
  );
}

export default CycleColumns;
