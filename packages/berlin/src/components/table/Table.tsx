import { Body } from '../typography/Body.styled';
import { TableContainer, TableCell, TableHeader, TableRow } from './Table.styled';

function Table({ columns, rows }: { columns: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <TableContainer>
      <thead>
        <TableRow>
          {columns.map((column) => (
            <TableHeader key={column}>
              <Body>{column}</Body>
            </TableHeader>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index}>
            {row.map((data, index) => (
              <TableCell key={index}>
                <Body>{data}</Body>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </TableContainer>
  );
}

export default Table;
