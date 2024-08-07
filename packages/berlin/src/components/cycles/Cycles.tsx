import { GetCycleResponse } from 'api';
import { Body } from '../typography/Body.styled';
import { useNavigate } from 'react-router-dom';
import { CalendarX2 } from 'lucide-react';
import Button from '../button';

type CyclesProps = {
  cycles: GetCycleResponse[] | undefined;
  eventId: string | undefined;
  fallback: {
    message: string;
    buttonMessage: string;
    buttonOnClick: () => void;
  };
};

function Cycles({ cycles, eventId, fallback }: CyclesProps) {
  const navigate = useNavigate();

  const handleCycleClick = (cycleId: string) => {
    navigate(`/events/${eventId}/cycles/${cycleId}`);
  };

  return (
    <>
      {cycles?.length ? (
        cycles.map((cycle) => (
          <article
            className="border-secondary flex w-full cursor-pointer flex-col gap-4 border p-4"
            key={cycle.id}
            onClick={() => handleCycleClick(cycle.id)}
          >
            <Body>{cycle?.questions[0]?.title}</Body>
          </article>
        ))
      ) : (
        <section className="flex w-full flex-col items-center gap-4 pt-12">
          <CalendarX2 width={64} height={64} />
          <Body>{fallback.message}</Body>
          <Button onClick={fallback.buttonOnClick}>{fallback.buttonMessage}</Button>
        </section>
      )}
    </>
  );
}

export default Cycles;
