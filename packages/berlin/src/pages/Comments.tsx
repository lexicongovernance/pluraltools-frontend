// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// API
import { fetchOption, postVotes, fetchUserVotes, fetchComments, postComment } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Utils
import { handleSaveVotes, handleUnvote, handleVote } from '../utils/voting';

// Types
import { ResponseUserVotesType } from '../types/CycleType';

// Store
import { useAppStore } from '../store';

// Components
import { Body } from '../components/typography/Body.styled';
import { Bold } from '../components/typography/Bold.styled';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Form } from '../components/containers/Form.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import BackButton from '../components/back-button';
import Button from '../components/button';
import CommentCard from '../components/comment-card';
import CommentsColumns from '../components/comments-columns';
import IconButton from '../components/icon-button';
import Textarea from '../components/textarea';

function Comments() {
  const theme = useAppStore((state) => state.theme);
  const queryClient = useQueryClient();
  const { cycleId, optionId } = useParams();
  const { user } = useUser();
  const { availableHearts, setAvailableHearts } = useAppStore((state) => state);
  const [localUserVotes, setLocalUserVotes] = useState<
    ResponseUserVotesType | { optionId: string; numOfVotes: number }[]
  >([]);
  const [localOptionHearts, setLocalOptionHearts] = useState(0);
  const [comment, setComment] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' for ascending, 'desc' for descending

  const { data: option, isLoading } = useQuery({
    queryKey: ['option', optionId],
    queryFn: () => fetchOption(optionId || ''),
    enabled: !!optionId,
  });

  const { data: userVotes } = useQuery({
    queryKey: ['votes', cycleId],
    queryFn: () => fetchUserVotes(cycleId || ''),
    enabled: !!user?.id && !!cycleId,
    retry: false,
  });
  const { data: comments } = useQuery({
    queryKey: ['comments', optionId],
    queryFn: () => fetchComments({ optionId: optionId || '' }),
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

  useEffect(() => {
    if (optionId) {
      const hearts = userVotes?.find((option) => optionId === option.optionId)?.numOfVotes || 0;
      setLocalOptionHearts(hearts);
      setLocalUserVotes([{ optionId: optionId, numOfVotes: hearts }]);
    }
  }, [optionId, userVotes]);

  const { mutate: mutateVotes } = useMutation({
    mutationFn: postVotes,
    onSuccess: (body) => {
      if (body?.errors?.length) {
        toast.error(`Failed to save votes, ${body?.errors[0].message}`);
      } else if (body?.data.length) {
        queryClient.invalidateQueries({ queryKey: ['votes', cycleId] });
        // this is to update the plural scores in each option
        queryClient.invalidateQueries({ queryKey: ['cycles', cycleId] });
        toast.success('Votes saved successfully!');
      }
    },
  });

  const { mutate: mutateComments } = useMutation({
    mutationFn: postComment,
    onSuccess: (body) => {
      if (body?.value) {
        queryClient.invalidateQueries({ queryKey: ['comments', optionId] });
      }
    },
  });

  const handleVoteWrapper = (optionId: string) => {
    setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
    handleVote(optionId, availableHearts, setAvailableHearts, setLocalUserVotes);
  };

  const handleUnvoteWrapper = (optionId: string) => {
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    handleUnvote(optionId, availableHearts, setAvailableHearts, setLocalUserVotes);
  };

  const handleSaveVotesWrapper = () => {
    handleSaveVotes(userVotes, localUserVotes, mutateVotes);
  };

  const votesAreDifferent = useMemo(() => {
    if (localUserVotes && userVotes) {
      return (
        localUserVotes[0]?.numOfVotes !==
        userVotes?.find((vote) => vote.optionId === optionId)?.numOfVotes
      );
    }
  }, [localUserVotes, optionId, userVotes]);

  const handlePostComment = () => {
    if (optionId && comment) {
      mutateComments({ questionOptionId: optionId, value: comment });
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
        <FlexRow style={{ maxWidth: '4rem' }}>
          <FlexColumn $gap="-4px" style={{ maxWidth: '1rem' }}>
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/upvote-${theme}.svg`, alt: 'Upvote arrow' }}
              onClick={() => handleVoteWrapper(option?.id ?? '')}
              $width={16}
              $height={16}
              disabled={availableHearts === 0}
            />
            <IconButton
              $padding={0}
              $color="secondary"
              icon={{ src: `/icons/downvote-${theme}.svg`, alt: 'Downvote arrow' }}
              onClick={() => handleUnvoteWrapper(option?.id ?? '')}
              $width={16}
              $height={16}
              disabled={localOptionHearts === 0}
            />
          </FlexColumn>
          <Subtitle>{localOptionHearts}</Subtitle>
        </FlexRow>
        <Subtitle>{option?.optionTitle}</Subtitle>
        <Body>{option?.optionSubTitle}</Body>
        <Body>
          <Bold>Lead author:</Bold> [// TODO]
        </Body>
        <Body>
          <Bold>Co-authors:</Bold> [// TODO]
        </Body>
      </FlexColumn>

      <Button onClick={handleSaveVotesWrapper} disabled={!votesAreDifferent}>
        Save votes
      </Button>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Bold>Sort</Bold>
              <IconButton
                onClick={() => setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'))}
                icon={{
                  src: `/icons/sort-${theme}.svg`,
                  alt: 'Sort icon',
                }}
                $padding={4}
                $color="secondary"
                $height={24}
                $width={24}
              />
            </div>
          </FlexRow>
          <FlexColumn>
            <CommentsColumns />
            {sortedComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </FlexColumn>
        </>
      )}
    </FlexColumn>
  );
}

export default Comments;
