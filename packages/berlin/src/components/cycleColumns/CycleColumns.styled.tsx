import styled from 'styled-components';
import { FlexRow } from '../containers/FlexRow.styled';

export const Card = styled(FlexRow)`
  border-radius: 1rem;
  gap: 0;
  width: 100%;
`;

export const Proposal = styled(FlexRow)`
  padding: 1.5rem;
  flex: 1;
  font-weight: bold;
  p {
    cursor: pointer;
  }
`;

export const Author = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    max-width: 10.5rem;
    padding: 1.5rem;
    font-weight: bold;
    p {
      cursor: pointer;
    }
  }
`;

export const Affiliation = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    max-width: 10.5rem;
    padding: 1.5rem;
    font-weight: bold;
    p {
      cursor: pointer;
    }
  }
`;

export const Hearts = styled(FlexRow)`
  gap: 0.5rem;
  max-width: 5rem;
  padding: 1.5rem;
`;

export const Plurality = styled(FlexRow)`
  max-width: 5rem;
  padding: 1.5rem;
`;
