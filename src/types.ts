export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number; // in seconds
  coverUrl: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
