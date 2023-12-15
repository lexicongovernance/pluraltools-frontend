import styled from 'styled-components';

export const Main = styled.main`
  margin-inline: auto;
  min-height: calc(100vh - 6rem);
  padding-block: min(15vh, 4rem);
  width: min(90%, 60rem);

  @media (min-width: 600px) {
    padding-block: min(15vh, 7rem);
  }
`;
