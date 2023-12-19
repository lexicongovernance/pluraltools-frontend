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
