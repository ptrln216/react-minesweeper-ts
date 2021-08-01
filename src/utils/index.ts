import { ROWS, COLS } from '../constants'
import { CellValue, CellState, Cell } from '../types'

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = []
  for (let row = 0; row < ROWS; row++) {
    cells.push([])
    for (let col = 0; col < COLS; col++) {
      cells[row].push({
        value: CellValue.None,
        state: CellState.Untouched,
      })
    }
  }

  return cells
}
