// React and third-party libraries
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

// API
import { fetchEvent } from 'api';

// Store
import { useAppStore } from '../store';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import CommunityCard from '../components/communityCard';
import IconButton from '../components/iconButton';

function Community() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const { data: community } = useQuery({
    queryKey: ['event', communityId],
    queryFn: () => fetchEvent(communityId || ''),
    enabled: !!communityId,
  });

  return (
    <FlexColumn>
      <IconButton
        onClick={() => navigate(-1)}
        $color="secondary"
        icon={{ src: `/icons/arrow-back-${theme}.svg`, alt: 'Trash icon' }}
      />
      {community && <CommunityCard community={community} $direction="row" />}
      <Title>Votes</Title>
    </FlexColumn>
  );
}

export default Community;
