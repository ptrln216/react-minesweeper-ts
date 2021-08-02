import React, { useEffect, useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import { generateCells } from "../../utils";
import { Cell, CellState, CellValue, Faces } from "../../types";
import { MINES_LIMIT } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Faces>(Faces.Smile);
  const [time, setTime] = useState<number>(0);
  const [alive, setAlive] = useState<boolean>(false);
  const [remainMines, setRemainMines] = useState<number>(MINES_LIMIT);

  // mousedown mouseup event handlers
  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Faces.Excited);
    };
    const handleMouseUp = () => {
      setFace(Faces.Smile);
    };
    if (alive) {
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [alive]);

  // Timer
  useEffect(() => {
    // if game begins, start timer
    if (alive && time < 999) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      // timer will be cleaned up when alive is set to false
      return () => {
        clearInterval(timerId);
      };
    }
  }, [alive, time]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (!alive && face === Faces.Dead) {
      return;
    }
    const currentCell = cells[rowParam][colParam];
    if (currentCell.state === CellState.Flagged) {
      return;
    }
    if (!alive) {
      setAlive(true);
    }
    const cellsCopy = cells.slice();
    cellsCopy[rowParam][colParam].state = CellState.Open;
    setCells(cellsCopy);
    if (currentCell.value === CellValue.Mine) {
      setAlive(false);
      setFace(Faces.Dead);
    }
  };
  // on right click
  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault(); // prevent browser menu from poping up

      if (!alive) {
        return;
      }

      const cellsCopy = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (remainMines === 0 && currentCell.state !== CellState.Flagged) {
        return;
      }

      if (currentCell.state === CellState.Open) {
        return;
      } else if (currentCell.state === CellState.Untouched) {
        cellsCopy[rowParam][colParam].state = CellState.Flagged;
        setCells(cellsCopy);
        setRemainMines((prevMines) => prevMines - 1);
      } else if (currentCell.state === CellState.Flagged) {
        cellsCopy[rowParam][colParam].state = CellState.Untouched;
        setCells(cellsCopy);
        setRemainMines((prevMines) => prevMines + 1);
      }
    };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          key={`${rowIndex}-${colIndex}`}
          onClick={handleCellClick(rowIndex, colIndex)}
          onContext={handleCellContext(rowIndex, colIndex)}
        />
      ))
    );
  };

  const handleFaceClick = () => {
    setAlive(false);
    setTime(0);
    setFace(Faces.Smile);
    setRemainMines(MINES_LIMIT);
    setCells(generateCells());
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={remainMines} />
        <div className="Face" onClick={handleFaceClick}>
          {face}
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Board">{renderCells()}</div>
    </div>
  );
};

export default App;
