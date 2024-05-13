import styled from 'styled-components';
import { FlexRow } from '../../containers/FlexRow.styled';

export const Card = styled(FlexRow)`
  border-bottom: 2px solid var(--color-black);
  gap: 0;
  width: 100%;
`;

export const Proposal = styled(FlexRow)`
  flex: 1;
  font-weight: bold;
  min-width: 11rem;
  padding: 1.5rem;
  p {
    cursor: pointer;
  }
`;

export const Author = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    font-weight: bold;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;

    p {
      cursor: pointer;
    }
  }
`;

export const Affiliation = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    font-weight: bold;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;

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

// export const Plurality = styled(FlexRow)`
//   max-width: 5.5rem;
//   padding: 1.5rem;
// `;
