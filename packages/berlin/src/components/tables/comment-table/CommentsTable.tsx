// React and third-party libraries
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { GetCommentsResponse, deleteComment, deleteLike, fetchCommentLikes, postLike } from 'api';

// Hooks
import useUser from '../../../hooks/useUser';

// Store
import { useAppStore } from '../../../store';

// Components
import { FlexRow } from '../../containers/FlexRow.styled';
import Button from '../../button';
import Dialog from '../../dialog';
import IconButton from '../../icon-button';

// Styled Components
import { Author, Card, Comment, FormattedDate } from './CommentsTable.styled';

type CommentsTableProps = {
  comment: GetCommentsResponse[number];
};

function CommentsTable({ comment }: CommentsTableProps) {
  const { optionId } = useParams();
  const theme = useAppStore((state) => state.theme);
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [isCommentLiked, setIsCommentLiked] = useState(false);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date(comment.createdAt));

  const { data: commentLikes } = useQuery({
    queryKey: ['commentLikes', comment.id],
    queryFn: () => fetchCommentLikes({ commentId: comment.id }),
    enabled: !!comment.id,
    refetchInterval: 5000, // Poll every 5 seconds
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

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: deleteComment,
    onSuccess: (body) => {
      if (body) {
        queryClient.invalidateQueries({ queryKey: ['option', optionId, 'comments'] });
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

  const handleTrashClick = () => {
    if (optionId) {
      deleteCommentMutation({ commentId: comment.id });
    }
  };

  return (
    <Card>
      <FlexRow>
        <Comment>{comment.value}</Comment>
      </FlexRow>
      <Author title={`@${comment.user?.username}`}>
        {comment.user?.firstName} {comment.user?.lastName}
      </Author>
      <FormattedDate>{formattedDate}</FormattedDate>
      <FlexRow
        $gap="0.5rem"
        $align="center"
        $justify="flex-end"
        onClick={handleLikeClick}
        style={{ userSelect: 'none' }}
      >
        <IconButton
          icon={{
            src: isCommentLiked ? `/icons/thumb-up-active.svg` : `/icons/thumb-up-${theme}.svg`,
            alt: 'Thumb up icon',
          }}
          $padding={4}
          $color="secondary"
          $height={20}
          $width={20}
        />
        <Button $variant="text" $color="secondary">
          ({commentLikes?.length})
        </Button>
      </FlexRow>
      {comment.user?.username === user?.username && (
        <Dialog
          trigger={
            <IconButton
              icon={{ src: `/icons/trash-${theme}.svg`, alt: 'Trash bin icon' }}
              $color="secondary"
              $height={20}
              $padding={0}
              $width={20}
            />
          }
          title="Are you sure?"
          description="This action cannot be undone. This will permanently delete your comment from our servers."
          onActionClick={handleTrashClick}
          actionButtonText="Delete comment"
        />
      )}
    </Card>
  );
}

export default CommentsTable;
