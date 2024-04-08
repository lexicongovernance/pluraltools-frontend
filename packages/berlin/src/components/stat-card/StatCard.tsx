import { Body } from '../typography/Body.styled';
import { Bold } from '../typography/Bold.styled';
import { Subtitle } from '../typography/Subtitle.styled';
import { Card } from './StatCard.styled';

type StatCardProps = {
  title: string;
  number?: number;
};

function StatCard({ title, number }: StatCardProps) {
  return (
    <Card>
      <Body>
        <Bold>{title}:</Bold>
      </Body>
      <Subtitle>{number}</Subtitle>
    </Card>
  );
}

export default StatCard;
