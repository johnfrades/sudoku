import { Dispatch, SetStateAction } from 'react';
import { deepCopy } from '@/utils/deepCopy';
import { getBlock } from '@/utils/generateSudokuData';
import { differenceWith, flatten, isEqual, set } from 'lodash';
import { SudokuData } from '@/types/sudokuData';
import { CellCandidate } from '@/types/cellCandidate';

const getCellIndexByRowCol = (row: number, col: number) => {
  return row * 9 + col;
};

const getAllValuesInTheCurrentBlock = (
  sudokuBlock: SudokuData[][],
  currentBlock: number
) => {
  const mappedSudoku = flatten(sudokuBlock.map((x) => x.map((y) => y)));
  let valuesInBlock: SudokuData[] = [];
  for (let i = 0; i <= 8; i++) {
    valuesInBlock.push(
      mappedSudoku[
        Math.floor(currentBlock / 3) * 27 +
          (i % 3) +
          9 * Math.floor(i / 3) +
          3 * (currentBlock % 3)
      ]
    );
  }
  return valuesInBlock.filter((x) => x.value !== '.');
};

const getDuplicates = (data: SudokuData[]) => {
  const duplicates: SudokuData[] = [];
  data.forEach((dat, idx, arr) => {
    const copiedArray = [...arr];
    copiedArray.splice(idx, 1);
    const foundDuplicate = copiedArray.find((x) => x.value === dat.value);
    if (foundDuplicate) {
      duplicates.push(foundDuplicate);
    }
  });
  return duplicates;
};

// Only get the errors in the block that is not caused by duplicated in the block
// This means, they're error by Row Col
const getCurrentErrorsInBlock = (
  data: SudokuData[],
  duplicates: SudokuData[]
): SudokuData[] => {
  const filteredErrors = data.filter((x) => x.hasError);
  if (!filteredErrors) return [];
  return differenceWith(filteredErrors, duplicates, isEqual);
};
const validateValueInRowAndColumn = (
  newCopy: SudokuData[][],
  rowIdx: number,
  colIdx: number,
  value: string
) => {
  const rowToValidate = deepCopy(newCopy[rowIdx]);
  rowToValidate[colIdx].value = '.';
  const columnToValidate = deepCopy(newCopy.map((data) => data[colIdx]));
  columnToValidate[rowIdx].value = '.';
  const existsInRow = rowToValidate.findIndex((x) => x.value === value);
  const existsInCol = columnToValidate.findIndex((x) => x.value === value);
  return { existsInCol, existsInRow };
};

const validateExistingErrors = (
  newCopy: SudokuData[][],
  candidate: CellCandidate
) => {
  const allExistingErrors = newCopy.reduce((acc, cur) => {
    const errors = cur.filter((x) => x.hasError);
    if (errors.length > 0) {
      errors.forEach((error) => {
        acc.push(error);
      });
    }

    return acc;
  }, []);

  allExistingErrors.forEach((fieldError) => {
    const { existsInCol, existsInRow } = validateValueInRowAndColumn(
      newCopy,
      fieldError.row,
      fieldError.col,
      fieldError.value
    );
    const noDuplicateInRowAndColumn = existsInRow === -1 && existsInCol === -1;
    const duplicateInColumn = existsInCol >= 0;
    const duplicateInRow = existsInRow >= 0;

    if (noDuplicateInRowAndColumn) {
      const rowColKey = String(fieldError.row) + String(fieldError.col);
      set(candidate, rowColKey, {
        ...candidate[rowColKey],
        rowColError: false,
      });

      return;
    }

    if (duplicateInColumn) {
      const rowColKey = String(existsInCol) + String(fieldError.col);
      set(candidate, rowColKey, {
        ...candidate[rowColKey],
        rowColError: true,
      });
    }

    if (duplicateInRow) {
      const rowColKey = String(fieldError.row) + String(existsInRow);
      set(candidate, rowColKey, {
        ...candidate[rowColKey],
        rowColError: true,
      });
    }
  });
};

