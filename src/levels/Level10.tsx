import { CellType, Position } from '../components/Game';

const level10 = {
  grid: [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'target', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'target', 'wall'],
    ['wall', 'empty', 'box', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'box', 'empty', 'wall'],
    ['wall', 'wall', 'empty', 'wall', 'empty', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'wall', 'wall', 'empty', 'portalOrange', 'portalBlue', 'empty', 'wall', 'wall', 'empty', 'wall'],
    ['wall', 'empty', 'wall', 'wall', 'empty', 'portalBlue', 'portalOrange', 'empty', 'wall', 'wall', 'empty', 'wall'],
    ['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'empty', 'wall', 'wall'],
    ['wall', 'empty', 'box', 'wall', 'empty', 'wall', 'wall', 'empty', 'wall', 'box', 'empty', 'wall'],
    ['wall', 'target', 'empty', 'wall', 'empty', 'empty', 'empty', 'empty', 'wall', 'empty', 'target', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 3, y: 4 } as Position,
};

export default level10;
