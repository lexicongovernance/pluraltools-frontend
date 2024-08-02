import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColumn.styled';

export const Card = styled(FlexColumn)`
  border: 1px solid var(--color-black);
  overflow: hidden;
  width: 100%;
`;

export const ImageContainer = styled.div`
  background-color: var(--color-gray);
  width: 100%;
  height: 160px;

  img {
    height: 100%;
    object-fit: cover;
    object-position: center;
    width: 100%;
  }
`;

export const CardContent = styled(FlexColumn)`
  padding: 2rem;
  max-height: 170px;
`;
