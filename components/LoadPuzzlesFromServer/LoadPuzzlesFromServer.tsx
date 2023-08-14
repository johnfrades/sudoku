import React from 'react';
import Spinner from '@/components/Spinner';
import { Puzzle } from '@/types/puzzle';

type LoadPuzzlesFromServerProps = {
  isLoading: boolean;
  fromServerPuzzle: Puzzle[];
  onUsePuzzleData: (puzzle: Puzzle) => void;
  setSelectedPuzzle: (puzzle: string) => void;
};

const LoadPuzzlesFromServer: React.FC<LoadPuzzlesFromServerProps> = ({
  isLoading,
  fromServerPuzzle,
  onUsePuzzleData,
  setSelectedPuzzle,
}) => {
  return (
    <>
      <h3 className="text-white text-xl">Load Puzzles from the Server</h3>
      <div className="flex gap-4 mt-2">
        {isLoading ? (
          <Spinner />
        ) : (
          fromServerPuzzle.map((data, idx) => (
            <button
              onClick={() => {
                onUsePuzzleData(data);
                setSelectedPuzzle(`Puzzle ${idx + 1}`);
              }}
              key={data.id}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              Puzzle {idx + 1}
            </button>
          ))
        )}
      </div>
    </>
  );
};

export default LoadPuzzlesFromServer;
