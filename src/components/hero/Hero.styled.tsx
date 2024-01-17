import styled from 'styled-components';

export const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;

  @media (min-width: 600px) {
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
    row-gap: 0;

    & div {
      grid-column: 2/3;
      grid-row: 1/3;
    }
  }
`;

export const Body = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
`;

export const ImageContainer = styled.div`
  height: 100%;
  /* background-color: red; */

  & img {
    height: 100%;
    object-fit: contain;
    /* width: 100%; */
  }
`;
