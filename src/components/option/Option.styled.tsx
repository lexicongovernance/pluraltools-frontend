import styled from 'styled-components';

export const StyledOption = styled.article`
  background-color: #1f2021;
  border-radius: 1rem;
  padding: 2.5rem;
`;

export const Title = styled.h3`
  min-height: 3rem;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  color: #eee;
  &::first-letter {
    text-transform: capitalize;
  }
`;

export const Body = styled.p`
  color: #ddd;
  font-weight: 400;
  font-size: 1.125rem;
  letter-spacing: 0.35px;
  &::first-letter {
    text-transform: capitalize;
  }
`;
