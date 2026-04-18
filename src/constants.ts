import { Track } from './types';

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Silicon Pulse',
    artist: 'Aethel-G0',
    genre: 'Synthwave',
    duration: 184,
    coverUrl: 'https://picsum.photos/seed/silicon/400/400',
  },
  {
    id: '2',
    title: 'Cybernetic Dreams',
    artist: 'Neon-Vortex AI',
    genre: 'Ambient Tech',
    duration: 215,
    coverUrl: 'https://picsum.photos/seed/cyber/400/400',
  },
  {
    id: '3',
    title: 'Neon Velocity',
    artist: 'Pulse-Runner',
    genre: 'High Energy Electro',
    duration: 156,
    coverUrl: 'https://picsum.photos/seed/velocity/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
