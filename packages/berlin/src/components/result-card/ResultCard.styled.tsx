import styled from 'styled-components';
import { Grid } from '../containers/Grid.styled';

export const Card = styled(Grid)<{ $expanded: boolean }>`
  cursor: pointer;
  border-bottom: 1px solid var(--color-black);
  grid-template-columns: auto repeat(3, 48px) 80px;
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
  transition: height 0.3s ease-in-out;
  width: 100%;

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    grid-column: 1/6;
  }
`;
