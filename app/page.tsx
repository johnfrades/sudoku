'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Puzzle } from '@/types/puzzle';
import { Database } from '@/database.types';
import { convertPuzzleString } from '@/utils/convertPuzzleString';
import TableRow from '../components/TableRow';
import TableData from '../components/TableData';
import Spinner from '../components/Spinner';
import Field from '../components/Field';
import NumpadPopup from '../components/NumpadPopup';
import { deepCopy } from '@/utils/deepCopy';
import { getRandomInt } from '@/utils/getRandomInt';
import { SudokuData } from '@/types/sudokuData';
import { get } from 'lodash';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const nineItems = Array.from(Array(9).keys());

export default function Home() {
  const [isPopoverOpen, setIsPopoverOpen] = useState('');
  const [fromServerPuzzle, setFromServerPuzzle] = useState<Puzzle[]>([]);
  const [sudokuData, setSudokuData] = useState<SudokuData[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateTheRowCol = (row: number, col: number, value: string) => {
    const rowToValidate = deepCopy(sudokuData[row]);
    const columnToValidate = deepCopy(sudokuData.map((data) => data[col]));
    const existsInRow = rowToValidate.findIndex((x) => x.value === value);
    const existsInCol = columnToValidate.findIndex((x) => x.value === value);
    const newCopy = deepCopy(sudokuData);

    if (existsInCol >= 0) {
      const rowToBeError = existsInCol >= 0 ? existsInCol : 0;
      newCopy[rowToBeError][col] = {
        ...newCopy[rowToBeError][col],
        hasError: true,
      };
    }
    if (existsInRow >= 0) {
      const colToBeError = existsInRow >= 0 ? existsInRow : 0;
      newCopy[row][colToBeError] = {
        ...newCopy[row][colToBeError],
        hasError: true,
      };
    }

    newCopy[row][col] = {
      ...newCopy[row][col],
      value,
      isDisabled: false,
      hasError: true,
    };

    const allExistingErrors = newCopy.reduce((acc, cur) => {
      const errors = cur.filter((x) => x.hasError);
      if (errors.length > 0) {
        errors.forEach((error) => {
          acc.push(error);
        });
      }

      return acc;
    }, []);

    validateTheExistingErrors(allExistingErrors, newCopy);
    setSudokuData(newCopy);
  };

  const validateTheExistingErrors = (
    dataWithErrors: SudokuData[],
    newCopy: SudokuData[][]
  ) => {
    dataWithErrors.forEach(({ row, col, value }) => {
      const rowToValidate = deepCopy(newCopy[row]);
      rowToValidate[col].value = '.';
      const columnToValidate = deepCopy(newCopy.map((data) => data[col]));
      columnToValidate[row].value = '.';
      const existsInRow = rowToValidate.findIndex((x) => x.value === value);
      const existsInCol = columnToValidate.findIndex((x) => x.value === value);

      if (existsInRow === -1 && existsInCol === -1) {
        newCopy[row][col] = {
          ...newCopy[row][col],
          hasError: false,
        };
      }
    });
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('sudoku_puzzles').select();
      if (!data) {
        console.log('No saved data in database');
        return;
      }
      setIsLoading(false);
      setFromServerPuzzle(data);
      onUsePuzzleData(data[getRandomInt(5)]);
    };

    init();
  }, []);

  const onUsePuzzleData = (data: Puzzle) => {
    const transformedPuzzleData = convertPuzzleString(data.puzzle);
    setSudokuData(deepCopy(transformedPuzzleData));
  };

  const inputValue = useCallback(
    (row: number, col: number) => {
      if (sudokuData?.length === 0) return '';
      if (sudokuData[row][col].value === '.') return '';
      return sudokuData[row][col].value;
    },
    [sudokuData]
  );

  const handlePopoverOpen = useCallback(
    (row: number, col: number, rowIdx: number, colIdx: number) => {
      if (sudokuData?.length === 0) return;
      if (!sudokuData[row][col].isDisabled) {
        setIsPopoverOpen(String(rowIdx) + String(colIdx));
      }
    },
    [sudokuData]
  );

  const onSelectNumber = (
    numString: string,
    rowIdx: number,
    colIdx: number
  ) => {
    setIsPopoverOpen('');
    if (!sudokuData) return;
    validateTheRowCol(rowIdx, colIdx, numString);
  };

  return (
    <div className="grid h-screen place-items-center">
      <div>
        <h1 className="text-4xl font-semibold text-white text-center">
          Sudoku-Mobbin
        </h1>

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
        <div className="mt-10">
          <h3 className="text-white text-xl">Load Puzzles from the Server</h3>
          <div className="flex gap-4 mt-2">
            {isLoading ? (
              <Spinner />
            ) : (
              fromServerPuzzle.map((data, idx) => (
                <button
                  onClick={() => onUsePuzzleData(data)}
                  key={data.id}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  Puzzle {idx + 1}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
