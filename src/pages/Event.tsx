import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import fetchEvent from '../api/fetchEvent';
import fetchEventCycles from '../api/fetchEventCycles';
import Button from '../components/button';
import { FlexColumn, Grid } from '../layout/Layout.styled';
import styled from 'styled-components';
import Chip from '../components/chip';

function Event() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data: event } = useQuery({
    queryKey: ['event'],
    queryFn: () => fetchEvent(eventId || ''),
    enabled: !!eventId,
    staleTime: 10000,
    retry: false,
  });

  const { data: eventCycles } = useQuery({
    queryKey: ['event', 'cycles'],
    queryFn: () => fetchEventCycles(eventId || ''),
    enabled: !!eventId,
    staleTime: 10000,
    retry: false,
  });

  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  const Event = styled.div`
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

  return (
    <FlexColumn $gap="2rem">
      <Event>
        <Grid $columns={2} $rows={1} $rowgap="0">
          <img src="/landing-graphic.png" />
          <Container>
            <FlexColumn>
              <Title>{event?.name}</Title>
              {/* <p>{event?.description}</p> */}
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum doloribus
                perspiciatis corporis vero tempore magnam eligendi, numquam culpa repellat assumenda
                amet ullam placeat suscipit cum?
              </p>
            </FlexColumn>
          </Container>
        </Grid>
      </Event>
      <h2>Cycles</h2>
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
                <Button onClick={() => handleClick(eventCycles.id)}>Go to cycle</Button>
              </FlexColumn>
            </Card>
          );
        })}
      </Grid>
    </FlexColumn>
  );
}

export default Event;
