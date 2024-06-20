import styled from 'styled-components';
import { Body } from '../typography/Body.styled';
import { FlexRow } from '../containers/FlexRow.styled';

export const Tabs = styled(FlexRow)`
  justify-content: flex-start;

  @media (min-width: 600px) {
    justify-content: flex-end;
  }
`;

export const Tab = styled(Body)`
  cursor: pointer;
  text-transform: capitalize;

  &.active {
    font-weight: 600;
    text-decoration: underline;
  }
`;
