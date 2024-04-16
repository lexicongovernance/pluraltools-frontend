import styled from 'styled-components';

type GridProps = {
  $columns?: number;
  $rows?: number;
  $gap?: string;
  $colgap?: string;
  $rowgap?: string;
};

export const Grid = styled.section<GridProps>`
  display: grid;
  gap: ${(props) => props.$gap || '1rem'};
  column-gap: ${(props) => props.$colgap || '1rem'};
  row-gap: ${(props) => props.$rowgap || '1rem'};
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(auto, 1fr);
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: ${(props) => props.$columns && `repeat(${props.$columns || 1}, 1fr)`};
    grid-template-rows: ${(props) => props.$rows && `repeat(${props.$rows || 1}, 1fr)`};
  }
`;
