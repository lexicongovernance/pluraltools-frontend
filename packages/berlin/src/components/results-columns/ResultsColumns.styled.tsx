import styled from 'styled-components';
import { Grid } from '../containers/Grid.styled';
import { Body } from '../typography/Body.styled';

export const Card = styled(Grid)`
  border-bottom: 2px solid var(--color-black);
  padding: 1.5rem;
  grid-template-columns: auto 112px;
`;

export const Title = styled(Body)`
  font-weight: bold;
`;

export const PluralityScore = styled(Body)`
  font-weight: bold;
`;
