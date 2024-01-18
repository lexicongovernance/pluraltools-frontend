import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import fetchEvent from '../api/fetchEvent';
import fetchEventCycles from '../api/fetchEventCycles';
import Button from '../components/button';
import { FlexColumn, Grid } from '../layout/Layout.styled';
import styled from 'styled-components';
import Chip from '../components/chip';
import { useEffect } from 'react';
import { fetchRegistration } from '../api';

const StyledEvent = styled.div`
  background-color: #1f2021;
  border-radius: 1rem;
`;

const Container = styled.div`
  padding: 2rem;
`;

const Card = styled.article`
  background-color: #1f2021;
  border-radius: 1rem;
  padding: 2rem;
`;

const Title = styled.h2`
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1.25rem;
  line-height: 1.75rem;
  /* min-height: 3.5rem; */
`;

const ImageContainer = styled.div`
  background-color: #404040;
  border-radius: 1rem;
  max-height: 340px;
  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }
`;

const BackArrow = styled.div`
  cursor: pointer;
  height: 1.75rem;
  width: 1.75rem;
`;

const images: Record<string, string> = {
  'Berlin Research Community': '/berlin.png',
  'Zuzalu Agenda Setting': '/taipei.png',
  'Full Node Meetup': '/landing-graphic.png',
};

function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const imagePicker = (name: string) => {
    return images[name] ?? '/landing-graphic.png';
  };

  const { data: event } = useQuery({
    queryKey: ['events', eventId],
    queryFn: () => fetchEvent(eventId || ''),
    enabled: !!eventId,
  });

  const { data: eventCycles } = useQuery({
    queryKey: ['events', eventId, 'cycles'],
    queryFn: () => fetchEventCycles(eventId || ''),
    enabled: !!eventId,
  });

  const { data: registration } = useQuery({
    queryKey: ['events', eventId, 'registration'],
    queryFn: () => fetchRegistration(eventId || ''),
    enabled: !!eventId,
  });

  useEffect(() => {
    if (registration === null) {
      navigate(`/events/${eventId}/register`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, registration]);

  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  return (
    <FlexColumn $gap="2rem">
      <BackArrow onClick={handleGoBack}>
        <img src="/icons/back_arrow.svg" alt="Back arrow" />
      </BackArrow>
      <StyledEvent>
        <Grid $columns={2} $rows={1} $rowgap="0">
          <ImageContainer>
            <img src={imagePicker(event?.name || '')} alt="Event image" />
          </ImageContainer>
          <Container>
            <FlexColumn>
              <Title>{event?.name}</Title>
              <p>{event?.description}</p>
            </FlexColumn>
          </Container>
        </Grid>
      </StyledEvent>
      <h2>Votes</h2>
      {eventCycles && eventCycles?.length > 0 ? (
        <Grid $columns={3}>
          {eventCycles?.map((eventCycles) => {
            const { title } = eventCycles.forumQuestions[0];
            const eventEndDate = new Date(eventCycles.endAt);
            const formattedDate = eventEndDate.toLocaleDateString();

            return (
              <Card key={eventCycles.id}>
                <FlexColumn $gap="1.5rem">
                  <Chip status={eventCycles.status}>{eventCycles.status}</Chip>
                  <FlexColumn $gap="0.5rem">
                    <h3>{title}</h3>
                    <p>Closes on {formattedDate}</p>
                  </FlexColumn>
                  <Button onClick={() => handleClick(eventCycles.id)}>Go to vote</Button>
                </FlexColumn>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <p>No cycles found</p>
      )}
    </FlexColumn>
  );
}

export default Event;
