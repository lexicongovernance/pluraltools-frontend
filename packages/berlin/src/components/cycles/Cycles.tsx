import { GetCycleResponse } from 'api';
import { Body } from '../typography/Body.styled';
import { useNavigate } from 'react-router-dom';

type CyclesProps = {
  cycles: GetCycleResponse[] | undefined;
  errorMessage: string;
  eventId: string | undefined;
};

function Cycles({ cycles, errorMessage, eventId }: CyclesProps) {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    const eventEndDate = new Date(date);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(eventEndDate);
  };

  const handleCycleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  return (
    <>
      {cycles?.length ? (
        cycles.map((cycle) => (
          <div
            className="border-secondary flex w-full flex-col gap-4 border p-4"
            key={cycle.id}
            onClick={() => handleCycleClick(cycle.id)}
          >
            <Body>{cycle.questions[0]?.questionTitle}</Body>
            <Body>{formatDate(cycle.endAt)}</Body>
          </div>
        ))
      ) : (
        <Body>{errorMessage}</Body>
      )}
    </>
  );
}

export default Cycles;
