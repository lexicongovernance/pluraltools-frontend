import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';

export const Card = styled(Grid)<{ $showFunding: boolean }>`
  display: none;
  @media (min-width: 600px) {
    border-bottom: 2px solid var(--color-black);
    display: grid;
    grid-template-columns: ${(props) =>
      props.$showFunding ? 'auto repeat(3, 48px) 100px' : 'auto repeat(3, 48px)'};
    padding: 1.5rem;
  }
`;
