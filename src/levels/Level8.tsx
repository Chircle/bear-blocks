import { CellType, Position } from '../components/Game';

const level8 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'bomb', 'box', 'wall', 'target', 'target', 'wall', 'box', 'empty', 'wall'],
    ['wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'bomb', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'bomb', 'bomb', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'empty', 'wall', 'wall', 'wall', 'wall', 'empty', 'wall', 'wall'],
    ['wall', 'empty', 'box', 'wall', 'target', 'target', 'wall', 'box', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 4, y: 4 } as Position,
};

export default level8;
