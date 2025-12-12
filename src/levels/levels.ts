import type { CellType, Position } from '../components/Game';

export interface Level {
  grid: CellType[][];
  playerPos: Position;
}

// Dynamisch alle LevelX.tsx-Dateien importieren
const levelModules = import.meta.glob<Level>('./Level*.tsx', { eager: true });

// Level-Objekte extrahieren und nach Nummer sortieren
const levels: Level[] = Object.entries(levelModules)
  .map(([path, mod]) => {
    const match = path.match(/Level(\d+)\.tsx$/);
    return match ? { num: parseInt(match[1], 10), level: (mod as any).default } : null;
  })
  .filter(Boolean)
  .sort((a, b) => a!.num - b!.num)
  .map(obj => obj!.level);

export const LEVELS: Level[] = levels;
