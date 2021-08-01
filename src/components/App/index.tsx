import React, { useState } from "react";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import { generateCells } from "../../utils";
import { Faces } from "../../types";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          key={`${rowIndex}-${colIndex}`}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face" onClick={() => setCells(generateCells())}>
          {Faces.Smile}
        </div>
        <NumberDisplay value={23} />
      </div>
      <div className="Board">{renderCells()}</div>
    </div>
  );
};

export default App;
