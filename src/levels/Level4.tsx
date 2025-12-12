import { CellType, Position } from '../components/Game';

const level4 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'target', 'target', 'empty', 'empty', 'empty', 'target', 'target', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'box', 'empty', 'box', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'box', 'empty', 'box', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 4, y: 4 } as Position,
};

export default level4;
