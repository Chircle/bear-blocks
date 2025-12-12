import { CellType, Position } from '../components/Game';

const level6 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'target', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'bomb', 'box', 'wall', 'empty', 'wall', 'box', 'bomb', 'wall'],
    ['wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall'],
    ['wall', 'target', 'empty', 'empty', 'empty', 'empty', 'empty', 'target', 'wall'],
    ['wall', 'wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'wall'],
    ['wall', 'empty', 'box', 'wall', 'empty', 'wall', 'box', 'empty', 'wall'],
    ['wall', 'empty', 'bomb', 'wall', 'target', 'wall', 'bomb', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 4, y: 4 } as Position,
};

export default level6;
