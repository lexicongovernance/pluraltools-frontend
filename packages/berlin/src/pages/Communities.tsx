import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from 'api';
import CommunityCard from '../components/communityCard';
import { FlexColumn } from '../components/containers/FlexColum.styled';
import { Title } from '../components/typography/Title.styled';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

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
        return <CommunityCard community={community} onClick={() => handleClick(community.id)} />;
      })}
    </FlexColumn>
  );
}

export default Communities;
