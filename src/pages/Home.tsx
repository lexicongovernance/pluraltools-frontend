import { useQuery } from '@tanstack/react-query';
import fetchOptions from '../api/fetchOptions';
import Option from '../components/option';
import { FlexColumn, FlexRow, Grid } from '../layout/Layout.styled';
import useCountdown from '../hooks/useCountdown';
import Countdown from '../components/countdown';
import { useState, useEffect } from 'react';

interface OptionData {
  userId: number;
  id: number;
  title: string;
  body: string;
  hearts: number;
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
  const [localOptions, setLocalOptions] = useState<OptionData[]>([]);

  // TODO: connect with backend
  const startAt = Math.floor(Date.now() / 1000);
  const duration = 5 * 60;
  const endAt = startAt + duration;
  const { formattedTime } = useCountdown(startAt, endAt);

  useEffect(() => {
    // Initialize localOptions with the initial options from the server
    setLocalOptions(options || []);
  }, [options]);

  const handleVote = (id: number) => {
    if (heartsCount > 0) {
      setHeartsCount((prevCount) => prevCount - 1);
      // Update the local state of options directly (no server interaction)
      const updatedLocalOptions = localOptions.map((option) =>
        option.id === id ? { ...option, hearts: option.hearts + 1 } : option
      );
      // Set the updated local state
      setLocalOptions(updatedLocalOptions);
    }
  };

  const handleUnvote = (id: number) => {
    const likedOption = localOptions.find((option) => option.id === id && option.hearts > 0);

    if (likedOption && heartsCount < initialHearts) {
      setHeartsCount((prevCount) => Math.min(prevCount + 1, initialHearts));
      // Update the local state of options directly (no server interaction)
      const updatedLocalOptions = localOptions.map((option) =>
        option.id === id ? { ...option, hearts: Math.max(option.hearts - 1, 0) } : option
      );
      // Set the updated local state
      setLocalOptions(updatedLocalOptions);
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
        {localOptions.map((option: OptionData) => (
          <Option
            key={option.id}
            title={option.title}
            body={option.body}
            hearts={option.hearts}
            onVote={() => handleVote(option.id)}
            onUnvote={() => handleUnvote(option.id)}
          />
        ))}
      </Grid>
    </FlexColumn>
  );
}

export default Home;
