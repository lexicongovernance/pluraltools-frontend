import { GetCycleResponse } from 'api';
import { Body } from '../typography/Body.styled';

type CyclesProps = {
  cycles: GetCycleResponse[] | undefined;
  errorMessage: string;
};

function Cycles({ cycles, errorMessage }: CyclesProps) {
  const formatDate = (date: string) => {
    const eventEndDate = new Date(date);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(eventEndDate);
  };

  return (
    <>
      {cycles?.length ? (
        cycles.map((cycle) => (
          <div className='flex flex-col border-secondary w-full p-4 gap-4' key={cycle.id}>
            <Body>{cycle.forumQuestions[0]?.questionTitle}</Body>
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
