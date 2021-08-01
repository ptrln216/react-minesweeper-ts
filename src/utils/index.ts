import { ROWS, COLS, MINES_LIMIT } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];
  // generate empty cells
  for (let row = 0; row < ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < COLS; col++) {
      cells[row].push({
        value: CellValue.None,
        state: CellState.Open, // TODO: Make this back to Untouched later
      });
    }
  }

  // randomly place 10 mines
  let minePlaced = 0;
  while (minePlaced < MINES_LIMIT) {
    const randomRow = Math.floor(Math.random() * ROWS);
    const randomCol = Math.floor(Math.random() * COLS);
    const randomCell = cells[randomRow][randomCol];
    if (randomCell.value !== CellValue.Mine) {
      randomCell.value = CellValue.Mine;
      minePlaced++;
    }
  }

  // calculate mines and assign cell value
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const currentCell = cells[row][col];
      if (currentCell.value === CellValue.Mine) {
        continue;
      }
      let mineNum = 0;
      const topLeftCell = row > 0 && col > 0 ? cells[row - 1][col - 1] : null;
      const topCell = row > 0 ? cells[row - 1][col] : null;
      const topRightCell =
        row > 0 && col < COLS - 1 ? cells[row - 1][col + 1] : null;
      const leftCell = col > 0 ? cells[row][col - 1] : null;
      const rightCell = col < COLS - 1 ? cells[row][col + 1] : null;
      const bottomLeftCell =
        row < ROWS - 1 && col > 0 ? cells[row + 1][col - 1] : null;
      const bottomCell = row < ROWS - 1 ? cells[row + 1][col] : null;
      const bottomRightCell =
        row < ROWS - 1 && col < COLS - 1 ? cells[row + 1][col + 1] : null;

      if (topLeftCell?.value === CellValue.Mine) mineNum++;
      if (topCell?.value === CellValue.Mine) mineNum++;
      if (topRightCell?.value === CellValue.Mine) mineNum++;
      if (leftCell?.value === CellValue.Mine) mineNum++;
      if (rightCell?.value === CellValue.Mine) mineNum++;
      if (bottomLeftCell?.value === CellValue.Mine) mineNum++;
      if (bottomCell?.value === CellValue.Mine) mineNum++;
      if (bottomRightCell?.value === CellValue.Mine) mineNum++;

      currentCell.value = mineNum;
    }
  }

  return cells;
};
