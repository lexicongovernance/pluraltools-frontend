import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';

export const Card = styled(Grid)<{ $expanded: boolean; $showFunding: boolean }>`
  border-bottom: 1px solid var(--color-black);
  cursor: pointer;
  grid-template-columns: ${(props) =>
    props.$showFunding ? 'auto repeat(3, 48px) 100px' : 'auto repeat(3, 48px)'};
  overflow: hidden;
  padding: 1.5rem;
  position: relative;
  transition: height 0.3s ease-in-out;
  width: 100%;

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    grid-column: ${(props) => (props.$showFunding ? '1/6' : '1/5')};
  }
`;
