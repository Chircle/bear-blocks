import { useState, useEffect } from 'react';
import { Game } from './components/Game';

export default function App() {
  
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">

          <div className="flex flex-wrap items-center justify-center gap-4 text-amber-800">
                    <div className="flex items-center gap-2">
              <div className="text-2xl font-bold select-none flex items-center gap-2">
                <span>🐻</span>
                <span>Bear Blocks</span>
                <button
                  aria-label="Spiel-Info anzeigen"
                  onClick={() => setShowInfo(true)}
                  className="text-amber-600 hover:text-amber-800 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full w-8 h-8 flex items-center justify-center bg-white/70 border border-amber-300 ml-2"
                  style={{ lineHeight: 1 }}
                >
                  i
                </button>
              </div>
            </div> 
          </div>

            {showInfo && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-2xl shadow-2xl mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-amber-900 flex items-center gap-2">
                      ℹ️ Spiel-Erklärung
                    </h2>
                    <button
                      onClick={() => setShowInfo(false)}
                      className="text-amber-600 hover:text-amber-800 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-amber-700 text-base space-y-4">
                    <div>💧 Nutze die Wasserpistole (Buttons oder Pfeiltasten mit Shift) um Wände wegzuschmelzen. Du hast 4 Ladungen in Level 7!</div>
                    <div>🎮 Bewege das Bärchen mit den Pfeiltasten oder Touch-Buttons</div>
                    <div>📦 Schiebe alle Boxen auf die grünen Zielfelder</div>
                    <div>💣 Sammle Bomben und wirf sie mit Leertaste (zerstört 3 Wände)</div>
                    <div>🌀 Portale teleportieren dich und Boxen zum Partner-Portal</div>
                    <div>🔄 Drücke "R" zum Neustarten</div>
                  </div>
                </div>
              </div>
            )}
          <p className="text-amber-700">Schiebe alle Blöcke auf die Zielfelder!</p>
          <p className="text-amber-600 text-sm mt-2">Steuerung: Pfeiltasten zum Bewegen</p>
        </div>
        <Game />
      </div>
    </div>
  );
}
