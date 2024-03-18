// React and third-party libraries
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// API
import { GetCommentsResponse, deleteLike, fetchCommentLikes, postLike } from 'api';

// Hooks
import useUser from '../../hooks/useUser';

// Store
import { useAppStore } from '../../store';

// Components
import { Body } from '../typography/Body.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import Button from '../button';
import IconButton from '../iconButton';

// Styled Components
import { Card, FormattedDate, Username } from './CommentCard.styled';

type CommentCardProps = {
  comment: GetCommentsResponse[number];
};

function CommentCard({ comment }: CommentCardProps) {
  const theme = useAppStore((state) => state.theme);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [isCommentLiked, setIsCommentLiked] = useState(false);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date(comment.createdAt));

  const { data: commentLikes } = useQuery({
    queryKey: ['commentLikes', comment.id],
    queryFn: () => fetchCommentLikes({ commentId: comment.id }),
    enabled: !!comment.id,
  });

  useEffect(() => {
    // Check if the current user's ID exists in the likes array.
    if (commentLikes) {
      const currentUserLiked = commentLikes.some((like) => like.userId === user?.id);
      setIsCommentLiked(currentUserLiked);
    }
  }, [commentLikes]);

  const { mutate: postLikeMutation } = useMutation({
    mutationFn: postLike,
    onSuccess: (body) => {
      if (body) {
        setIsCommentLiked(true);
        queryClient.invalidateQueries({ queryKey: ['commentLikes', comment.id] });
      }
    },
  });

  const { mutate: deleteLikeMutation } = useMutation({
    mutationFn: deleteLike,
    onSuccess: (body) => {
      if (body) {
        setIsCommentLiked(false);
        queryClient.invalidateQueries({ queryKey: ['commentLikes', comment.id] });
      }
    },
  });

  const handleLikeClick = () => {
    if (isCommentLiked) {
      deleteLikeMutation({ commentId: comment.id });
    } else {
      postLikeMutation({ commentId: comment.id });
    }
  };

  return (
    <Card key={comment.id}>
      <Username>{comment.user?.username}</Username>
      <FormattedDate>{formattedDate}</FormattedDate>
      <Body>{comment.value}</Body>
      <FlexRow $gap="0.5rem" $align="center" $justify="flex-end">
        <IconButton
          onClick={handleLikeClick}
          icon={{
            src: isCommentLiked ? `/icons/thumb-up-active.svg` : `/icons/thumb-up-${theme}.svg`,
            alt: 'Thumb up icon',
          }}
          $padding={4}
          $color="secondary"
          $height={20}
          $width={20}
        />
        <Button $variant="text" $color="secondary" disabled>
          ({commentLikes?.length})
        </Button>
      </FlexRow>
    </Card>
  );
}

export default CommentCard;
