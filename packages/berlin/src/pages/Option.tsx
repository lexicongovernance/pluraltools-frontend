import { useQuery } from '@tanstack/react-query';
import fetchOption from 'api/src/fetchOption';
import { useParams } from 'react-router-dom';
import BackButton from '../components/backButton';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { FlexRow } from '../components/containers/FlexRow.styled';
import { Title } from '../components/typography/Title.styled';
import { fetchUserVotes } from 'api';
import useUser from '../hooks/useUser';

function Option() {
  const { user } = useUser();
  const { cycleId, optionId } = useParams();
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const hearts = userVotes?.find((option) => optionId === option.optionId)?.numOfVotes || 0;

  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      <Title>{option?.optionTitle}</Title>
      <FlexRow $gap="0.25rem" $wrap>
        {hearts > 0 ? (
          Array.from({ length: hearts }).map((_, id) => (
            <img key={id} src="/icons/heart-full.svg" height={24} width={24} alt="Full Heart" />
          ))
        ) : (
          <img src="/icons/heart-empty.svg" height={24} width={24} alt="Empty Heart" />
        )}
      </FlexRow>
    </FlexColumn>
  );
}

export default Option;
