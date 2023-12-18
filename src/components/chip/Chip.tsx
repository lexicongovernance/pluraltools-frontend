import { StyledChip } from './Chip.styled';

type ChipProps = {
  children: React.ReactNode;
};

function Chip({ children }: ChipProps) {
  return <StyledChip>{children}</StyledChip>;
}

export default Chip;
