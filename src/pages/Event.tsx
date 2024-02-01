import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchRegistration } from '../api';
import fetchEvent from '../api/fetchEvent';
import fetchEventCycles from '../api/fetchEventCycles';
import Button from '../components/button';
import Chip from '../components/chip';
import EventCard from '../components/eventCard';
import Subtext from '../components/typography/Subtext';
import Subtitle from '../components/typography/Subtitle';
import Title from '../components/typography/Title';
import { FlexColumn, Grid } from '../layout/Layout.styled';

const Card = styled.article`
  background-color: var(--color-dark-gray);
  border-radius: 1rem;
  padding: 2rem;
`;

const BackArrow = styled.div`
  cursor: pointer;
  height: 1.75rem;
  width: 1.75rem;
`;

function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
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
      <EventCard
        $direction="row"
        src={event?.imageUrl}
        title={event?.name}
        description={event?.description}
      />
      <FlexColumn>
        <Title>Votes</Title>
        {eventCycles && eventCycles?.length > 0 ? (
          <Grid $columns={3}>
            {eventCycles?.map((eventCycles) => {
              const { questionTitle } = eventCycles.forumQuestions[0];
              const eventEndDate = new Date(eventCycles.endAt);
              const formattedDate = eventEndDate.toLocaleDateString();

              return (
                <Card key={eventCycles.id}>
                  <FlexColumn $gap="1.5rem">
                    <Chip status={eventCycles.status}>{eventCycles.status}</Chip>
                    <FlexColumn $gap="0.5rem">
                      <Subtitle>{questionTitle}</Subtitle>
                      <Subtext>Closes on {formattedDate}</Subtext>
                    </FlexColumn>
                    <Button onClick={() => handleClick(eventCycles.id)}>Go to vote</Button>
                  </FlexColumn>
                </Card>
              );
            })}
          </Grid>
        ) : (
          <Subtext>No cycles found</Subtext>
        )}
      </FlexColumn>
    </FlexColumn>
  );
}

export default Event;
