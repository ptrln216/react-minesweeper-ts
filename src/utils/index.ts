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
        state: CellState.Untouched,
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
      const adjacentCells = grabAdjacentCells(cells, row, col);
      adjacentCells.forEach((adjacentCell) => {
        if (adjacentCell?.value === CellValue.Mine) mineNum++;
      });

      currentCell.value = mineNum;
    }
  }

  return cells;
};

const grabAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): (Cell | null)[] => {
  const ROW_LENGTH = cells.length;
  const COL_LENGTH = cells[0]?.length;
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < COL_LENGTH - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < COL_LENGTH - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < ROW_LENGTH - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < ROW_LENGTH - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < ROW_LENGTH - 1 && colParam < COL_LENGTH - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;
  return [
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  ];
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  let cellsCopy = cells.slice();
  const adjacentCells = grabAdjacentCells(cells, rowParam, colParam);

  cellsCopy[rowParam][colParam].state = CellState.Open;
  adjacentCells.forEach((adjacentCell, index) => {
    if (
      adjacentCell?.state === CellState.Untouched &&
      adjacentCell.value !== CellValue.Mine
    ) {
      if (adjacentCell.value === CellValue.None) {
        // Open more cells
        switch (index) {
          case 0:
            // topLeftCell
            cellsCopy = openMultipleCells(
              cellsCopy,
              rowParam - 1,
              colParam - 1
            );
            break;
          case 1:
            // topCell
            cellsCopy = openMultipleCells(cellsCopy, rowParam - 1, colParam);
            break;
          case 2:
            // topRightCell
            cellsCopy = openMultipleCells(
              cellsCopy,
              rowParam - 1,
              colParam + 1
            );
            break;
          case 3:
            // leftCell
            cellsCopy = openMultipleCells(cellsCopy, rowParam, colParam - 1);
            break;
          case 4:
            // rightCell
            cellsCopy = openMultipleCells(cellsCopy, rowParam, colParam + 1);
            break;
          case 5:
            // bottomLeftCell
            cellsCopy = openMultipleCells(
              cellsCopy,
              rowParam + 1,
              colParam - 1
            );
            break;
          case 6:
            // bottomCell
            cellsCopy = openMultipleCells(cellsCopy, rowParam + 1, colParam);
            break;
          case 7:
            // bottomRightCell
            cellsCopy = openMultipleCells(
              cellsCopy,
              rowParam + 1,
              colParam + 1
            );
            break;
          default:
            break;
        }
      } else {
        switch (index) {
          case 0:
            // topLeftCell
            cellsCopy[rowParam - 1][colParam - 1].state = CellState.Open;
            break;
          case 1:
            // topCell
            cellsCopy[rowParam - 1][colParam].state = CellState.Open;
            break;
          case 2:
            // topRightCell
            cellsCopy[rowParam - 1][colParam + 1].state = CellState.Open;
            break;
          case 3:
            // leftCell
            cellsCopy[rowParam][colParam - 1].state = CellState.Open;
            break;
          case 4:
            // rightCell
            cellsCopy[rowParam][colParam + 1].state = CellState.Open;
            break;
          case 5:
            // bottomLeftCell
            cellsCopy[rowParam + 1][colParam - 1].state = CellState.Open;
            break;
          case 6:
            // bottomCell
            cellsCopy[rowParam + 1][colParam].state = CellState.Open;
            break;
          case 7:
            // bottomRightCell
            cellsCopy[rowParam + 1][colParam + 1].state = CellState.Open;
            break;
          default:
            break;
        }
      }
    }
  });

  return cellsCopy;
};

const countAdjacentFlags = (adjacentCells: (Cell | null)[]): number => {
  let flagCount = 0;
  adjacentCells.forEach((adjacentCell) => {
    if (adjacentCell?.state === CellState.Flagged) {
      flagCount++;
    }
  });
  return flagCount;
};

export const openAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  const adjacentCells = grabAdjacentCells(cells, rowParam, colParam);
  const [
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  ] = adjacentCells;
  const currentCell = cells[rowParam][colParam];
  let cellsCopy = cells.slice();

  const willOpen = countAdjacentFlags(adjacentCells) === currentCell.value;
  if (willOpen) {
    adjacentCells.forEach((adjacentCell, index) => {
      if (adjacentCell?.state === CellState.Untouched) {
        switch (index) {
          case 0:
            // topLeftCell
            if (topLeftCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(
                cellsCopy,
                rowParam - 1,
                colParam - 1
              );
            } else {
              cellsCopy[rowParam - 1][colParam - 1].state = CellState.Open;
            }
            break;
          case 1:
            // topCell
            if (topCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(cellsCopy, rowParam - 1, colParam);
            } else {
              cellsCopy[rowParam - 1][colParam].state = CellState.Open;
            }
            break;
          case 2:
            // topRightCell
            if (topRightCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(
                cellsCopy,
                rowParam - 1,
                colParam + 1
              );
            } else {
              cellsCopy[rowParam - 1][colParam + 1].state = CellState.Open;
            }
            break;
          case 3:
            // leftCell
            if (leftCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(cellsCopy, rowParam, colParam - 1);
            } else {
              cellsCopy[rowParam][colParam - 1].state = CellState.Open;
            }
            break;
          case 4:
            // rightCell
            if (rightCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(cellsCopy, rowParam, colParam + 1);
            } else {
              cellsCopy[rowParam][colParam + 1].state = CellState.Open;
            }
            break;
          case 5:
            // bottomLeftCell
            if (bottomLeftCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(
                cellsCopy,
                rowParam + 1,
                colParam + -1
              );
            } else {
              cellsCopy[rowParam + 1][colParam - 1].state = CellState.Open;
            }
            break;
          case 6:
            // bottomCell
            if (bottomCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(cellsCopy, rowParam + 1, colParam);
            } else {
              cellsCopy[rowParam + 1][colParam].state = CellState.Open;
            }
            break;
          case 7:
            // bottomRightCell
            if (bottomRightCell?.value === CellValue.None) {
              cellsCopy = openMultipleCells(
                cellsCopy,
                rowParam + 1,
                colParam + 1
              );
            } else {
              cellsCopy[rowParam + 1][colParam + 1].state = CellState.Open;
            }
            break;
          default:
            break;
        }
      }
    });
  }
  return cellsCopy;
};
