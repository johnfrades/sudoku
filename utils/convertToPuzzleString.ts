import { SudokuData } from '@/types/sudokuData';
import { flatten } from 'lodash';

export const convertToPuzzleString = (sudokuData: SudokuData[][]) => {
  return flatten(sudokuData.map((x) => x.map((y) => y.value)));
};
