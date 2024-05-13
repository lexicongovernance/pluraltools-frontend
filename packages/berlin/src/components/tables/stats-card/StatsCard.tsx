import { Body } from '../../typography/Body.styled';
import { Card } from './StatsCard.styled';

type StatsCardProps = {
  title: string;
  number?: number;
};

function StatsCard({ title, number }: StatsCardProps) {
  return (
    <Card>
      <Body>{title}</Body>
      <Body>{number}</Body>
    </Card>
  );
}

export default StatsCard;
