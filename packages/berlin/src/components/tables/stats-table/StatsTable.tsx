import { Body } from '../../typography/Body.styled';
import { Card } from './StatsTable.styled';

type StatsTableProps = {
  title: string;
  number?: number;
};

function StatsTable({ title, number }: StatsTableProps) {
  return (
    <Card>
      <Body>{title}</Body>
      <Body>{number}</Body>
    </Card>
  );
}

export default StatsTable;
