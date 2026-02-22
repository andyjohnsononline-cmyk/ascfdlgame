import { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS, ZONE_NAMES, ZONE_REWARDS, ZONE_LEVEL_RANGES, getZoneForLevel, isLastLevelInZone } from './levels.js';
import FrameLevel from './components/FrameLevel.jsx';
import FixLevel from './components/FixLevel.jsx';
import PickLevel from './components/PickLevel.jsx';
import ZoneComplete from './components/ZoneComplete.jsx';
import GameComplete from './components/GameComplete.jsx';
import AboutOverlay from './components/AboutOverlay.jsx';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [showZoneComplete, setShowZoneComplete] = useState(null);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [streakBump, setStreakBump] = useState(false);
  const hintTimerRef = useRef(null);
  const levelStartRef = useRef(Date.now());

  const level = LEVELS.find((l) => l.id === currentLevel);
  const zoneIndex = getZoneForLevel(currentLevel);
  const totalLevels = LEVELS.length;

  useEffect(() => {
    setShowReveal(false);
    setHintVisible(false);
    levelStartRef.current = Date.now();

    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setHintVisible(true);
    }, 10000);

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [currentLevel]);

  const handleCorrect = useCallback(() => {
    setShowReveal(true);
    setStreak((s) => s + 1);
    setStreakBump(true);
    setTimeout(() => setStreakBump(false), 300);
    setCompletedLevels((prev) => new Set([...prev, currentLevel]));
  }, [currentLevel]);

  const handleWrong = useCallback(() => {
    setStreak(0);
  }, []);

  const handleNext = useCallback(() => {
    if (level.isGameEnd) {
      setShowGameComplete(true);
      return;
    }

    if (isLastLevelInZone(currentLevel)) {
      setShowZoneComplete(zoneIndex);
      return;
    }

    const nextId = currentLevel + 1;
    if (nextId <= totalLevels) {
      setCurrentLevel(nextId);
    }
  }, [currentLevel, level, zoneIndex, totalLevels]);

  const handleZoneContinue = useCallback(() => {
    setShowZoneComplete(null);
    const nextId = currentLevel + 1;
    if (nextId <= totalLevels) {
      setCurrentLevel(nextId);
    }
  }, [currentLevel, totalLevels]);

  const handleRestart = useCallback(() => {
    setCurrentLevel(1);
    setStreak(0);
    setCompletedLevels(new Set());
    setShowReveal(false);
    setShowGameComplete(false);
    setShowZoneComplete(null);
  }, []);

  const goToZone = useCallback((zi) => {
    const [start] = ZONE_LEVEL_RANGES[zi];
    setCurrentLevel(start);
    setShowReveal(false);
  }, []);

  const [showHintText, setShowHintText] = useState(false);

  if (!level) return null;

  const progressPct = ((currentLevel - 1) / totalLevels) * 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0D1117' }}
    >
      {/* Top bar */}
      <header className="px-4 pt-4 pb-2">
        {/* Zone dots */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1.5">
            {ZONE_LEVEL_RANGES.map((range, zi) => {
              const zoneComplete = range[1] <= Math.max(...completedLevels, 0);
              const isCurrent = zi === zoneIndex;
              return (
                <button
                  key={zi}
                  onClick={() => zoneComplete ? goToZone(zi) : null}
                  className="w-5 h-5 rounded-full transition-all flex items-center justify-center"
                  style={{
                    backgroundColor: zoneComplete
                      ? '#68D391'
                      : isCurrent
                        ? '#F6AD55'
                        : '#2D3748',
                    cursor: zoneComplete ? 'pointer' : 'default',
                    boxShadow: isCurrent ? '0 0 8px rgba(246, 173, 85, 0.5)' : 'none',
                  }}
                  title={ZONE_NAMES[zi]}
                >
                  {zoneComplete && (
                    <span className="text-xs" style={{ color: '#0D1117' }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Streak + About */}
          <div className="flex items-center gap-3">
            <div
              className={`font-mono font-bold text-sm ${streakBump ? 'animate-streak-bump' : ''}`}
              style={{ color: streak > 0 ? '#F6AD55' : '#4A5568' }}
            >
              🔥 {streak}
            </div>
            <button
              onClick={() => setShowAbout(true)}
              className="text-lg transition-opacity hover:opacity-80"
              style={{ color: '#A0AEC0' }}
            >
              ℹ️
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: '#2D3748' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              backgroundColor: '#F6AD55',
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Level header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-medium"
              style={{ color: '#4A5568' }}
            >
              Level {currentLevel} of {totalLevels}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#2D3748', color: '#A0AEC0' }}
            >
              {ZONE_NAMES[zoneIndex]}
            </span>
          </div>

          {level.newConcept && (
            <span
              className="inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2"
              style={{
                backgroundColor: 'rgba(246, 173, 85, 0.15)',
                color: '#F6AD55',
              }}
            >
              NEW: {level.newConcept}
            </span>
          )}

          <p
            className="text-lg font-medium leading-snug"
            style={{ color: '#E2E8F0' }}
          >
            {level.brief}
          </p>
        </div>

        {/* Level content */}
        <div>
          {level.type === 'frame' && (
            <FrameLevel
              key={level.id}
              level={level}
              onCorrect={handleCorrect}
              showReveal={showReveal}
            />
          )}
          {level.type === 'fix' && (
            <FixLevel
              key={level.id}
              level={level}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              showReveal={showReveal}
            />
          )}
          {level.type === 'pick' && (
            <PickLevel
              key={level.id}
              level={level}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              showReveal={showReveal}
            />
          )}
        </div>

        {/* Correct indicator + Next button */}
        {showReveal && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-lg font-bold"
                style={{ color: '#68D391' }}
              >
                ✓ Correct
              </span>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#F6AD55',
                color: '#0D1117',
              }}
            >
              {level.isGameEnd ? 'Finish' : 'Next →'}
            </button>
          </div>
        )}

        {/* Hint */}
        {!showReveal && (
          <div className="mt-6">
            {hintVisible ? (
              showHintText ? (
                <div
                  className="text-sm px-3 py-2 rounded-lg animate-fade-in"
                  style={{
                    backgroundColor: 'rgba(246, 173, 85, 0.08)',
                    border: '1px solid rgba(246, 173, 85, 0.2)',
                    color: '#F6AD55',
                  }}
                >
                  💡 {level.hint}
                </div>
              ) : (
                <button
                  onClick={() => setShowHintText(true)}
                  className="text-sm px-3 py-2 rounded-lg transition-all hover:opacity-80"
                  style={{ color: '#A0AEC0' }}
                >
                  💡 Need a hint?
                </button>
              )
            ) : null}
          </div>
        )}
      </main>

      {/* Overlays */}
      {showZoneComplete !== null && (
        <ZoneComplete
          reward={ZONE_REWARDS[showZoneComplete]}
          onContinue={handleZoneContinue}
        />
      )}

      {showGameComplete && (
        <GameComplete
          totalLevels={totalLevels}
          streak={streak}
          onRestart={handleRestart}
        />
      )}

      {showAbout && (
        <AboutOverlay onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}
