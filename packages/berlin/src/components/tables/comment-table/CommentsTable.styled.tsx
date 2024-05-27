import styled from 'styled-components';
import { Body } from '../../typography/Body.styled';
import { Grid } from '../../containers/Grid.styled';

export const Card = styled(Grid)`
  align-items: flex-start;
  border-bottom: 1px solid var(--color-black);
  overflow: hidden;
  padding: 1.5rem;
  width: 100%;
  grid-template-columns: minmax(200px, 600px) minmax(100px, 150px) 56px;

  @media (min-width: 600px) {
    grid-template-columns: minmax(200px, 600px) minmax(100px, 200px) minmax(80px, 100px) 56px;
  }
`;

export const Comment = styled(Body)``;

export const Author = styled(Body)`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FormattedDate = styled(Body)`
  color: #878787;
  display: none;
  font-size: 14px;
  @media (min-width: 600px) {
    display: flex;
  }
`;
