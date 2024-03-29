import styled from 'styled-components';

type FlexProps = {
  $alignItems?: 'center';
  $alignSelf?: 'flex-start' | 'center' | 'flex-end';
  $justifySelf?: 'flex-start' | 'center' | 'flex-end';
  $gap?: string;
  $justifyContent?: 'space-between' | 'flex-end';
  $reverse?: boolean;
  $wrap?: boolean;
};

export const Main = styled.main`
  margin-inline: auto;
  min-height: calc(100vh - 13rem);
  padding-block: min(15vh, 4rem);
  width: min(90%, 1080px);

  @media (min-width: 600px) {
    padding-block: min(15vh, 7rem);
  }
`;

export const Grid = styled.section<{
  $columns?: number;
  $rows?: number;
  $gap?: string;
  $colgap?: string;
  $rowgap?: string;
}>`
  display: grid;
  gap: ${(props) => props.$gap || '1rem'};
  column-gap: ${(props) => props.$colgap || '1rem'};
  row-gap: ${(props) => props.$rowgap || '1rem'};
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(auto, 1fr);

  @media (min-width: 600px) {
    grid-template-columns: ${(props) => props.$columns && `repeat(${props.$columns || 1}, 1fr)`};
    grid-template-rows: ${(props) => props.$rows && `repeat(${props.$rows || 1}, 1fr)`};
  }
`;

export const FlexRow = styled.section<FlexProps>`
  align-items: ${(props) => props.$alignItems && props.$alignItems};
  align-self: ${(props) => props.$alignSelf && props.$alignSelf};
  justify-self: ${(props) => props.$justifySelf && props.$justifySelf};
  display: flex;
  gap: ${(props) => props.$gap || '1rem'};
  justify-content: ${(props) => props.$justifyContent && props.$justifyContent};
  flex-wrap: ${(props) => props.$wrap && 'wrap'};
  flex-direction: ${(props) => props.$reverse && 'row-reverse'};
`;

export const FlexColumn = styled(FlexRow)`
  flex-direction: column;
  /* height: 100%; */
`;

export const MobileColumn = styled(FlexColumn)`
  max-width: 70ch;
  /* background-color: red; */
  margin: 0 auto;
`;
