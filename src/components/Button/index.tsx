import React from "react";
import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  value: number;
  state: number;
  row: number;
  col: number;
  red?: boolean;
  onClick(e: React.MouseEvent): void;
  onContext(e: React.MouseEvent): void;
}

const Button: React.FC<ButtonProps> = ({
  value,
  state,
  row,
  col,
  red,
  onClick,
  onContext,
}) => {
  const renderContent = () => {
    if (state === CellState.Open) {
      if (value === CellValue.Mine) return "💣";
      if (value === CellValue.None) return null;
      return value;
    }
    if (state === CellState.Flagged) {
      return "🚩";
    }
    // else Untouched, display nothing
    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.Open ? "open" : ""
      } value-${value} ${red ? "red" : ""}`}
      onClick={onClick}
      onContextMenu={onContext}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
