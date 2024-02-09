import { FlexRow } from '../containers/FlexRow.styled';
import { Dot } from './Dots.styled';

type DotsProps = {
  dots: number;
  activeDotIndex: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

function Dots({ dots, activeDotIndex, setStep }: DotsProps) {
  return (
    <FlexRow>
      {Array.from({ length: dots }).map((_, index) => (
        <Dot key={index} $active={index === activeDotIndex} onClick={() => setStep(index)} />
      ))}
    </FlexRow>
  );
}

export default Dots;
