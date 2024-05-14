import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';
import { Body } from '../../typography/Body.styled';

export const Card = styled(Grid)`
  border-bottom: 1px solid var(--color-black);
  gap: 0;
  grid-template-columns: repeat(2, 1fr) 82px;
  padding: 1.5rem;
  width: 100%;
`;

export const Group = styled(Body)``;

export const Secret = styled(Body)``;
