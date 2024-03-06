import styled from 'styled-components';

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  table-layout: fixed;
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
