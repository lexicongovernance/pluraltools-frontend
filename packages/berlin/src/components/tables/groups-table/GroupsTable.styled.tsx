import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';
import { Body } from '../../typography/Body.styled';
import { FlexColumn } from '../../containers/FlexColumn.styled';

export const Card = styled(Grid)<{ $expanded: boolean }>`
  border-bottom: 1px solid var(--color-black);
  grid-template-columns: repeat(3, 1fr) 82px;
  padding: 1.5rem;
  width: 100%;

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    grid-column: 1/4;
    padding: 1.5rem 0;
  }
`;

export const Group = styled(Body)``;

export const Secret = styled(Body)``;

export const GroupProposal = styled(FlexColumn)`
  border-bottom: 1px solid var(--color-gray);
  padding-bottom: 1.5rem;
  width: 100%;
`;