const setBlockError = (
  duplicates: SudokuData[],
  errorsInBlock: SudokuData[],
  candidate: CellCandidate
) => {
  duplicates.forEach((duplicate) => {
    const rowColKey = String(duplicate.row) + String(duplicate.col);
    set(candidate, rowColKey, {
      blockError: true,
    });
  });
  errorsInBlock.forEach((error) => {
    const rowColKey = String(error.row) + String(error.col);
    set(candidate, rowColKey, {
      blockError: false,
    });
  });
};

type ValidateRowColumnOfNewlyInputtedValue = {
  newCopy: SudokuData[][];
  rowIdx: number;
  colIdx: number;
  value: string;
  cellCandidates: CellCandidate;
};
const validateRowColumnOfNewlyInputtedValue = ({
  newCopy,
  rowIdx,
  colIdx,
  value,
  cellCandidates,
}: ValidateRowColumnOfNewlyInputtedValue) => {
  const { existsInCol, existsInRow } = validateValueInRowAndColumn(
    newCopy,
    rowIdx,
    colIdx,
    value
  );

  const duplicateInRowOrColumn = existsInCol >= 0 || existsInRow >= 0;
  const duplicateInColumn = existsInCol >= 0;
  const duplicateInRow = existsInRow >= 0;

  if (duplicateInRowOrColumn) {
    const rowColKey = String(rowIdx) + String(colIdx);
    set(cellCandidates, rowColKey, {
      ...cellCandidates[rowColKey],
      rowColError: true,
    });
  }

  if (duplicateInColumn) {
    const rowColKey = String(existsInCol) + String(colIdx);
    set(cellCandidates, rowColKey, {
      ...cellCandidates[rowColKey],
      rowColError: true,
    });
  }

  if (duplicateInRow) {
    const rowColKey = String(rowIdx) + String(existsInRow);
    set(cellCandidates, rowColKey, {
      ...cellCandidates[rowColKey],
      rowColError: true,
    });
  }
};

const setCandidatesErrorStatus = (
  newCopy: SudokuData[][],
  cellCandidates: CellCandidate
) => {
  for (const rowCol in cellCandidates) {
    const [row, col] = rowCol.split('').map((num) => +num);
    newCopy[row][col] = {
      ...newCopy[row][col],
      hasError:
        cellCandidates[rowCol].blockError || cellCandidates[rowCol].rowColError,
    };
  }
};

export const useSudokuValidation = (
  sudokuData: SudokuData[][],
  setSudokuData: Dispatch<SetStateAction<SudokuData[][]>>
) => {
  const validateBlockRowAndColumn = (
    rowIdx: number,
    colIdx: number,
    value: string
  ) => {
    const newCopy = deepCopy(sudokuData);
    const cellCandidates: CellCandidate = {};

    // Get the block of where you put the number, get all values, if there's duplicate
    // get the duplicate values and mark them blockError `true` and push to cellCandidates array
    // If there's no duplicate, get all current errors in the values, if there's errors
    // mark them blockError `false` and push to cellCandidates array
    const cell = getCellIndexByRowCol(rowIdx, colIdx);
    const currentBlock = getBlock(cell);
    newCopy[rowIdx][colIdx].value = value;

    const allValuesInTheCurrentBlock = getAllValuesInTheCurrentBlock(
      newCopy,
      currentBlock
    );
    const duplicates = getDuplicates(allValuesInTheCurrentBlock);
    const errorsInBlock = getCurrentErrorsInBlock(
      allValuesInTheCurrentBlock,
      duplicates
    );

    setBlockError(duplicates, errorsInBlock, cellCandidates);

    // Get the existing errors, loop through them,
    // validate the column and row, if there's still duplicate, mark them rowColError `true`
    // if none, rowColError `false`
    validateExistingErrors(newCopy, cellCandidates);

    // Validate the row and column of the newly inputed value
    validateRowColumnOfNewlyInputtedValue({
      value,
      cellCandidates,
      colIdx,
      rowIdx,
      newCopy,
    });

    // Now for setting the sudoku data
    // Remove error = rowColError is false and blockError is false
    // Add error = either rowColError or blockError is true
    setCandidatesErrorStatus(newCopy, cellCandidates);

    setSudokuData(newCopy);
  };

  return { validateBlockRowAndColumn };
};
