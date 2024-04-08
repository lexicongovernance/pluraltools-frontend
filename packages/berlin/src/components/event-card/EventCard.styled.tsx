import styled, { css } from 'styled-components';
import { FlexColumn } from '../containers/FlexColum.styled';

export const Card = styled(FlexColumn)<{ $direction?: 'row' | 'column' }>`
  border-radius: 1rem;
  border: 1px solid var(--color-black);
  flex-direction: column;
  overflow: hidden;
  width: 100%;

  ${(props) =>
    props.$direction === 'row' &&
    css`
      flex-direction: row;
    `}
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
