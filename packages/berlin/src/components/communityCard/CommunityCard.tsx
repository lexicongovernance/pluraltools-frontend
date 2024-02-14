import { GetEventResponse } from 'api';
import { Subtitle } from '../typography/Subtitle.styled';
import { Body } from '../typography/Body.styled';
import { Card, CardContent, ImageContainer } from './CommunityCard.styled';
import Button from '../button';

type CommunityCardProps = {
  community: GetEventResponse;
  onClick?: () => void;
};

function CommunityCard({ community, onClick }: CommunityCardProps) {
  return (
    <Card>
      <ImageContainer>
        <img src={community.imageUrl} alt={community.description || `${community.name} image`} />
      </ImageContainer>
      <CardContent $gap="1.25rem">
        <Subtitle>{community.name}</Subtitle>
        {community.description && <Body>{community.description}</Body>}
        {onClick && <Button onClick={onClick}>Go</Button>}
      </CardContent>
    </Card>
  );
}

export default CommunityCard;
