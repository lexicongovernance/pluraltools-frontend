import styled from 'styled-components';

export const Main = styled.main`
  margin-inline: auto;
  min-height: calc(100vh - 6rem);
  padding-block: min(15vh, 4rem);
  width: min(90%, 1080px);

  @media (min-width: 600px) {
    padding-block: min(15vh, 7rem);
  }
`;

export const Grid = styled.section<{ $columns?: number; $rows?: number; $gap?: string }>`
  display: grid;
  gap: ${(props) => props.$gap || '1rem'};
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(auto, 1fr);

  @media (min-width: 600px) {
    grid-template-columns: ${(props) => props.$columns && `repeat(${props.$columns || 1}, 1fr)`};
    grid-template-rows: ${(props) => props.$rows && `repeat(${props.$rows || 1}, 1fr)`};
  }
`;

export const FlexColumn = styled.section<{ $gap?: string; $justifyContent?: 'space-between' }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap || '1rem'};
  justify-content: ${(props) => props.$justifyContent && props.$justifyContent};
  height: 100%;
`;

export const FlexRow = styled.section<{
  $alignSelf?: 'flex-start' | 'flex-end';
  $gap?: string;
  $justifyContent?: 'space-between';
}>`
  align-self: ${(props) => props.$alignSelf && props.$alignSelf};
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.$gap || '1rem'};
  justify-content: ${(props) => props.$justifyContent && props.$justifyContent};
`;
