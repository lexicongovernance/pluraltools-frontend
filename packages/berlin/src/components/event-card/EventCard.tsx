import { GetEventResponse } from 'api';
import { Subtitle } from '../typography/Subtitle.styled';
import { Body } from '../typography/Body.styled';
import { Card, CardContent, ImageContainer } from './EventCard.styled';
import Link from '../link';

// Third-party libraries
import Markdown from 'react-markdown';

type EventCardProps = {
  event: GetEventResponse;
  onClick?: () => void;
};

function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card className="cursor-pointer" $gap="0" onClick={onClick}>
      <CardContent $gap="1.25rem">
        <Subtitle>{event.name}</Subtitle>
        {event.description && (
          <Markdown
            className="max-w-[100ch] truncate"
            components={{
              a: ({ node, ...props }) => <Link to={props.href ?? ''}>{props.children}</Link>,
              p: ({ node, ...props }) => <Body>{props.children}</Body>,
            }}
          >
            {event.description}
          </Markdown>
        )}
      </CardContent>
      <ImageContainer>
        <img src={event.imageUrl} alt={`${event.name} image`} />
      </ImageContainer>
    </Card>
  );
}

export default EventCard;
