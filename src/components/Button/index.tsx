import React from "react";
import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  value: number;
  state: number;
  row: number;
  col: number;
}

const Button: React.FC<ButtonProps> = ({ value, state, row, col }) => {
  const renderContent = () => {
    if (state === CellState.Open) {
      if (value === CellValue.Mine) return "💣";
      else if (value === CellValue.None) return null;
      return value;
    } else if (state === CellState.Flagged) {
      return "🚩";
    }
    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.Open ? "open" : ""
      } value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
