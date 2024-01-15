import { useNavigate } from 'react-router-dom';
import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { Title, Description, ImageContainer, StyledEventCard } from './EventCard.styled';

type EventCardType = {
  eventId: string;
  src: string;
  title: string;
  description: string;
};

function EventCard({ eventId, src, title, description }: EventCardType) {
  const navigate = useNavigate();
  const handleClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <StyledEventCard>
      <ImageContainer>
        <img src={src} alt="Event image" />
      </ImageContainer>
      <FlexColumn className="content" $gap="0.5rem">
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <FlexRow $alignSelf="flex-end">
          <Button color="primary" onClick={() => handleClick(eventId)}>
            Go
          </Button>
        </FlexRow>
      </FlexColumn>
    </StyledEventCard>
  );
}

export default EventCard;
