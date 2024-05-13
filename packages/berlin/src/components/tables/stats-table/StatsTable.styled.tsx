import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';

export const Card = styled(Grid)`
  border-bottom: 1px solid var(--color-black);
  padding: 1.5rem;
  grid-template-columns: auto 240px;
`;
