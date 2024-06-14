import styled from 'styled-components';
import { FlexRow } from '../containers/FlexRow.styled';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';

export const Card = styled.div<{ $expanded: boolean }>`
  border-radius: 0.5rem;
  border: 1px solid var(--color-black);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 0.5rem;
  padding: 2rem;
  width: 100%;

  @media (min-width: 600px) {
    margin: 0;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--color-black);
    flex-direction: row;
    gap: 0;
    padding: 0;
  }

  .description {
    display: ${(props) => (props.$expanded ? 'flex' : 'none')};
    padding: 1.5rem;
    padding-top: 0;
  }
`;

export const Container = styled(FlexRowToColumn)`
  gap: 1rem;
  @media (min-width: 600px) {
    gap: 0;
  }
`;

export const Proposal = styled(FlexRow)`
  @media (min-width: 600px) {
    flex: 1;
    min-width: 11rem;
    padding: 1.5rem;
  }
`;

export const Author = styled(FlexRow)`
  @media (min-width: 600px) {
    display: flex;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;
  }
`;

export const Affiliation = styled(FlexRow)`
  @media (min-width: 600px) {
    display: flex;
    max-width: 10rem;
    min-width: 8rem;
    padding: 1.5rem;
  }
`;

export const Votes = styled(FlexRow)`
  @media (min-width: 600px) {
    gap: 0.5rem;
    max-width: 5rem;
    padding: 1.5rem;
  }
`;

export const Plurality = styled(FlexRow)`
  @media (min-width: 600px) {
    gap: 0.5rem;
    max-width: 5rem;
    padding: 1.5rem;
  }
`;

export const PluralityIcon = styled.div`
  display: block;
  @media (min-width: 600px) {
    display: none;
  }
`;
