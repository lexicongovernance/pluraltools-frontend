// React and third-party libraries
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// API
import { fetchEvents } from 'api';

// Hooks
import useUser from '../hooks/useUser';

// Components
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import CommunityCard from '../components/communityCard';

function Communities() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled: !!user?.id,
  });

  const handleClick = (communityId: string) => {
    navigate(`/communities/${communityId}`);
  };

  return (
    <FlexColumn $gap="2rem">
      <Title>Welcome, {user?.username ?? 'User'}</Title>
      {events?.map((community) => {
        return (
          <CommunityCard
            key={community.id}
            community={community}
            onClick={() => handleClick(community.id)}
          />
        );
      })}
    </FlexColumn>
  );
}

export default Communities;
