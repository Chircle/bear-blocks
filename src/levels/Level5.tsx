import { CellType, Position } from '../components/Game';

const level5 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'target', 'target', 'wall'],
    ['wall', 'empty', 'box', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'box', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 1, y: 1 } as Position,
};

export default level5;
