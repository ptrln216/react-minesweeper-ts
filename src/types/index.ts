export enum CellValue {
  None,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Mine,
}

export enum CellState {
  Untouched,
  Open,
  Flagged,
}

export type Cell = { value: number; state: number };

export enum Faces {
  Smile = "😃",
  Excited = "😆",
  Dead = "😵",
  Won = "😎",
}
