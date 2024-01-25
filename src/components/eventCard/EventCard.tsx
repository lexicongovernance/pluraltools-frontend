import { useNavigate } from 'react-router-dom';
import { FlexColumn, FlexRow } from '../../layout/Layout.styled';
import Button from '../button';
import { Description, ImageContainer, StyledEventCard, Title } from './EventCard.styled';

type EventCardType = {
  $direction?: 'column' | 'row';
  eventId?: string;
  src: string | undefined;
  title?: string;
  description?: string | null;
  buttonText?: string;
};

function EventCard({
  $direction = 'column',
  eventId,
  src,
  title,
  description,
  buttonText,
}: EventCardType) {
  const navigate = useNavigate();
  const handleClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <StyledEventCard $direction={$direction}>
      <ImageContainer $direction={$direction}>
        <img src={src} alt="Event image" />
      </ImageContainer>
      <FlexColumn className="content" $gap="2rem">
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <FlexRow $alignSelf="flex-end">
          {buttonText && eventId && (
            <Button color="primary" onClick={() => handleClick(eventId)}>
              {buttonText}
            </Button>
          )}
        </FlexRow>
      </FlexColumn>
    </StyledEventCard>
  );
}

export default EventCard;
