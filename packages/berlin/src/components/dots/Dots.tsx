import { FlexRow } from '../containers/FlexRow.styled';
import { Dot } from './Dots.styled';

type DotsProps = {
  dots: number;
  activeDotIndex: number;
  handleClick: (index: number) => void;
};

function Dots({ dots, activeDotIndex, handleClick }: DotsProps) {
  return (
    <FlexRow>
      {Array.from({ length: dots }).map((_, index) => (
        <Dot key={index} $active={index === activeDotIndex} onClick={() => handleClick(index)} />
      ))}
    </FlexRow>
  );
}

export default Dots;
