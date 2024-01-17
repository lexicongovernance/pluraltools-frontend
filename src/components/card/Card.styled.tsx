import styled from 'styled-components';
import Title from '../typography/Title';

export const StyledCard = styled.article`
  background-color: #1f2021;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
`;

export const Icon = styled.div`
  align-self: center;
  height: 2rem;
  width: 2rem;
`;

export const CardTitle = styled.h3`
  color: #eee;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
  &::first-letter {
    text-transform: capitalize;
  }
  &::after {
    content: ':';
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

export const BigNumber = styled(Title)`
  height: 100%;
  justify-self: flex-end;
`;
