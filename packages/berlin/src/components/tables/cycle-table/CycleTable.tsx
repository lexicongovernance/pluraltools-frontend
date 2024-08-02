import { GetCycleResponse } from 'api';
import Button from '../../button';
import { FlexColumn } from '../../containers/FlexColumn.styled';
import { Body } from '../../typography/Body.styled';
import { Subtitle } from '../../typography/Subtitle.styled';
import { Card } from './CycleTable.styled';
import { useNavigate, useParams } from 'react-router-dom';

type CycleTableProps = {
  cycle: GetCycleResponse;
};

function CycleTable({ cycle }: CycleTableProps) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const eventEndDate = new Date(cycle.endAt);
  const formattedDate = eventEndDate.toLocaleDateString();

  const handleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  const formattedDateText = () => {
    if (cycle.status === 'OPEN') {
      return 'Closes on';
    } else if (cycle.status === 'UPCOMING') {
      return 'Opens on';
    } else {
      return 'Closed on';
    }
  };

  return (
    <Card>
      <FlexColumn $gap="0.5rem">
        <Subtitle>{cycle.questions[0].questionTitle}</Subtitle>
        <Body>
          {formattedDateText()} {formattedDate}
        </Body>
      </FlexColumn>
      <Button onClick={() => handleClick(cycle.id)}>Go to vote</Button>
    </Card>
  );
}

export default CycleTable;
