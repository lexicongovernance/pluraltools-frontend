import { GetEventResponse } from 'api';
import { Subtitle } from '../typography/Subtitle.styled';
import { Body } from '../typography/Body.styled';
import { Card, CardContent, ImageContainer } from './EventCard.styled';
import Button from '../button';

type EventCardProps = {
  event: GetEventResponse;
  $direction?: 'row' | 'column';
  onClick?: () => void;
};

function EventCard({ event, $direction = 'column', onClick }: EventCardProps) {
  return (
    <Card $direction={$direction}>
      <ImageContainer>
        <img src={event.imageUrl} alt={event.description || `${event.name} image`} />
      </ImageContainer>
      <CardContent $gap="1.25rem">
        <Subtitle>{event.name}</Subtitle>
        {event.description && <Body>{event.description}</Body>}
        {onClick && <Button onClick={onClick}>Go</Button>}
      </CardContent>
    </Card>
  );
}

export default EventCard;
