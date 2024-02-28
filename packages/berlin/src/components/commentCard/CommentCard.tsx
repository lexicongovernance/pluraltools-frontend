import { Comment } from 'api';
import { Body } from '../typography/Body.styled';
import { Subtitle } from '../typography/Subtitle.styled';

type CommentCardProps = {
  comment: Comment;
};

function CommentCard({ comment }: CommentCardProps) {
  return (
    <article key={comment.id}>
      <Subtitle>{comment.userId}</Subtitle>
      <Body>{JSON.stringify(comment.createdAt)}</Body>
      <Body>{comment.value}</Body>
    </article>
  );
}

export default CommentCard;
