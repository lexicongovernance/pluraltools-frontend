import { useAppStore } from '../../store';
import IconButton from '../icon-button';
import { Bold } from '../typography/Bold.styled';
import { Card } from './ResultsColumns.styled';

function ResultsColumns() {
  const theme = useAppStore((state) => state.theme);
  return (
    <Card>
      <Bold>Title</Bold>
      <IconButton
        $padding={0}
        $color="secondary"
        icon={{ src: `/icons/heart-full.svg`, alt: 'Hearts' }}
      />
      <IconButton
        $padding={0}
        $color="secondary"
        icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
      />
      <IconButton
        $padding={0}
        $color="secondary"
        icon={{ src: `/icons/sqrt-${theme}.svg`, alt: 'Quadratic score' }}
      />
      <IconButton
        $padding={0}
        $color="secondary"
        icon={{ src: `/icons/money-${theme}.svg`, alt: 'Money' }}
      />
    </Card>
  );
}

export default ResultsColumns;
