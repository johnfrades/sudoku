import React from 'react';
import { PuzzleDifficulty } from '@/enums/PuzzleDifficulty';
import { capitalize } from 'lodash';

type PuzzleDifficultyGroupProps = {
  onGenerateRandomSudoku: (difficulty: PuzzleDifficulty) => void;
  setSelectedPuzzle: (puzzle: string) => void;
};
const PuzzleDifficultyGroup: React.FC<PuzzleDifficultyGroupProps> = ({
  onGenerateRandomSudoku,
  setSelectedPuzzle,
}) => {
  return (
    <>
      <h3 className="text-white text-xl">Generate Random Puzzle</h3>
      <div className="flex gap-4 mt-2">
        {Object.values(PuzzleDifficulty)
          .filter((x) => typeof x === 'number')
          .map((difficulty) => (
            <button
              onClick={() => {
                onGenerateRandomSudoku(+difficulty);
                setSelectedPuzzle(capitalize(PuzzleDifficulty[+difficulty]));
              }}
              key={difficulty}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              {capitalize(PuzzleDifficulty[+difficulty])}
            </button>
          ))}
      </div>
    </>
  );
};

export default PuzzleDifficultyGroup;
