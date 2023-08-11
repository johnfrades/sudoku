export const convertPuzzleString = (puzzleString: string): string[][] => {
    const splitData = puzzleString.split('')
    const puzzleArr: string[][] = []
    let row = 0

    splitData.forEach((sData, idx) => {
        const isLastCellOnTheRow = idx % 9 === 0
        if (idx !== 0 && isLastCellOnTheRow) {
            row = row + 1
        }

        if (!Array.isArray(puzzleArr[row])) {
            puzzleArr.push([])
        }

        puzzleArr[row].push(sData)
    })

    return puzzleArr
}
