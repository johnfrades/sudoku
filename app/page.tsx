'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Puzzle } from '@/types/puzzle';
import { Database } from '@/database.types';
import { convertPuzzleString } from '@/utils/convertPuzzleString';
import { deepCopy } from '@/utils/deepCopy';
import { SudokuData } from '@/types/sudokuData';
import { generateSudokuData } from '@/utils/generateSudokuData';
import { PuzzleDifficulty } from '@/enums/PuzzleDifficulty';
import PuzzleDifficultyGroup from '@/components/PuzzleDifficultyGroup';
import LoadPuzzlesFromServer from '@/components/LoadPuzzlesFromServer';
import SudokuBoard from '@/components/SudokuBoard';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [isPopoverOpen, setIsPopoverOpen] = useState('');
  const [fromServerPuzzle, setFromServerPuzzle] = useState<Puzzle[]>([]);
  const [sudokuData, setSudokuData] = useState<SudokuData[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState('');

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
    };
    init();

    onGenerateRandomSudoku(PuzzleDifficulty.MEDIUM);
  }, []);

  const onGenerateRandomSudoku = (puzzleDifficulty: PuzzleDifficulty) => {
    const solvedString = generateSudokuData(puzzleDifficulty);
    const transformedPuzzleData = convertPuzzleString(solvedString);
    setSudokuData(deepCopy(transformedPuzzleData));
  };

  const onUsePuzzleData = (data: Puzzle) => {
    const transformedPuzzleData = convertPuzzleString(data.puzzle);
    setSudokuData(deepCopy(transformedPuzzleData));
  };

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
        <h6 className="text-center text-amber-100">
          Playing {selectedPuzzle || 'Medium'}
        </h6>

        <table className="mt-10 border-collapse border-4 border-solid border-gray-400">
          <tbody>
            <SudokuBoard
              isPopoverOpen={isPopoverOpen}
              onSelectNumber={onSelectNumber}
              setIsPopoverOpen={setIsPopoverOpen}
              sudokuData={sudokuData}
            />
          </tbody>
        </table>

        <div className="mt-10">
          <PuzzleDifficultyGroup
            setSelectedPuzzle={setSelectedPuzzle}
            onGenerateRandomSudoku={onGenerateRandomSudoku}
          />
        </div>

        <div className="mt-10">
          <LoadPuzzlesFromServer
            setSelectedPuzzle={setSelectedPuzzle}
            isLoading={isLoading}
            fromServerPuzzle={fromServerPuzzle}
            onUsePuzzleData={onUsePuzzleData}
          />
        </div>
      </div>
    </div>
  );
}
