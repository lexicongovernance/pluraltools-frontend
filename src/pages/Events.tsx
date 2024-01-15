import EventCard from '../components/eventCard';
import useUser from '../hooks/useUser';
import { FlexColumn, Grid } from '../layout/Layout.styled';

function Events() {
  const { user } = useUser();

  return (
    <FlexColumn $gap="4rem">
      <h2>Welcome, {user?.username}</h2>
      <Grid $columns={2} $gap="2rem">
        <EventCard
          src="/landing-graphic.png"
          title="Berlin"
          description="March 2024"
          eventId="08cfc5ae-00d6-4639-a9d0-41b1b79a0484"
        />
      </Grid>
    </FlexColumn>
  );
}

export default Events;
