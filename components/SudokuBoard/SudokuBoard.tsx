import React, { Dispatch, SetStateAction, useCallback } from 'react';
import TableRow from '@/components/TableRow';
import TableData from '@/components/TableData';
import NumpadPopup from '@/components/NumpadPopup';
import Field from '@/components/Field';
import { get } from 'lodash';
import { SudokuData } from '@/types/sudokuData';

const nineItems = Array.from(Array(9).keys());

type SudokuBoardProps = {
  isPopoverOpen: string;
  onSelectNumber: (numString: string, rowIdx: number, colIdx: number) => void;
  setIsPopoverOpen: Dispatch<SetStateAction<string>>;
  sudokuData: SudokuData[][];
};

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  isPopoverOpen,
  onSelectNumber,
  setIsPopoverOpen,
  sudokuData,
}) => {
  const handlePopoverOpen = useCallback(
    (row: number, col: number, rowIdx: number, colIdx: number) => {
      if (sudokuData?.length === 0) return;
      if (!sudokuData[row][col].isDisabled) {
        setIsPopoverOpen(String(rowIdx) + String(colIdx));
      }
    },
    [setIsPopoverOpen, sudokuData]
  );

  const inputValue = useCallback(
    (row: number, col: number) => {
      if (sudokuData?.length === 0) return '';
      if (sudokuData[row][col].value === '.') return '';
      return sudokuData[row][col].value;
    },
    [sudokuData]
  );

  return (
    <table className="mt-10 border-collapse border-4 border-solid border-gray-400">
      <tbody>
        {nineItems.map((row, rowIndex) => {
          return (
            <TableRow key={rowIndex} row={row}>
              {nineItems.map((col, colIndex) => (
                <TableData key={rowIndex + colIndex} col={col}>
                  <NumpadPopup
                    onSelectNumber={onSelectNumber}
                    colIndex={colIndex}
                    rowIndex={rowIndex}
                    isPopoverOpen={isPopoverOpen}
                    setIsPopoverOpen={setIsPopoverOpen}
                  >
                    <div
                      onClick={() =>
                        handlePopoverOpen(row, col, rowIndex, colIndex)
                      }
                    >
                      <Field
                        hasError={get(
                          sudokuData,
                          `[${row}][${col}].hasError`,
                          false
                        )}
                        value={inputValue(row, col)}
                        disabled={get(
                          sudokuData,
                          `[${row}][${col}].isDisabled`,
                          true
                        )}
                      />
                    </div>
                  </NumpadPopup>
                </TableData>
              ))}
            </TableRow>
          );
        })}
      </tbody>
    </table>
  );
};

export default SudokuBoard;
