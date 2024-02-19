import { GetCycleResponse } from 'api';
import Button from '../button';
import { FlexColumn } from '../containers/FlexColum.styled';
import { Body } from '../typography/Body.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import { Card } from './CycleCard.styled';
import { useNavigate, useParams } from 'react-router-dom';

type CycleCardProps = {
  cycle: GetCycleResponse;
};

function CycleCard({ cycle }: CycleCardProps) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const eventEndDate = new Date(cycle.endAt);
  const formattedDate = eventEndDate.toLocaleDateString();

  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  return (
    <Card>
      <FlexColumn $gap="0.5rem">
        <Subtitle>{cycle.forumQuestions[0].questionTitle}</Subtitle>
        <Body>Closes on {formattedDate}</Body>
      </FlexColumn>
      <Button onClick={() => handleClick(cycle.id)}>Go to vote</Button>
    </Card>
  );
}

export default CycleCard;