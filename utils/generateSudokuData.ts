import { PuzzleDifficulty } from '@/enums/PuzzleDifficulty';

export const generateSudokuData = (
  puzzleDifficulty: PuzzleDifficulty
): string => {
  const emptySudoku = Array.from(Array(81).keys()).map(() => 0);
  const solvedSudoku = solve(emptySudoku);
  const puzzleString = solvedSudoku.map((x) => String(x)).join('');
  return digHoleInBoard(puzzleString, puzzleDifficulty);
};

const generateHoles = (maxNumber: number, size: number) => {
  const randomNumber = () => Math.floor(Math.random() * maxNumber);
  let current: number;
  const arr: number[] = [];

  while (arr.length < size) {
    if (arr.indexOf((current = randomNumber())) === -1) {
      arr.push(current);
    }
  }
  return arr;
};

const digHoleInBoard = (puzzleString: string, difficulty: PuzzleDifficulty) => {
  const holesIndexes = generateHoles(81, difficulty);
  const splittedPuzzle = puzzleString.split('');
  holesIndexes.forEach((holeIdx) => {
    splittedPuzzle[holeIdx] = '.';
  });
  return splittedPuzzle.join('');
};

// given a sudoku cell, returns the row
function getRow(cell: number) {
  return Math.floor(cell / 9);
}

// given a sudoku cell, returns the column
function getColumn(cell: number) {
  return cell % 9;
}

// given a sudoku cell, returns the 3x3 block
function getBlock(cell: number) {
  return Math.floor(getRow(cell) / 3) * 3 + Math.floor(getColumn(cell) / 3);
}

// given a number, a row and a sudoku, returns true if the number can be placed in the row
function isPossibleRow(number: number, row: number, sudoku: number[]): boolean {
  for (let i = 0; i <= 8; i++) {
    if (sudoku[row * 9 + i] == number) {
      return false;
    }
  }
  return true;
}

// given a number, a column and a sudoku, returns true if the number can be placed in the column
function isPossibleCol(number: number, col: number, sudoku: number[]): boolean {
  for (let i = 0; i <= 8; i++) {
    if (sudoku[col + 9 * i] == number) {
      return false;
    }
  }
  return true;
}

// given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
function isPossibleBlock(
  number: number,
  block: number,
  sudoku: number[]
): boolean {
  for (let i = 0; i <= 8; i++) {
    if (
      sudoku[
        Math.floor(block / 3) * 27 +
          (i % 3) +
          9 * Math.floor(i / 3) +
          3 * (block % 3)
      ] == number
    ) {
      return false;
    }
  }
  return true;
}

// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
function isPossibleNumber(
  cell: number,
  number: number,
  sudoku: number[]
): boolean {
  const row = getRow(cell);
  const col = getColumn(cell);
  const block = getBlock(cell);
  return (
    isPossibleRow(number, row, sudoku) &&
    isPossibleCol(number, col, sudoku) &&
    isPossibleBlock(number, block, sudoku)
  );
}

// given a row and a sudoku, returns true if it's a legal row
function isCorrectRow(row: number, sudoku: number[]): boolean {
  const rightSequence = Array.from(Array(9).keys()).map((x) => x + 1);
  const rowTemp = [];
  for (let i = 0; i <= 8; i++) {
    rowTemp[i] = sudoku[row * 9 + i];
  }
  rowTemp.sort();
  return rowTemp.join() == rightSequence.join();
}

// given a column and a sudoku, returns true if it's a legal column
function isCorrectCol(col: number, sudoku: number[]) {
  const rightSequence = Array.from(Array(9).keys()).map((x) => x + 1);
  const colTemp = new Array();
  for (let i = 0; i <= 8; i++) {
    colTemp[i] = sudoku[col + i * 9];
  }
  colTemp.sort();
  return colTemp.join() == rightSequence.join();
}

// given a 3x3 block and a sudoku, returns true if it's a legal block
function isCorrectBlock(block: number, sudoku: number[]) {
  const rightSequence = Array.from(Array(9).keys()).map((x) => x + 1);
  const blockTemp: number[] = [];
  for (let i = 0; i <= 8; i++) {
    blockTemp[i] =
      sudoku[
        Math.floor(block / 3) * 27 +
          (i % 3) +
          9 * Math.floor(i / 3) +
          3 * (block % 3)
      ];
  }
  blockTemp.sort();
  return blockTemp.join() === rightSequence.join();
}

// given a sudoku, returns true if the sudoku is solved
export function isSolvedSudoku(sudoku: number[]) {
  for (let i = 0; i <= 8; i++) {
    if (
      !isCorrectBlock(i, sudoku) ||
      !isCorrectRow(i, sudoku) ||
      !isCorrectCol(i, sudoku)
    ) {
      return false;
    }
  }
  return true;
}

// given a cell and a sudoku, returns an array with all possible values we can write in the cell
function determinePossibleValues(cell: number, sudoku: number[]): number[] {
  const possible: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (isPossibleNumber(cell, i, sudoku)) {
      possible.unshift(i);
    }
  }
  return possible;
}

// given an array of possible values assignable to a cell, returns a random value picked from the array
function determineRandomPossibleValue(
  possible: number[][],
  cell: number
): number {
  const randomPicked = Math.floor(Math.random() * possible[cell].length);
  return possible[cell][randomPicked];
}

// given a sudoku, returns a two dimension array with all possible values
function scanSudokuForUnique(sudoku: number[]): false | number[][] {
  const possible: number[][] = [];
  for (let i = 0; i <= 80; i++) {
    if (sudoku[i] === 0) {
      possible[i] = [];
      possible[i] = determinePossibleValues(i, sudoku);
      if (possible[i].length === 0) {
        return false;
      }
    }
  }
  return possible;
}

// given an array and a number, removes the number from the array
function removeAttempt(attemptArray: number[], number: number): number[] {
  const newArray: number[] = [];
  for (let i = 0; i < attemptArray.length; i++) {
    if (attemptArray[i] != number) {
      newArray.unshift(attemptArray[i]);
    }
  }
  return newArray;
}

// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
function nextRandom(possible: number[][]): number {
  let max = 9;
  let minChoices = 0;
  for (let i = 0; i <= 80; i++) {
    if (possible[i] != undefined) {
      if (possible[i].length <= max && possible[i].length > 0) {
        max = possible[i].length;
        minChoices = i;
      }
    }
  }
  return minChoices;
}

// given a sudoku, solves it
function solve(sudoku: number[]) {
  const saved: number[][] = [];
  const savedSudoku: number[] = [];
  let copiedSudoku = [...sudoku];
  let i = 0;
  let nextMove: number[][] | boolean | number;
  let whatToTry: number;
  let attempt;
  while (!isSolvedSudoku(copiedSudoku)) {
    i++;
    nextMove = scanSudokuForUnique(copiedSudoku);
    if (nextMove == false) {
      nextMove = saved.pop() as unknown as number[][];
      copiedSudoku = savedSudoku.pop() as unknown as number[];
    }
    whatToTry = nextRandom(nextMove as number[][]);
    attempt = determineRandomPossibleValue(nextMove as number[][], whatToTry);
    if (nextMove[whatToTry].length > 1) {
      nextMove[whatToTry] = removeAttempt(nextMove[whatToTry], attempt);
      saved.push(nextMove.slice() as unknown as number[]);
      savedSudoku.push(copiedSudoku.slice() as unknown as number);
    }
    copiedSudoku[whatToTry] = attempt;
  }

  return copiedSudoku;
}
