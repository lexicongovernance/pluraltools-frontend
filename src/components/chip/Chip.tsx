import { StyledChip } from './Chip.styled';

type ChipProps = {
  children: React.ReactNode;
  status?: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
};

function Chip({ children, status }: ChipProps) {
  return <StyledChip $status={status}>{children}</StyledChip>;
}

export default Chip;
