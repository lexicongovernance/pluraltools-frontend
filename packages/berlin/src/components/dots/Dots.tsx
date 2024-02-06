import { FlexRow } from '../containers/FlexRow.styled';
import { Dot } from './Dots.styled';

type DotsProps = {
  dots: number;
  activeDotIndex: number;
};

function Dots({ dots, activeDotIndex }: DotsProps) {
  return (
    <FlexRow>
      {Array.from({ length: dots }).map((_, index) => (
        <Dot key={index} $active={index === activeDotIndex} />
      ))}
    </FlexRow>
  );
}

export default Dots;
