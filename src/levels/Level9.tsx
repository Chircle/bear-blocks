import { CellType, Position } from '../components/Game';

const level9 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'wall', 'target', 'wall', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'box', 'empty', 'wall', 'target', 'wall', 'empty', 'box', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'target', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall'],
    ['wall', 'target', 'target', 'empty', 'empty', 'empty', 'empty', 'empty', 'target', 'target', 'wall'],
    ['wall', 'wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'target', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'box', 'empty', 'wall', 'target', 'wall', 'empty', 'box', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'wall', 'target', 'wall', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 5, y: 5 } as Position,
};

export default level9;
