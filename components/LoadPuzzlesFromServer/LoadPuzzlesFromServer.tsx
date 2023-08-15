import React from 'react';
import Spinner from '@/components/Spinner';
import { Puzzle } from '@/types/puzzle';
import Button from '@/components/Button';

type LoadPuzzlesFromServerProps = {
  isLoading: boolean;
  fromServerPuzzle: Puzzle[];
  onUsePuzzleData: (puzzle: Puzzle) => void;
  setSelectedPuzzle: (puzzle: string) => void;
  errorMessage: string;
};

const ErrorMessage: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
  return <p className="text-red-500 font-semibold">{errorMessage}</p>;
};

const LoadPuzzlesFromServer: React.FC<LoadPuzzlesFromServerProps> = ({
  isLoading,
  fromServerPuzzle,
  onUsePuzzleData,
  setSelectedPuzzle,
  errorMessage,
}) => {
  return (
    <div className="px-5 sm:px-0">
      <h3 className="text-white text-lg">Load Puzzles from the Server</h3>
      <div className="flex gap-4 mt-2 flex-wrap">
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {isLoading ? (
          <Spinner />
        ) : (
          fromServerPuzzle.map((data, idx) => (
            <Button
              onClick={() => {
                onUsePuzzleData(data);
                setSelectedPuzzle(`Puzzle ${idx + 1}`);
              }}
              key={data.id}
            >
              Puzzle {idx + 1}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default LoadPuzzlesFromServer;
