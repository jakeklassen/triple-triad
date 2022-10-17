export type Position = [row: number, column: number];
export type Cell = string | undefined;
export type Board = Cell[][];
export type Direction = 'north' | 'south' | 'east' | 'west';

export type Card = {
  name: string;
  level: number;
  // add it
  // description: string;

  element?: string;

  stats: {
    north: number;
    south: number;
    east: number;
    west: number;
  };

  image: {
    base64: string;
    width: number;
    height: number;
  };
};

export type Hand = [
  Card | undefined,
  Card | undefined,
  Card | undefined,
  Card | undefined,
  Card | undefined,
];
