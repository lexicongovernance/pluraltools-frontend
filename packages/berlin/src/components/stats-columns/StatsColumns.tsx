import { Bold } from '../typography/Bold.styled';
import { Card } from './StatsColumns.styled';

function StatsColumns() {
  return (
    <Card>
      <Bold>Statistic</Bold>
      <Bold>Value</Bold>
    </Card>
  );
}

export default StatsColumns;
