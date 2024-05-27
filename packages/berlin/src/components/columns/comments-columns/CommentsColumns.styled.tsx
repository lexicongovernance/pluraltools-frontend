import styled from 'styled-components';
import { Grid } from '../../containers/Grid.styled';
import { Body } from '../../typography/Body.styled';

export const Card = styled(Grid)`
  border-bottom: 2px solid var(--color-black);
  padding: 1.5rem;
  grid-template-columns: minmax(200px, 600px) minmax(100px, 150px) 56px;

  @media (min-width: 600px) {
    grid-template-columns: minmax(200px, 600px) minmax(100px, 200px) minmax(80px, 100px) 56px;
  }
`;

export const Comment = styled(Body)`
  font-weight: bold;
`;

export const Author = styled(Body)`
  font-weight: bold;
`;
export const Time = styled(Body)`
  font-weight: bold;
  display: none;
  @media (min-width: 600px) {
    display: flex;
  }
`;

export const Likes = styled(Body)`
  font-weight: bold;
`;
