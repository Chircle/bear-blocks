import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { LEVELS } from '../levels/levels';

export type CellType = 'empty' | 'wall' | 'box' | 'target' | 'boxOnTarget' | 'bomb' | 'portalBlue' | 'portalOrange';
export type Position = { x: number; y: number };

interface GameState {
  grid: CellType[][];
  playerPos: Position;
  moves: number;
  level: number;
  bombs: number;
  waterCharges?: number;
}



// Hilfsfunktionen für Rucksack
function loadBackpack() {
  const raw = sessionStorage.getItem('bearBlocks_backpack');
  if (!raw) return { bombs: 0, waterCharges: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { bombs: 0, waterCharges: 0 };
  }
}
function saveBackpack(items: { bombs: number; waterCharges: number }) {
  sessionStorage.setItem('bearBlocks_backpack', JSON.stringify(items));
}

// Easter Egg State für Level 10
let upKeyStreak: number[] = [];

export function Game() {
  const [showLevelChoice, setShowLevelChoice] = useState(false);
  const [showEasterEggHint, setShowEasterEggHint] = useState(false);
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [savedLevel, setSavedLevel] = useState<number | null>(null);
  const [highestLevel, setHighestLevel] = useState(0);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    // Lade gespeicherte Level aus localStorage
    const savedHighest = localStorage.getItem('bearBlocks_highest_level');
    const savedCurrent = localStorage.getItem('bearBlocks_current_level');
    const sessionSaved = sessionStorage.getItem('bearBlocks_lastLevel');
    
    const highest = savedHighest ? parseInt(savedHighest, 10) : 0;
    const current = savedCurrent ? parseInt(savedCurrent, 10) : 0;
    const session = sessionSaved ? parseInt(sessionSaved, 10) : 0;
    
    setHighestLevel(highest);
    
    // Zeige Level-Auswahl wenn Session-Level vorhanden
    if (session > 0 && session !== current) {
      setTimeout(() => {
        setSavedLevel(session);
        setShowLevelChoice(true);
      }, 100);
    }
    
    const startLevel = current;
    const level = LEVELS[startLevel] || LEVELS[0];
    const backpack = loadBackpack();
    
    return {
      grid: level.grid.map(row => [...row]),
      playerPos: { ...level.playerPos },
      moves: 0,
      level: startLevel,
      bombs: backpack.bombs || 0,
      waterCharges: backpack.waterCharges || 0,
    };
  });
  // Wasserpistolen-Logik
  const [waterGunActive, setWaterGunActive] = useState(false);
  const useWaterGun = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState.waterCharges || gameState.waterCharges <= 0) return;
    const { x, y } = gameState.playerPos;
    let targetX = x;
    let targetY = y;
    if (direction === 'up') targetY -= 1;
    if (direction === 'down') targetY += 1;
    if (direction === 'left') targetX -= 1;
    if (direction === 'right') targetX += 1;
    if (
      targetY >= 0 &&
      targetY < gameState.grid.length &&
      targetX >= 0 &&
      targetX < gameState.grid[0].length
    ) {
      const cell = gameState.grid[targetY][targetX];
      if (cell === 'wall') {
        const newGrid = gameState.grid.map(row => [...row]);
        newGrid[targetY][targetX] = 'empty';
        setGameState(prev => ({
          ...prev,
          grid: newGrid,
          waterCharges: (prev.waterCharges || 1) - 1,
          moves: prev.moves + 1,
        }));
      }
    }
  }, [gameState]);
  const useWaterGunOnCell = useCallback((x: number, y: number) => {
    if (!gameState.waterCharges || gameState.waterCharges <= 0) return;
    if (
      y >= 0 &&
      y < gameState.grid.length &&
      x >= 0 &&
      x < gameState.grid[0].length
    ) {
      const cell = gameState.grid[y][x];
      if (cell === 'wall') {
        const newGrid = gameState.grid.map(row => [...row]);
        newGrid[y][x] = 'empty';
        setGameState(prev => ({
          ...prev,
          grid: newGrid,
          waterCharges: (prev.waterCharges || 1) - 1,
          moves: prev.moves + 1,
        }));
        setWaterGunActive(false);
      }
    }
  }, [gameState]);

  const [isWon, setIsWon] = useState(false);

  // Speichere Level-Fortschritt
  const saveProgress = useCallback((level: number) => {
    sessionStorage.setItem('bearBlocks_lastLevel', level.toString());
    localStorage.setItem('bearBlocks_current_level', level.toString());
    
    // Update highest level wenn nötig
    const currentHighest = parseInt(localStorage.getItem('bearBlocks_highest_level') || '0', 10);
    if (level > currentHighest) {
      localStorage.setItem('bearBlocks_highest_level', level.toString());
      setHighestLevel(level);
    }
  }, []);
  
  // Gehe zu bestimmtem Level
  const goToLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < LEVELS.length && levelIndex <= highestLevel) {
      const level = LEVELS[levelIndex];
      setGameState({
        grid: level.grid.map(row => [...row]),
        playerPos: { ...level.playerPos },
        moves: 0,
        level: levelIndex,
        bombs: 0,
      });
      localStorage.setItem('bearBlocks_current_level', levelIndex.toString());
      setShowLevelMap(false);
      setIsWon(false);
      if (levelIndex === 9) {
        setShowEasterEggHint(true);
        setTimeout(() => setShowEasterEggHint(false), 2000);
      }
    }
  }, [highestLevel]);

  // Starte von gespeichertem Level
  const startFromSavedLevel = useCallback(() => {
    if (savedLevel !== null) {
      const level = LEVELS[savedLevel];
      setGameState({
        grid: level.grid.map(row => [...row]),
        playerPos: { ...level.playerPos },
        moves: 0,
        level: savedLevel,
        bombs: 0,
      });
      if (savedLevel === 9) {
        setShowEasterEggHint(true);
        setTimeout(() => setShowEasterEggHint(false), 2000);
      }
    }
    setShowLevelChoice(false);
  }, [savedLevel]);

  // Starte von Level 1
  const startFromBeginning = useCallback(() => {
    sessionStorage.removeItem('bearBlocks_lastLevel');
    const level = LEVELS[0];
    setGameState({
      grid: level.grid.map(row => [...row]),
      playerPos: { ...level.playerPos },
      moves: 0,
      level: 0,
      bombs: 0,
    });
    setShowLevelChoice(false);
    // Kein Easter Egg Hinweis bei Start von Level 1
  }, []);

  const resetLevel = useCallback(() => {
    const level = LEVELS[gameState.level];
    setGameState({
      grid: level.grid.map(row => [...row]),
      playerPos: { ...level.playerPos },
      moves: 0,
      level: gameState.level,
      bombs: 0,
    });
    setIsWon(false);
    if (gameState.level === 9) {
      setShowEasterEggHint(true);
      setTimeout(() => setShowEasterEggHint(false), 2000);
    }
  }, [gameState.level]);

  const nextLevel = useCallback(() => {
    const nextLevelIndex = gameState.level + 1;
    if (nextLevelIndex < LEVELS.length) {
      saveProgress(nextLevelIndex);
      
      // Update highest level
      if (nextLevelIndex > highestLevel) {
        setHighestLevel(nextLevelIndex);
      }
      
      const level = LEVELS[nextLevelIndex];
      setGameState({
        grid: level.grid.map(row => [...row]),
        playerPos: { ...level.playerPos },
        moves: 0,
        level: nextLevelIndex,
        bombs: 0,
      });
      setIsWon(false);
    } else {
      // Alle Level geschafft
      sessionStorage.removeItem('bearBlocks_lastLevel');
      localStorage.setItem('bearBlocks_highest_level', (LEVELS.length - 1).toString());
      setHighestLevel(LEVELS.length - 1);
    }
  }, [gameState.level, saveProgress, highestLevel]);

  const checkWin = useCallback((grid: CellType[][]) => {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'target' || grid[y][x] === 'box') {
          return false;
        }
      }
    }
    return true;
  }, []);

  const useBomb = useCallback(() => {
    if (gameState.bombs <= 0 || isWon) return;

    setGameState(prev => {
      const newGrid = prev.grid.map(row => [...row]);

      // Spezial-Logik für Level 9: alle 10 Züge verschwindet ein target-Feld
      if (prev.level === 8) { // Level 9 (Index 8)
        const nextMoves = prev.moves + 1;
        if (nextMoves % 10 === 0) {
          // Suche ein target-Feld und mache es zu 'empty'
          outer: for (let y = 0; y < newGrid.length; y++) {
            for (let x = 0; x < newGrid[y].length; x++) {
              if (newGrid[y][x] === 'target') {
                newGrid[y][x] = 'empty';
                break outer;
              }
            }
          }
        }
      }
      let wallsDestroyed = 0;
      
      // Zerstöre bis zu 3 Wände, beginnend in der Nähe des Spielers
      const { x: px, y: py } = prev.playerPos;
      
      // Suche Wände in der Umgebung (erweiterte Suche wenn nötig)
      const searchRadii = [1, 2, 3, 4, 5];
      
      for (const radius of searchRadii) {
        if (wallsDestroyed >= 3) break;
        
        for (let dy = -radius; dy <= radius && wallsDestroyed < 3; dy++) {
          for (let dx = -radius; dx <= radius && wallsDestroyed < 3; dx++) {
            const nx = px + dx;
            const ny = py + dy;
            
            if (nx >= 0 && nx < newGrid[0].length && ny >= 0 && ny < newGrid.length) {
              if (newGrid[ny][nx] === 'wall') {
                newGrid[ny][nx] = 'empty';
                wallsDestroyed++;
              }
            }
          }
        }
      }
      
      return {
        ...prev,
        grid: newGrid,
        bombs: prev.bombs - 1,
        moves: prev.moves + 1,
      };
    });
  }, [gameState.bombs, gameState.playerPos, isWon]);

  // Synchronisiere Rucksack (backpack) bei Änderungen
  useEffect(() => {
    try {
      saveBackpack({ bombs: gameState.bombs || 0, waterCharges: gameState.waterCharges || 0 });
    } catch (e) {
      // Ignore
    }
  }, [gameState.bombs, gameState.waterCharges]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isWon) return;

    setGameState(prev => {
      const newX = prev.playerPos.x + dx;
      const newY = prev.playerPos.y + dy;

      // Check boundaries
      if (newY < 0 || newY >= prev.grid.length || newX < 0 || newX >= prev.grid[0].length) {
        return prev;
      }

      const newGrid = prev.grid.map(row => [...row]);
      const targetCell = newGrid[newY][newX];

      // Wall collision
      if (targetCell === 'wall') {
        return prev;
      }

      // Empty cell or target
      if (targetCell === 'empty' || targetCell === 'target') {
        const nextMoves = prev.moves + 1;
        const newState = {
          ...prev,
          playerPos: { x: newX, y: newY },
          moves: nextMoves,
        };
        // Spezial-Logik für Level 9: alle 10 Züge verschwindet ein target-Feld
        if (prev.level === 8 && nextMoves % 10 === 0) {
          // Suche ein target-Feld und mache es zu 'empty'
          outer: for (let y = 0; y < newGrid.length; y++) {
            for (let x = 0; x < newGrid[y].length; x++) {
              if (newGrid[y][x] === 'target') {
                newGrid[y][x] = 'empty';
                break outer;
              }
            }
          }
          newState.grid = newGrid;
        }
        return newState;
      }

      // Bomb pickup
      if (targetCell === 'bomb') {
        newGrid[newY][newX] = 'empty';
        return {
          ...prev,
          grid: newGrid,
          playerPos: { x: newX, y: newY },
          moves: prev.moves + 1,
          bombs: prev.bombs + 1,
        };
      }

      // Portal teleportation
      if (targetCell === 'portalBlue' || targetCell === 'portalOrange') {
        const portalType = targetCell;
        // Finde anderes Portal gleicher Farbe (aber nicht das aktuelle Feld)
        for (let py = 0; py < newGrid.length; py++) {
          for (let px = 0; px < newGrid[py].length; px++) {
            if (
              newGrid[py][px] === portalType &&
              (px !== newX || py !== newY) // nicht das aktuelle Feld
            ) {
              // Teleportiere zum Partner-Portal gleicher Farbe
              return {
                ...prev,
                playerPos: { x: px, y: py },
                moves: prev.moves + 1,
              };
            }
          }
        }
        // Falls kein Partner gefunden, normale Bewegung
        return {
          ...prev,
          playerPos: { x: newX, y: newY },
          moves: prev.moves + 1,
        };
      }

      // Box or box on target
      if (targetCell === 'box' || targetCell === 'boxOnTarget') {
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;

        // Check if box can be moved
        if (
          boxNewY >= 0 &&
          boxNewY < newGrid.length &&
          boxNewX >= 0 &&
          boxNewX < newGrid[0].length
        ) {
          const boxTargetCell = newGrid[boxNewY][boxNewX];

          // Portal push logic
          if (boxTargetCell === 'portalBlue' || boxTargetCell === 'portalOrange') {
            const portalType = boxTargetCell;
            let found = false;
            // Finde anderes Portal gleicher Farbe (aber nicht das aktuelle Feld)
            for (let py = 0; py < newGrid.length; py++) {
              for (let px = 0; px < newGrid[py].length; px++) {
                if (
                  newGrid[py][px] === portalType &&
                  (px !== boxNewX || py !== boxNewY) // nicht das aktuelle Feld
                ) {
                  const afterPortalX = px + dx;
                  const afterPortalY = py + dy;
                  if (
                    afterPortalY >= 0 &&
                    afterPortalY < newGrid.length &&
                    afterPortalX >= 0 &&
                    afterPortalX < newGrid[0].length &&
                    (newGrid[afterPortalY][afterPortalX] === 'empty' || newGrid[afterPortalY][afterPortalX] === 'target')
                  ) {
                    // Place box after portal
                    if (newGrid[afterPortalY][afterPortalX] === 'target') {
                      newGrid[afterPortalY][afterPortalX] = 'boxOnTarget';
                    } else {
                      newGrid[afterPortalY][afterPortalX] = 'box';
                    }
                    found = true;
                  }
                  break;
                }
              }
              if (found) break;
            }
            // Remove box from original position
            if (targetCell === 'boxOnTarget') {
              newGrid[newY][newX] = 'target';
            } else {
              newGrid[newY][newX] = 'empty';
            }
            if (found) {
              return {
                ...prev,
                grid: newGrid,
                playerPos: { x: newX, y: newY },
                moves: prev.moves + 1,
              };
            }
            // If not found or can't place, do nothing
            return prev;
          }

          // Normal box move
          if (boxTargetCell === 'empty' || boxTargetCell === 'target') {
            if (boxTargetCell === 'target') {
              newGrid[boxNewY][boxNewX] = 'boxOnTarget';
            } else {
              newGrid[boxNewY][boxNewX] = 'box';
            }
            // Update current box position
            if (targetCell === 'boxOnTarget') {
              newGrid[newY][newX] = 'target';
            } else {
              newGrid[newY][newX] = 'empty';
            }
            return {
              ...prev,
              grid: newGrid,
              playerPos: { x: newX, y: newY },
              moves: prev.moves + 1,
            };
          }
        }
      }

      return prev;
    });
  }, [isWon]);

  useEffect(() => {
    if (checkWin(gameState.grid)) {
      setIsWon(true);
    }
  }, [gameState.grid, checkWin]);

  // Speichere Fortschritt nur bei Level-Completion, nicht bei Navigation
  useEffect(() => {
    // Nur beim Start das aktuelle Level setzen, nicht bei jeder Änderung
    if (!showLevelChoice && !showLevelMap) {
      localStorage.setItem('bearBlocks_current_level', gameState.level.toString());
    }
  }, [gameState.level, showLevelChoice, showLevelMap]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Easter Egg: 5x schnell hintereinander Pfeil hoch in Level 10 gibt 2 Bomben
      if (gameState.level === 9 && (e.key === 'ArrowUp' || e.key === 'Up')) {
        const now = Date.now();
        upKeyStreak = upKeyStreak.filter(ts => now - ts < 1500); // 1,5 Sekunden Zeitfenster
        upKeyStreak.push(now);
        if (upKeyStreak.length >= 5) {
          setGameState(prev => ({ ...prev, bombs: (prev.bombs || 0) + 2 }));
          upKeyStreak = [];
        }
      }
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer(1, 0);
          break;
        case 'Enter':
          e.preventDefault();
          if (isWon) {
            if (gameState.level < LEVELS.length - 1) {
              nextLevel();
            }
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetLevel();
          break;
        case ' ':
          e.preventDefault();
          useBomb();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, isWon, resetLevel, nextLevel, gameState.level, useBomb]);

  // Zeige Level-Auswahl Dialog
  if (showLevelChoice && savedLevel !== null) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center mx-4 max-w-md">
            <div className="text-4xl mb-4">🐻</div>
            <h2 className="text-2xl text-amber-900 mb-4">Willkommen zurück!</h2>
            <p className="text-amber-700 mb-6">
              Du warst zuletzt bei Level {savedLevel + 1}.
              <br />
              Möchtest du dort weitermachen oder von vorne beginnen?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startFromBeginning}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-6 py-3 rounded-lg transition-colors"
              >
                🏁 Von Level 1 starten
              </button>
              <button
                onClick={startFromSavedLevel}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ▶️ Bei Level {savedLevel + 1} weitermachen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Zeige Level-Map
  if (showLevelMap) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-amber-900 flex items-center gap-2">
                🗺️ Level-Map
              </h2>
              <button
                onClick={() => setShowLevelMap(false)}
                className="text-amber-600 hover:text-amber-800 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {LEVELS.map((_, index) => {
                const isUnlocked = index <= highestLevel;
                const isCurrent = index === gameState.level;
                const isCompleted = index < highestLevel;
                
                return (
                  <button
                    key={index}
                    onClick={() => isUnlocked ? goToLevel(index) : null}
                    disabled={!isUnlocked}
                    className={`
                      aspect-square rounded-lg font-bold text-lg transition-all transform hover:scale-105
                      ${
                        !isUnlocked
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-300'
                          : isCompleted
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{index + 1}</span>
                      {isCompleted && <span className="text-xs">✓</span>}
                      {isCurrent && <span className="text-xs">▶️</span>}
                      {!isUnlocked && <span className="text-xs">🔒</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="text-center text-amber-700 text-sm space-y-2">
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Abgeschlossen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                  <span>Aktuelles Level</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-amber-500 rounded border-2 border-amber-700"></div>
                  <span>Verfügbar</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-200 rounded border-2 border-gray-400"></div>
                  <span>Gesperrt</span>
                </div>
              </div>
              <p className="mt-4">
                Höchstes erreichtes Level: {highestLevel + 1}/{LEVELS.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {showEasterEggHint && (
        <div className="top-15 left-1/2 -translate-x-1/2 bg-yellow-100 border-2 border-yellow-400 text-yellow-900 px-6 py-4 rounded-xl shadow-lg z-50 text-center text-base font-semibold animate-fade-in-out">
          In Level 10 gibt es jetzt ein Easter Egg: Wenn du 5-mal schnell hintereinander die Pfeil-hoch-Taste drückst, bekommst du 2 Bomben geschenkt! Viel Spaß beim Ausprobieren!
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4 text-amber-800">
        <div className="bg-white/70 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-sm sm:text-base">Level: {gameState.level + 1}/{LEVELS.length}</span>
        </div>

        <div className="bg-white/70 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-sm sm:text-base">Züge: {gameState.moves}</span>
        </div>

        <button
          onClick={() => setWaterGunActive(!waterGunActive)}
          disabled={!gameState.waterCharges || isWon}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2 ${waterGunActive ? 'ring-4 ring-blue-400' : ''}`}
        >
          <span className="text-lg">💧</span>
          <span className="text-sm sm:text-base">Wasserpistole</span>
          <span className="ml-2 text-xs font-bold">{gameState.waterCharges || 0}</span>
          {waterGunActive && <span className="ml-2 text-xs">Block wählen!</span>}
        </button>
        <button
          onClick={useBomb}
          disabled={gameState.bombs <= 0 || isWon}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="text-lg">💣</span>
          <span className="text-sm sm:text-base">Bomben werfen</span>
          <span className="ml-2 text-xs font-bold">{gameState.bombs}</span>
        </button>

        <button
          onClick={resetLevel}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm sm:text-base">Neustart</span>
        </button>

        <button
          onClick={() => setShowLevelMap(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span className="text-lg">🗺️</span>
          <span className="text-sm sm:text-base">Level-Map</span>
        </button>
      </div>

      <div className="relative bg-white/80 p-4 sm:p-8 rounded-2xl shadow-xl">
        <div className="grid gap-1">
          {gameState.grid.map((row: CellType[], y: number) => (
            <div key={y} className="flex gap-1">
              {row.map((cell, x) => {
                const isPlayer = gameState.playerPos.x === x && gameState.playerPos.y === y;
                const canMelt = waterGunActive && cell === 'wall' && !isPlayer && !isWon && (gameState.waterCharges || 0) > 0;
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl transition-all ${
                      cell === 'wall'
                        ? `bg-amber-900 rounded-sm ${canMelt ? 'cursor-pointer ring-2 ring-blue-400' : ''}`
                        : cell === 'target'
                        ? 'bg-green-200 border-2 border-green-400 rounded-full'
                        : cell === 'boxOnTarget'
                        ? 'bg-green-400 border-2 border-green-600 rounded-lg shadow-md'
                        : cell === 'box'
                        ? 'bg-amber-400 border-2 border-amber-600 rounded-lg shadow-md'
                        : cell === 'bomb'
                        ? 'bg-red-200 border-2 border-red-400 rounded-full animate-pulse'
                        : cell === 'portalBlue'
                        ? 'bg-blue-400 border-4 border-blue-600 rounded-full animate-spin-slow shadow-lg shadow-blue-500/50'
                        : cell === 'portalOrange'
                        ? 'bg-orange-400 border-4 border-orange-600 rounded-full animate-spin-slow shadow-lg shadow-orange-500/50'
                        : 'bg-amber-50'
                    }`}
                    onClick={() => canMelt ? useWaterGunOnCell(x, y) : undefined}
                  >
                    {isPlayer && <span className="animate-bounce">🐻</span>}
                    {cell === 'box' && <span>📦</span>}
                    {cell === 'boxOnTarget' && <span>✅</span>}
                    {cell === 'bomb' && !isPlayer && <span className="animate-pulse">💣</span>}
                    {cell === 'portalBlue' && !isPlayer && <span className="animate-spin text-blue-100">🌀</span>}
                    {cell === 'portalOrange' && !isPlayer && <span className="animate-spin text-orange-100">🔵</span>}
                    {cell === 'target' && !isPlayer && <span className="text-base sm:text-lg">⭕</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {isWon && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl text-center mx-4">
              <div className="text-4xl sm:text-6xl mb-4">🎉</div>
              <h2 className="text-amber-900 mb-4">Level geschafft!</h2>
              <p className="text-amber-700 mb-6">Züge: {gameState.moves}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={resetLevel}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-6 py-3 rounded-lg transition-colors"
                >
                  Nochmal
                </button>
                {gameState.level < LEVELS.length - 1 && (
                  <button
                    onClick={nextLevel}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Nächstes Level
                  </button>
                )}
                {gameState.level === LEVELS.length - 1 && (
                  <div className="text-amber-700 px-6 py-3">
                    Alle Level geschafft! 🏆
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => {
            // Easter Egg: 5x schnell nach oben drücken auf Mobile in Level 10
            if (gameState.level === 9) {
              const now = Date.now();
              upKeyStreak = upKeyStreak.filter(ts => now - ts < 1500); // 1,5 Sekunden Zeitfenster
              upKeyStreak.push(now);
              if (upKeyStreak.length >= 5) {
                setGameState(prev => ({ ...prev, bombs: (prev.bombs || 0) + 2 }));
                upKeyStreak = [];
              }
            }
            movePlayer(0, -1);
          }}
          className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-lg shadow-lg transition-colors touch-none"
          disabled={isWon}
        >
          <ChevronUp className="w-8 h-8" />
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-lg shadow-lg transition-colors touch-none"
            disabled={isWon}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-lg shadow-lg transition-colors touch-none"
            disabled={isWon}
          >
            <ChevronDown className="w-8 h-8" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white p-4 rounded-lg shadow-lg transition-colors touch-none"
            disabled={isWon}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>


      {/* <div className="text-center text-amber-700 text-xs sm:text-sm bg-white/50 px-4 sm:px-6 py-3 rounded-lg">
        <p>💧 Nutze die Wasserpistole (Buttons oder Pfeiltasten mit Shift) um Wände wegzuschmelzen. Du hast 4 Ladungen in Level 7!</p>
        <p>🎮 Bewege das Bärchen mit den Pfeiltasten oder Touch-Buttons</p>
        <p>📦 Schiebe alle Boxen auf die grünen Zielfelder</p>
        <p>💣 Sammle Bomben und wirf sie mit Leertaste (zerstört 3 Wände)</p>
        <p>🌀 Portale teleportieren dich und Boxen zum Partner-Portal</p>
        <p className="hidden sm:block">🔄 Drücke "R" zum Neustarten</p>
      </div> */}
    </div>
  );
}