import { CellType, Position } from '../components/Game';

const level2 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'box', 'empty', 'empty', 'box', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'target', 'empty', 'empty', 'target', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'box', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'target', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 1, y: 1 } as Position,
};

export default level2;
