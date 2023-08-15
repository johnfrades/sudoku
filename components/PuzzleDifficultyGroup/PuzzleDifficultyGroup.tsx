import React from 'react';
import { PuzzleDifficulty } from '@/enums/PuzzleDifficulty';
import { capitalize } from 'lodash';
import Button from '@/components/Button';

type PuzzleDifficultyGroupProps = {
  onGenerateRandomSudoku: (difficulty: PuzzleDifficulty) => void;
  setSelectedPuzzle: (puzzle: string) => void;
};
const PuzzleDifficultyGroup: React.FC<PuzzleDifficultyGroupProps> = ({
  onGenerateRandomSudoku,
  setSelectedPuzzle,
}) => {
  return (
    <div className="px-5 sm:px-0">
      <h3 className="text-white text-lg">Generate Random Puzzle</h3>
      <div className="flex gap-4 mt-2 flex-wrap">
        {Object.values(PuzzleDifficulty)
          .filter((x) => typeof x === 'number')
          .map((difficulty) => (
            <Button
              onClick={() => {
                onGenerateRandomSudoku(+difficulty);
                setSelectedPuzzle(capitalize(PuzzleDifficulty[+difficulty]));
              }}
              key={difficulty}
            >
              {capitalize(PuzzleDifficulty[+difficulty])}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default PuzzleDifficultyGroup;
