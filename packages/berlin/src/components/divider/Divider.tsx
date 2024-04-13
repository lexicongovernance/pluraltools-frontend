import { VerticalDivider } from './Divider.styled';

type DividerProps = {
  $height: number;
};

function Divider({ $height }: DividerProps) {
  return <VerticalDivider $height={$height} />;
}

export default Divider;
