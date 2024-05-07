import { Author, Card, Comment, Date, Likes } from './CommentsColumns.styled';

function CycleColumns() {
  return (
    <Card $columns={4}>
      <Comment>Comment</Comment>
      <Author>Author</Author>
      <Date>Date</Date>
      <Likes>Likes</Likes>
    </Card>
  );
}

export default CycleColumns;
