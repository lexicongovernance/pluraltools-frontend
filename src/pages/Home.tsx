import { useQuery } from '@tanstack/react-query';
import fetchOptions from '../api/fetchOptions';
import Option from '../components/option';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import useCountdown from '../hooks/useCountdown';
import Countdown from '../components/countdown';
import { useState } from 'react';

interface OptionData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function Home() {
  const { data: options, isLoading } = useQuery({
    queryKey: ['options'],
    queryFn: fetchOptions,
    staleTime: 10000,
    retry: false,
  });

  const initialHearts = 10;
  const [heartsCount, setHeartsCount] = useState(initialHearts);
  const [likedOptionsIds, setLikedOptionsIds] = useState<Set<number>>(new Set());

  // TODO: Get from db.
  const startAt = Math.floor(Date.now() / 1000);
  const duration = 5 * 60;
  const endAt = startAt + duration;
  const { formattedTime } = useCountdown(startAt, endAt);

  const handleVote = (postId: number) => {
    if (!likedOptionsIds.has(postId) && heartsCount > 0) {
      setLikedOptionsIds((prevIds) => new Set<number>(prevIds).add(postId));
      setHeartsCount((prevCount) => prevCount - 1);
    }
  };

  const handleUnvote = (postId: number) => {
    if (likedOptionsIds.has(postId)) {
      setLikedOptionsIds((prevIds) => {
        const newIds = new Set<number>(prevIds);
        newIds.delete(postId);
        return newIds;
      });
      setHeartsCount((prevCount) => Math.min(prevCount + 1, initialHearts));
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FlexColumn $gap="3rem">
      <FlexColumn>
        <Grid $columns={2}>
          <h2>Should Lexicon win the Pluralistic Grant Program?</h2>
          <FlexRow $gap="0.25rem" $wrap $reverse>
            {Array.from({ length: initialHearts }).map((_, id) => (
              <img
                key={id}
                src={id < heartsCount ? '/icons/full_heart.svg' : '/icons/empty_heart.svg'}
                height={32}
                width={32}
                alt={id < heartsCount ? 'Full Heart' : 'Empty Heart'}
              />
            ))}
          </FlexRow>
        </Grid>
        <Countdown formattedTime={formattedTime} />
      </FlexColumn>
      <Grid $columns={2} $gap="2rem">
        {options.map((option: OptionData) => (
          <Option
            key={option.id}
            title={option.title}
            body={option.body}
            onVote={() => handleVote(option.id)}
            onUnvote={() => handleUnvote(option.id)}
          />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Home;
