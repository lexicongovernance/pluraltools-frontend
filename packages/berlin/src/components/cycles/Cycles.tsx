import { GetCycleResponse } from 'api';
import { Body } from '../typography/Body.styled';
import { useNavigate } from 'react-router-dom';
import { CalendarX2 } from 'lucide-react';
import Button from '../button';

type CyclesProps = {
  cycles: GetCycleResponse[] | undefined;
  errorMessage: string;
  eventId: string | undefined;
  tab: string;
  setActiveTab: (tab: string) => void;
};

function Cycles({ cycles, errorMessage, eventId, tab, setActiveTab }: CyclesProps) {
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
          <article
            className="border-secondary flex w-full cursor-pointer flex-col gap-4 border p-4"
            key={cycle.id}
            onClick={() => handleCycleClick(cycle.id)}
          >
            <Body>{cycle?.questions[0]?.title}</Body>
            <Body>{formatDate(cycle.endAt)}</Body>
          </article>
        ))
      ) : (
        <section className="flex w-full flex-col items-center gap-4 pt-12">
          <CalendarX2 width={64} height={64} />
          <Body>{errorMessage}</Body>
          <Button onClick={() => setActiveTab(tab)}>{tab} questions</Button>
        </section>
      )}
    </>
  );
}

export default Cycles;
