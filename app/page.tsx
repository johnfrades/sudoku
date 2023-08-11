'use client';
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Input from './components/Input';
import { Puzzle } from '@/app/types/puzzle';
import { Database } from '@/database.types';
import { convertPuzzleString } from '@/app/utils/convertPuzzleString';
import TableRow from '@/app/components/TableRow';
import TableData from '@/app/components/TableData';
import Spinner from '@/app/components/Spinner';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const nineItems = Array.from(Array(9).keys());

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default function Home() {
  const [puzzleData, setPuzzleData] = useState<Puzzle[]>([]);
  const [sudokuData, setSudokuData] = useState<string[][] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  // const [age, setAge] = useState(0)
  //
  // const handleChange = (e) => {
  //   const value = e.target.value.replace(/\D/g, '')
  //   setAge(value)
  // }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('sudoku_puzzles').select();
      if (!data) {
        console.log('No saved data in database');
        return;
      }
      setIsLoading(false);
      setPuzzleData(data);
      onUsePuzzleData(data[getRandomInt(5)]);
    };

    init();
  }, []);

  const onUsePuzzleData = (data: Puzzle) => {
    const transformedPuzzleData = convertPuzzleString(data.puzzle);
    setSudokuData(transformedPuzzleData);
  };

  const inputValue = useCallback(
    (row: number, col: number) => {
      if (!sudokuData) return '';
      if (sudokuData[row][col] === '.') return '';
      return sudokuData[row][col];
    },
    [sudokuData]
  );

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
                      <Input
                        value={inputValue(row, col)}
                        disabled={
                          sudokuData ? sudokuData[row][col] !== '.' : false
                        }
                      />
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
              puzzleData.map((data, idx) => (
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
