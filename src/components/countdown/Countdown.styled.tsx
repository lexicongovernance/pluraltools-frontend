import styled from 'styled-components';
import { StyledChip } from '../chip/Chip.styled';

export const StyledCountdown = styled(StyledChip)`
  align-self: flex-start;
  background-color: #3d4f61;
  font-family: monospace;
  font-size: 1rem;
  text-align: center;

  @media (min-width: 600px) {
    justify-self: flex-end;
  }
`;
