import { ReactNode } from 'react';

const TableRow: React.FC<{ row: number; children: ReactNode }> = ({
  row,
  children,
}) => (
  <tr
    className={
      (row + 1) % 3 === 0 ? 'border-gray-400 border-b-4 border-solid' : ''
    }
  >
    {' '}
    {children}{' '}
  </tr>
);

export default TableRow;
