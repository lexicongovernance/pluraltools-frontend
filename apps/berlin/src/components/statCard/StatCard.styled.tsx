import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';

export const Card = styled(FlexColumn)`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  color: var(--color-white);
  overflow: hidden;
  padding: 2rem;
  width: 100%;
`;
