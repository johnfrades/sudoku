import { Dispatch, SetStateAction } from 'react';
import { deepCopy } from '@/utils/deepCopy';
import { getBlock } from '@/utils/generateSudokuData';
import { flatten, set, uniq } from 'lodash';
import { SudokuData } from '@/types/sudokuData';
import { CellCandidate } from '@/types/cellCandidate';

const getAllExistingErrors = (newCopy: SudokuData[][]) =>
  newCopy.reduce((acc, cur) => {
    const errors = cur.filter((x) => x.hasError);
    if (errors.length > 0) {
      errors.forEach((error) => {
        acc.push(error);
      });
    }

    return acc;
  }, []);

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

const validateExistingErrorsForRowCol = (
  newCopy: SudokuData[][],
  candidate: CellCandidate,
  allExistingErrors: SudokuData[]
) => {
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

type ValidateTheBlocksProps = {
  newCopy: SudokuData[][];
  cellCandidates: CellCandidate;
  currentBlockOfInputtedValue: number;
  allExistingErrors: SudokuData[];
};

const validateTheBlocks = ({
  newCopy,
  cellCandidates,
  currentBlockOfInputtedValue,
  allExistingErrors,
}: ValidateTheBlocksProps) => {
  const blocksWithError = getTheBlocksByRowCol(allExistingErrors);
  const blocksToCheck = uniq(
    blocksWithError.concat(currentBlockOfInputtedValue)
  );

  blocksToCheck.forEach((block) => {
    const allValuesInTheCurrentBlock = getAllValuesInTheCurrentBlock(
      newCopy,
      block
    );
    const duplicates = getDuplicates(allValuesInTheCurrentBlock);
    duplicates.forEach((duplicate) => {
      const rowColKey = String(duplicate.row) + String(duplicate.col);
      set(cellCandidates, rowColKey, {
        blockError: true,
      });
    });
  });
};

const getTheBlocksByRowCol = (data: SudokuData[]) => {
  const blocks = data.map((sudoku) => {
    const cell = getCellIndexByRowCol(sudoku.row, sudoku.col);
    return getBlock(cell);
  });
  return uniq(blocks);
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

    const cell = getCellIndexByRowCol(rowIdx, colIdx);
    const currentBlock = getBlock(cell);
    newCopy[rowIdx][colIdx].value = value;

    if (value === '.') {
      newCopy[rowIdx][colIdx].hasError = false;
    }

    const allExistingErrors = getAllExistingErrors(newCopy);

    validateTheBlocks({
      newCopy,
      cellCandidates,
      currentBlockOfInputtedValue: currentBlock,
      allExistingErrors,
    });
    validateExistingErrorsForRowCol(newCopy, cellCandidates, allExistingErrors);
    if (value !== '.') {
      validateRowColumnOfNewlyInputtedValue({
        value,
        cellCandidates,
        colIdx,
        rowIdx,
        newCopy,
      });
    }

    setCandidatesErrorStatus(newCopy, cellCandidates);

    setSudokuData(newCopy);
  };

  return { validateBlockRowAndColumn };
};
