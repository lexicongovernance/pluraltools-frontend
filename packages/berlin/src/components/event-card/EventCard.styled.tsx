import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColumn.styled';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';

export const Card = styled(FlexRowToColumn)`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  overflow: hidden;
  width: 100%;
`;

export const ImageContainer = styled.div`
  background-color: var(--color-gray);
  width: 100%;
  height: 300px;

  img {
    height: 100%;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }
`;

export const CardContent = styled(FlexColumn)`
  padding: 2rem;
`;
