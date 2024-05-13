import styled from 'styled-components';
import { Grid } from '../containers/Grid.styled';

export const Card = styled(Grid)`
  border-bottom: 2px solid var(--color-black);
  padding: 1.5rem;
  grid-template-columns: auto repeat(3, 48px) 80px;
`;
