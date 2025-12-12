import { CellType, Position } from '../components/Game';

const level1 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'box', 'empty', 'target', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'box', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'target', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 1, y: 1 } as Position,
};

export default level1;
