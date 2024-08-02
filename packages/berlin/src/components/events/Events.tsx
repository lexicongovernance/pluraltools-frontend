// React and third-party libraries
import { useNavigate } from 'react-router-dom';

// API
import { GetEventResponse } from 'api';

// Components
import { Body } from '../typography/Body.styled';
import { Subtitle } from '../typography/Subtitle.styled';

type EventsProps = {
  events: GetEventResponse[] | undefined;
  errorMessage: string;
};

export default function Events({ events, errorMessage }: EventsProps) {
  const navigate = useNavigate();

  const handleClick = (eventId: string) => {
    navigate(`/events/${eventId}/cycles`);
  };

  return events?.length ? (
    events.map((event) => {
      return (
        <article
          key={event.id}
          className="border-secondary flex min-w-full cursor-pointer flex-col border"
          onClick={() => handleClick(event.id)}
        >
          <section className="flex flex-col gap-4 p-4">
            <Subtitle>{event.name}</Subtitle>
          </section>
          {event.imageUrl && (
            <section className="h-40 w-full">
              <img
                className="h-full w-full bg-neutral-700 object-cover object-center"
                src={event.imageUrl}
                alt={`${event.name} image`}
              />
            </section>
          )}
        </article>
      );
    })
  ) : (
    <Body>{errorMessage}</Body>
  );
}
