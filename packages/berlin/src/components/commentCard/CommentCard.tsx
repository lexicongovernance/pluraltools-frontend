import { Comment } from 'api';
import { Body } from '../typography/Body.styled';
import { Card, FormattedDate, Username } from './CommentCard.styled';

type CommentCardProps = {
  comment: Comment;
};

function CommentCard({ comment }: CommentCardProps) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date(comment.createdAt));

  return (
    <Card key={comment.id}>
      <Username>{comment.userId}</Username>
      <FormattedDate>{formattedDate}</FormattedDate>
      <Body>{comment.value}</Body>
    </Card>
  );
}

export default CommentCard;
