import { SudokuData } from '@/types/sudokuData';

export const convertPuzzleString = (puzzleString: string): SudokuData[][] => {
  const splitData = puzzleString.split('');
  const puzzleArr: SudokuData[][] = [];
  let row = 0;

  splitData.forEach((sData, idx) => {
    const isLastCellOnTheRow = idx % 9 === 0;
    if (idx !== 0 && isLastCellOnTheRow) {
      row = row + 1;
    }

    if (!Array.isArray(puzzleArr[row])) {
      puzzleArr.push([]);
    }

    puzzleArr[row].push({
      value: sData,
      hasError: false,
      isDisabled: sData !== '.',
      row: row,
      col: idx % 9,
    });
  });

  return puzzleArr;
};
