import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';

export const Card = styled(FlexColumn)`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
`;

export const ImageContainer = styled.div`
  background-color: var(--color-gray);
  width: 100%;
  height: 300px;
`;

export const CardContent = styled(FlexColumn)`
  padding: 2rem;
`;
