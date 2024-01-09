import styled from 'styled-components';

export const StyledOption = styled.article`
  background-color: #1f2021;
  border-radius: 0.75rem;
  padding: 2.5rem;
  /* min-height: 500px; */
`;

export const Title = styled.h3`
  color: #eee;
  font-family: 'Press Start 2P', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;

  &::first-letter {
    text-transform: capitalize;
  }

  @media (min-width: 600px) {
    /* min-height: 4rem; */
  }
`;

export const Body = styled.p`
  color: #ddd;
  font-size: 1.125rem;
  line-height: 1.75rem;

  &::first-letter {
    text-transform: capitalize;
  }
`;
