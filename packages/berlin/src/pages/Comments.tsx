// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

// API
import { fetchComments, fetchOption, postComment } from 'api';

// Components
import BackButton from '../components/back-button';
import Button from '../components/button';
import CommentsColumns from '../components/columns/comments-columns';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Form } from '../components/containers/Form.styled';
import Icon from '../components/icon';
import CommentsTable from '../components/tables/comment-table';
import Textarea from '../components/textarea';
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';

function Comments() {
  const queryClient = useQueryClient();
  const { optionId } = useParams();
  const [comment, setComment] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' for ascending, 'desc' for descending

  const { data: option, isLoading } = useQuery({
    queryKey: ['option', optionId],
    queryFn: () =>
      fetchOption({ optionId: optionId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!optionId,
  });

  const { data: comments } = useQuery({
    queryKey: ['option', optionId, 'comments'],
    queryFn: () =>
      fetchComments({ optionId: optionId || '', serverUrl: import.meta.env.VITE_SERVER_URL }),
    enabled: !!optionId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const sortedComments = useMemo(() => {
    if (!comments) return [];

    return comments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [comments, sortOrder]);

  const { mutate: mutateComments } = useMutation({
    mutationFn: postComment,
    onSuccess: (body) => {
      if (body?.value) {
        queryClient.invalidateQueries({ queryKey: ['option', optionId, 'comments'] });
      }
    },
  });

  const handlePostComment = () => {
    if (optionId && comment) {
      mutateComments({
        optionId: optionId,
        value: comment,
        serverUrl: import.meta.env.VITE_SERVER_URL,
      });
      setComment('');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      <FlexColumn>
        <Subtitle>{option?.title}</Subtitle>
        <Body>{option?.subTitle}</Body>
      </FlexColumn>
      <Form>
        <Textarea
          label="Leave a comment:"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handlePostComment}>Comment</Button>
      </Form>
      {sortedComments.length > 0 && (
        <>
          <FlexRow $justify="space-between">
            <Subtitle>Total comments ({sortedComments.length})</Subtitle>

            <FlexRow
              $gap="0.25rem"
              style={{ flex: 0 }}
              onClick={() => setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))}
            >
              <Bold>Sort</Bold>
              <Icon>
                <ArrowDownUp />
              </Icon>
            </FlexRow>
          </FlexRow>
          <FlexColumn>
            <CommentsColumns />
            {sortedComments.map((comment) => (
              <CommentsTable key={comment.id} comment={comment} />
            ))}
          </FlexColumn>
        </>
      )}
    </FlexColumn>
  );
}

export default Comments;
