import { ReactNode } from 'react';

const TableData: React.FC<{
  col: number;
  children: ReactNode;
}> = ({ col, children }) => (
  <td
    className={
      (col + 1) % 3 === 0 ? 'border-gray-400 border-r-4 border-solid' : ''
    }
  >
    {children}
  </td>
);

export default TableData;
