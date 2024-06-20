import { GetCycleResponse } from 'api';
import { Body } from '../typography/Body.styled';
import { CycleContainer } from './Cycles.styled';

type CyclesProps = {
  cycles: GetCycleResponse[] | undefined;
  errorMessage: string;
};

function Cycles({ cycles, errorMessage }: CyclesProps) {
  const formatDate = (date: string) => {
    const eventEndDate = new Date(date);
    return eventEndDate.toLocaleDateString();
  };

  return (
    <>
      {cycles?.length ? (
        cycles.map((cycle) => (
          <CycleContainer key={cycle.id}>
            <Body>{cycle.forumQuestions[0]?.questionTitle}</Body>
            <Body>{formatDate(cycle.endAt)}</Body>
          </CycleContainer>
        ))
      ) : (
        <Body>{errorMessage}</Body>
      )}
    </>
  );
}

export default Cycles;
