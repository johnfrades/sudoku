import React from 'react';
import Button from '@/components/Button';

type OptionsProps = {
  onClearSudokuBoard: () => void;
  onSolveSudokuBoard: () => void;
};
const Options: React.FC<OptionsProps> = ({
  onClearSudokuBoard,
  onSolveSudokuBoard,
}) => {
  return (
    <div className="px-5 sm:px-0">
      <h3 className="text-white text-lg">Options</h3>
      <div className="flex gap-4 mt-2 flex-wrap">
        <Button onClick={onClearSudokuBoard}>Clear Board</Button>
        <Button onClick={onSolveSudokuBoard}>Solve It</Button>
      </div>
    </div>
  );
};

export default Options;
