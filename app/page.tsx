'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Puzzle } from '@/types/puzzle';
import { Database } from '@/database.types';
import { convertToSudokuData } from '@/utils/convertToSudokuData';
import { deepCopy } from '@/utils/deepCopy';
import { SudokuData } from '@/types/sudokuData';
import {
  generateSudokuData,
  isSolvedSudoku,
  solve,
} from '@/utils/generateSudokuData';
import { PuzzleDifficulty } from '@/enums/PuzzleDifficulty';
import PuzzleDifficultyGroup from '@/components/PuzzleDifficultyGroup';
import LoadPuzzlesFromServer from '@/components/LoadPuzzlesFromServer';
import SudokuBoard from '@/components/SudokuBoard';
import { flatten } from 'lodash';
import { useSudokuValidation } from '@/app/useSudokuValidation';
import Button from '@/components/Button';
import { convertToPuzzleString } from '@/utils/convertToPuzzleString';

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
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [serverError, setServerError] = useState('');

  const { validateBlockRowAndColumn } = useSudokuValidation(
    sudokuData,
    setSudokuData
  );

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('sudoku_puzzles').select();
      if (error || !data) {
        setServerError(error?.message || 'No saved data in database');
        setIsLoading(false);
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
    const transformedPuzzleData = convertToSudokuData(solvedString);
    setSudokuData(deepCopy(transformedPuzzleData));
  };

  const onUsePuzzleData = (data: Puzzle) => {
    const transformedPuzzleData = convertToSudokuData(data.puzzle);
    setSudokuData(deepCopy(transformedPuzzleData));
  };

  const onSelectNumber = (
    numString: string,
    rowIdx: number,
    colIdx: number
  ) => {
    setIsPopoverOpen('');
    validateBlockRowAndColumn(rowIdx, colIdx, numString);
  };

  useEffect(() => {
    const mappedData = flatten(
      sudokuData.map((x) =>
        x.map((y) => {
          if (isNaN(Number(y.value))) {
            return 0;
          }
          return Number(y.value);
        })
      )
    );
    const solved = isSolvedSudoku(mappedData);
    setPuzzleSolved(solved);
  }, [sudokuData]);

  const onClearSudokuBoard = () => {
    const clearedSudokuData = sudokuData.map((sudokuArray) => {
      return sudokuArray.map((data) => ({
        ...data,
        value: data.isDisabled ? data.value : '.',
        hasError: false,
      }));
    });
    setSudokuData(clearedSudokuData);
  };

  const onSolveSudokuBoard = () => {
    const clearedSudokuData = sudokuData.map((sudokuArray) => {
      return sudokuArray.map((data) => ({
        ...data,
        value: data.isDisabled ? data.value : '.',
        hasError: false,
      }));
    });
    const convertedData = convertToPuzzleString(clearedSudokuData).map(
      (value) => (value === '.' ? 0 : +value)
    );
    const solvedPuzzleString = solve(convertedData).join('');
    const convertedSudokuData = convertToSudokuData(solvedPuzzleString);
    setSudokuData(convertedSudokuData);
  };

  return (
    <div className="grid h-screen place-items-center">
      <div>
        <h1
          data-testid="title"
          className="text-4xl font-semibold text-white text-center"
        >
          Sudoku-Mobbin
        </h1>
        <h6 className="text-center text-amber-100">
          Playing {selectedPuzzle || 'Medium'} Difficulty
        </h6>

        <SudokuBoard
          isPopoverOpen={isPopoverOpen}
          onSelectNumber={onSelectNumber}
          setIsPopoverOpen={setIsPopoverOpen}
          sudokuData={sudokuData}
        />

        {puzzleSolved && (
          <h2 className="my-5 text-3xl font-bold text-green-500 text-center">
            Congratulations for solving this puzzle!
            <br /> Play again
          </h2>
        )}

        <div className="mt-5">
          <PuzzleDifficultyGroup
            setSelectedPuzzle={setSelectedPuzzle}
            onGenerateRandomSudoku={onGenerateRandomSudoku}
          />
        </div>

        <div className="mt-5">
          <LoadPuzzlesFromServer
            errorMessage={serverError}
            setSelectedPuzzle={setSelectedPuzzle}
            isLoading={isLoading}
            fromServerPuzzle={fromServerPuzzle}
            onUsePuzzleData={onUsePuzzleData}
          />
        </div>

        {!puzzleSolved && (
          <div className="mt-5 px-5 sm:px-0">
            <h3 className="text-white text-lg">Options</h3>
            <div className="flex gap-4 mt-2 flex-wrap">
              <Button onClick={onClearSudokuBoard}>Clear Board</Button>
              <Button onClick={onSolveSudokuBoard}>Solve It</Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-white text-xs">
        Created by{' '}
        <a
          href="https://github.com/johnfrades"
          target="_blank"
          className="text-blue-500"
        >
          John Frades
        </a>
      </p>
    </div>
  );
}
