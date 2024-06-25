import styled from 'styled-components';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';

export const CycleContainer = styled(FlexRowToColumn)`
  border: 1px solid var(--color-black);
  padding: 2rem;
  justify-content: space-between;
  border-radius: 0.5rem;
  cursor: pointer;
`;
