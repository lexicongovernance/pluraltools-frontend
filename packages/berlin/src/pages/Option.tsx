// React and third-party libraries
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

// API
import { fetchOption, postVotes, fetchUserVotes } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Utils
import { handleSaveVotes, handleUnvote, handleVote } from '../utils/voting';

// Types
import { ResponseUserVotesType } from '../types/CycleType';

// Store
import { useAppStore } from '../store';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import BackButton from '../components/backButton';
import Button from '../components/button';
import IconButton from '../components/iconButton';

function Option() {
  const theme = useAppStore((state) => state.theme);
  const queryClient = useQueryClient();
  const { cycleId, optionId } = useParams();
  const { user } = useUser();
  const { avaliableHearts, setAvaliableHearts } = useAppStore((state) => state);
  const [localUserVotes, setLocalUserVotes] = useState<
    ResponseUserVotesType | { optionId: string; numOfVotes: number }[]
  >([]);
  const [localOptionHearts, setLocalOptionHearts] = useState(0);

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
      if (body?.errors.length) {
        toast.error(`Failed to save votes, ${body?.errors[0].message}`);
      } else if (body?.data.length) {
        queryClient.invalidateQueries({ queryKey: ['votes', cycleId] });
        // this is to update the plural scores in each option
        queryClient.invalidateQueries({ queryKey: ['cycles', cycleId] });
        toast.success('Votes saved successfully!');
      }
    },
  });

  const handleVoteWrapper = (optionId: string) => {
    setLocalOptionHearts((prevLocalOptionHearts) => prevLocalOptionHearts + 1);
    handleVote(optionId, avaliableHearts, setAvaliableHearts, setLocalUserVotes);
  };

  const handleUnvoteWrapper = (optionId: string) => {
    setLocalOptionHearts((prevLocalOptionHearts) => Math.max(0, prevLocalOptionHearts - 1));
    handleUnvote(optionId, avaliableHearts, setAvaliableHearts, setLocalUserVotes);
  };

  const handleSaveVotesWrapper = () => {
    handleSaveVotes(userVotes, localUserVotes, cycleId, mutateVotes);
  };

  const votesAreDifferent = useMemo(() => {
    if (localUserVotes && userVotes) {
      return (
        localUserVotes[0].numOfVotes !==
        userVotes?.find((vote) => vote.optionId === optionId)?.numOfVotes
      );
    }
  }, [localUserVotes, optionId, userVotes]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      <Title>{option?.optionTitle}</Title>
      <FlexRow $gap="0.25rem" $wrap>
        {localOptionHearts > 0 ? (
          Array.from({ length: localOptionHearts }).map((_, id) => (
            <img key={id} src="/icons/heart-full.svg" height={24} width={24} alt="Full Heart" />
          ))
        ) : (
          <img src="/icons/heart-empty.svg" height={24} width={24} alt="Empty Heart" />
        )}
      </FlexRow>
      <FlexRow>
        <IconButton
          onClick={() => handleUnvoteWrapper(option.id)}
          disabled={localOptionHearts === 0}
          $padding={6}
          $color="secondary"
          icon={{ src: `/icons/unvote-${theme}.svg`, alt: 'Unvote icon' }}
        />
        <IconButton
          onClick={() => handleVoteWrapper(option.id)}
          disabled={avaliableHearts === 0}
          $padding={6}
          $color="primary"
          icon={{ src: `/icons/vote-${theme}.svg`, alt: 'Vote icon' }}
        />
      </FlexRow>
      <Button onClick={handleSaveVotesWrapper} disabled={!votesAreDifferent}>
        Save all votes
      </Button>
    </FlexColumn>
  );
}

export default Option;
