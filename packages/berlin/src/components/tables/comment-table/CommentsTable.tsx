// React and third-party libraries
import { ThumbsUp, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { GetCommentsResponse, deleteComment, deleteLike, fetchCommentLikes, postLike } from 'api';

// Hooks
import useUser from '../../../hooks/useUser';

// Components
import { FlexRow } from '../../containers/FlexRow.styled';
import Button from '../../button';
import Dialog from '../../dialog';
import Icon from '../../icon';

// Styled Components
import { Author, Card, Comment, FormattedDate } from './CommentsTable.styled';

type CommentsTableProps = {
  comment: GetCommentsResponse[number];
};

function CommentsTable({ comment }: CommentsTableProps) {
  const { optionId } = useParams();
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
    queryFn: () =>
      fetchCommentLikes({ commentId: comment.id, serverUrl: import.meta.env.VITE_SERVER_URL }),
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
      deleteLikeMutation({ commentId: comment.id, serverUrl: import.meta.env.VITE_SERVER_URL });
    } else {
      postLikeMutation({ commentId: comment.id, serverUrl: import.meta.env.VITE_SERVER_URL });
    }
  };

  const handleTrashClick = () => {
    if (optionId) {
      deleteCommentMutation({ commentId: comment.id, serverUrl: import.meta.env.VITE_SERVER_URL });
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
        <Icon>{isCommentLiked ? <ThumbsUp fill="#0866ff" /> : <ThumbsUp />}</Icon>
        <Button $variant="text" $color="secondary">
          ({commentLikes?.length})
        </Button>
      </FlexRow>
      {comment.user?.username === user?.username && (
        <Dialog
          trigger={
            <div style={{ width: 24 }}>
              <Icon>
                <Trash />
              </Icon>
            </div>
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
