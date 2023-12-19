import styled from 'styled-components';

export const StyledOption = styled.article`
  background-color: #1f2021;
  border-radius: 1rem;
  padding: 2.5rem;
`;

export const Title = styled.h3`
  color: #eee;
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
  min-height: 3rem;
  &::first-letter {
    text-transform: capitalize;
  }
`;

export const Body = styled.p`
  color: #ddd;
  font-size: 1.125rem;
  font-weight: 400;
  letter-spacing: 0.35px;
  &::first-letter {
    text-transform: capitalize;
  }
`;
