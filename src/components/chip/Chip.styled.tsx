import styled from 'styled-components';

export const StyledChip = styled.div<{ $status?: 'OPEN' | 'CLOSED' | 'RESULTS' | null }>`
  align-content: center;
  align-self: flex-end;
  background-color: lightcoral;
  background-color: ${(props) => props.$status === 'OPEN' && '#62B45A'};
  background-color: ${(props) => props.$status === 'CLOSED' && 'lightcoral'};
  background-color: ${(props) => props.$status === 'RESULTS' && '#FFA800'};
  border-radius: 2rem;
  cursor: default;
  display: flex;
  font-weight: 600;
  justify-content: center;
  padding-block: 0.5rem;
  padding-inline: 1rem;
  user-select: none;
`;
