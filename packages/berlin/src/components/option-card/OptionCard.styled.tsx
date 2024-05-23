import styled from 'styled-components';
import { FlexRow } from '../containers/FlexRow.styled';

export const Card = styled(FlexRow)<{ $expanded: boolean }>`
  border-bottom: 1px solid var(--color-black);
  gap: 0;
  width: 100%;

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    padding: 1.5rem;
    padding-top: 0;
  }
`;

export const Proposal = styled(FlexRow)`
  flex: 1;
  min-width: 11rem;
  padding: 1.5rem;
`;

export const Author = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;
  }
`;

export const Affiliation = styled(FlexRow)`
  display: none;
  @media (min-width: 600px) {
    display: flex;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;
  }
`;

export const Votes = styled(FlexRow)`
  gap: 0.5rem;
  max-width: 5rem;
  padding: 1.5rem;
`;

// export const Plurality = styled(FlexRow)`
//   max-width: 5.5rem;
//   padding: 1.5rem;
// `;
