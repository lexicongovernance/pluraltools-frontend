import styled from 'styled-components';
import { Body } from '../typography/Body.styled';

export const Tab = styled(Body)`
  cursor: pointer;
  text-transform: capitalize;

  &.active {
    font-size: 1.25rem;
    font-weight: 600;
    text-decoration: underline;
  }
`;
