import styled from 'styled-components';
import { Body } from '../../typography/Body.styled';
import { Grid } from '../../containers/Grid.styled';

export const Card = styled(Grid)`
  border-bottom: 2px solid var(--color-black);
  grid-template-columns: repeat(3, 1fr) 82px;
  padding: 1.5rem;
  width: 100%;
`;

export const Group = styled(Body)`
  font-weight: bold;
`;

export const Members = styled(Body)`
  font-weight: bold;
`;

export const Secret = styled(Body)`
  font-weight: bold;
`;

export const Action = styled(Body)`
  font-weight: bold;
`;
