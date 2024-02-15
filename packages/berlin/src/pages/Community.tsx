// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// API
import { fetchEvent, fetchEventCycles } from 'api';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import CommunityCard from '../components/communityCard';
import CycleCard from '../components/cycleCard';
import { Grid } from '../components/containers/Grid.styled';
import BackButton from '../components/backButton';

function Community() {
  const { communityId } = useParams();
  const { data: community } = useQuery({
    queryKey: ['event', communityId],
    queryFn: () => fetchEvent(communityId || ''),
    enabled: !!communityId,
  });
  const { data: communityCycles } = useQuery({
    queryKey: ['events', communityId, 'cycles'],
    queryFn: () => fetchEventCycles(communityId || ''),
    enabled: !!communityId,
  });

  console.log('communityCycles:', communityCycles);
  return (
    <FlexColumn $gap="2rem">
      <BackButton />
      {community && <CommunityCard community={community} $direction="row" />}
      <Title>Votes</Title>
      {communityCycles && (
        <Grid>
          {communityCycles.map((cycle) => (
            <CycleCard key={cycle.id} cycle={cycle} communityId={communityId} />
          ))}
        </Grid>
      )}
    </FlexColumn>
  );
}

export default Community;
