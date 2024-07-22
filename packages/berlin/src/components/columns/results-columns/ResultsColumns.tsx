import { Heart, Radical } from 'lucide-react';
import { useAppStore } from '../../../store';
import IconButton from '../../icon-button';
import { Bold } from '../../typography/Bold.styled';
import { Card } from './ResultsColumns.styled';

type ResultsColumnsType = {
  $showFunding: boolean;
};

function ResultsColumns({ $showFunding }: ResultsColumnsType) {
  const theme = useAppStore((state) => state.theme);
  return (
    <Card $showFunding={$showFunding}>
      <Bold>Title</Bold>
      <Heart fill="#ff0000" />
      <Radical />
      <IconButton
        $padding={0}
        $color="secondary"
        icon={{ src: `/icons/plurality-score.svg`, alt: 'Plurality score' }}
      />
      {$showFunding && (
        <IconButton
          $padding={0}
          $color="secondary"
          icon={{ src: `/logos/arbitrum-${theme}.svg`, alt: 'Arbitrum' }}
        />
      )}
    </Card>
  );
}

export default ResultsColumns;
