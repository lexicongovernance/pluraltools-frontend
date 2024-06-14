import styled from 'styled-components';
import { FlexColumn } from '../containers/FlexColumn.styled';

export const TableContainer = styled.table`
  display: none;
  @media (min-width: 600px) {
    border-collapse: collapse;
    display: table;
    margin-bottom: 2rem;
    table-layout: fixed;
    width: 100%;
  }
`;

export const TableHeader = styled.th`
  text-align: left;
  font-weight: bold;
  border-bottom: 2px solid var(--color-black);
  padding: 1.5rem;
  overflow: hidden;
`;

export const TableCell = styled.td`
  padding: 1.5rem;
  overflow: hidden;
  width: 100%;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-black);
`;

export const Cards = styled(FlexColumn)`
  width: 100%;
  @media (min-width: 600px) {
    display: none;
  }
`;

export const Card = styled.article`
  border-radius: 0.5rem;
  border: 1px solid var(--color-black);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  width: 100%;

  @media (min-width: 600px) {
    display: none;
  }
`;
