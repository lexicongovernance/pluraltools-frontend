import styled from 'styled-components';

export const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 1rem;

  @media (min-width: 600px) {
    column-gap: 1rem;
    grid-template-columns: 1fr 1fr;
    row-gap: 0;

    & img {
      grid-column: 2/3;
      grid-row: 1/3;
    }
  }
`;

export const FlexColumn1 = styled.section.attrs<{ $gap?: string }>(() => ({}))`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap || '1rem'};
`;

export const FlexColumn = styled.section<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$gap || '1rem'};
`;

export const FlexRow = styled.section<{
  $alignSelf?: 'flex-start' | 'flex-end' | 'center';
  $gap?: string;
}>`
  align-self: ${(props) => (props.$alignSelf ? props.$alignSelf : 'flex-start')};
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.$gap || '1rem'};
`;
