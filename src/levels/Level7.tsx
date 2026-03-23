import { CellType, Position } from '../components/Game';

const level7 = {
  grid: [
    ['wall', 'wall', 'wall', 'empty', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'wall', 'portalOrange', 'wall', 'empty', 'wall'],
    ['wall', 'portalBlue', 'empty', 'empty', 'empty', 'empty', 'wall'],
    ['wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'target', 'wall', 'wall', 'wall'],
    ['wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall'],
    ['wall', 'portalOrange', 'empty', 'box', 'empty', 'portalBlue', 'wall'],
    ['wall', 'empty', 'wall', 'empty', 'wall', 'empty', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ] as CellType[][],
  playerPos: { x: 3, y: 2} as Position,
};

export default level7;
