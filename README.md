This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Sudoku Features

- Generate Random Puzzle
- Instant highlighting of errors
- 5 difficulties (Baby, Easy, Medium, Hard, Expert)
- Load puzzles from the Supabase
- Solve the current Sudoku Board
- Clear the current board


### Difficulties
Difficulty represents the number of empty fields 
    
    Baby = 20
    Easy = 30
    Medium = 40
    Hard = 50
    Expert = 60

### Puzzle data

This is the raw puzzle data, `81` in characters length

    "52...6.........7.13...........4..8..6......5...........418.........3..2...87....."

That will be converted to a 2D Array

```
[
    [
        {
            value: "5",
            hasError: false,
            isDisabled: true,
            row: 0,
            col: 0
        },
        {
            value: "2",
            hasError: false,
            isDisabled: true,
            row: 0,
            col: 1
        },
        {
            value: ".",
            hasError: false,
            isDisabled: false,
            row: 0,
            col: 2
        }
    ]........
]
```

---

### Puzzle Generation
- Function used = `generateSudokuData` in `utils/generateSudokuData.ts`
- User can choose a difficulty, for example if they chose `Medium`, we'll run the `generateSudokuData`
  that will solved an empty board using an algorithm that on every generation is randomize
- Once the solved board is generated, we'll use the value of `Medium` difficulty which is `40`,
which then gonna run a function that will output a randomize number from `0` to `81` (non-repeatable) in `40` runs
- The 40 numbers generated will be the indexes of the Sudoku Data we'll convert to an empty field

- if the user loads puzzles from server, it will just load it straight into the sudoku board
---

### Puzzle Validation
First the Whole Sudoku Board is represented like this, we call it `Block` 

    0 0 0 | 1 1 1 | 2 2 2  
    0 0 0 | 1 1 1 | 2 2 2   
    0 0 0 | 1 1 1 | 2 2 2   
    ------+-------+------
    3 3 3 | 4 4 4 | 5 5 5   
    3 3 3 | 4 4 4 | 5 5 5   
    3 3 3 | 4 4 4 | 5 5 5   
    ------+-------+------
    6 6 6 | 7 7 7 | 8 8 8   
    6 6 6 | 7 7 7 | 8 8 8   
    6 6 6 | 7 7 7 | 8 8 8

This is `Block 0`

    0 0 0 |   
    0 0 0 |
    0 0 0 |  

This is `Block 4`

    | 4 4 4 |   
    | 4 4 4 |   
    | 4 4 4 | 
   
- When the user enters a value in `Block 3`, we get all the values in the whole `Block 3`, and check for duplicate
values in the block. If there's a duplicate value, we get the `row` and `column` index of both duplicated values and we 
mark it `blockError: true` 
- After that, we get all the sudoku data that has error `hasError: true`, we then get which block is that data belongs to,
then we do validation on those blocks for duplicate values in the block, mark it `blockError: true` if theres a duplicate
- And we do validation now on Row and Columns on each sudoku data that has errors, if there's a duplicate value detected, mark it `rowColError: true`
else if no duplicate, mark it `rowColError: false`
- Now on our final step of validation, all of this marking them by `blockError` and `rowColError` are put in the `cellCandidates`
object, which will determine the value of the `hasError`, so basically, if either `blockError` and `rowColError` is true,
then we set the `hasError: true` of that specific row and column data, else if both values are false, we set `hasError: false`


---


Represents the following board:
