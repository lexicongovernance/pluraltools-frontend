import { GetEventResponse } from 'api';
import { Subtitle } from '../typography/Subtitle.styled';
import { Body } from '../typography/Body.styled';
import { Card, CardContent, ImageContainer } from './EventCard.styled';
import Button from '../button';
import Link from '../link';

// Third-party libraries
import Markdown from 'react-markdown';

type EventCardProps = {
  event: GetEventResponse;
  $direction?: 'row' | 'column';
  onClick?: () => void;
};

function EventCard({ event, $direction = 'column', onClick }: EventCardProps) {
  return (
    <Card $direction={$direction}>
      <ImageContainer>
        <img src={event.imageUrl} alt={`${event.name} image`} />
      </ImageContainer>
      <CardContent $gap="1.25rem">
        <Subtitle>{event.name}</Subtitle>
        {event.description && (
          <Markdown
            components={{
              a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
              p: ({ node, ...props }) => <Body>{props.children}</Body>,
            }}
          >
            {event.description}
          </Markdown>
        )}
        {onClick && <Button onClick={onClick}>Go</Button>}
      </CardContent>
    </Card>
  );
}

export default EventCard;
