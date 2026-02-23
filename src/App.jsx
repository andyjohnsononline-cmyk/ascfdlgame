import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LEVELS,
  ZONE_NAMES,
  ZONE_REWARDS,
  ZONE_LEVEL_RANGES,
  getZoneForLevel,
  isLastLevelInZone,
  getZoneLevelCount,
  getZoneCompletedCount,
  getFirstIncompleteLevelInZone,
  getLevelIndexInZone,
  isZoneComplete,
} from './levels.js';
import FrameLevel from './components/FrameLevel.jsx';
import FixLevel from './components/FixLevel.jsx';
import PickLevel from './components/PickLevel.jsx';
import ZoneComplete from './components/ZoneComplete.jsx';
import GameComplete from './components/GameComplete.jsx';
import AboutOverlay from './components/AboutOverlay.jsx';
import ZonePicker from './components/ZonePicker.jsx';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [showZoneComplete, setShowZoneComplete] = useState(null);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [streakBump, setStreakBump] = useState(false);
  const [showHintText, setShowHintText] = useState(false);
  const hintTimerRef = useRef(null);

  const level = LEVELS.find((l) => l.id === currentLevel);
  const zoneIndex = getZoneForLevel(currentLevel);
  const totalLevels = LEVELS.length;

  useEffect(() => {
    setShowReveal(false);
    setHintVisible(false);
    setShowHintText(false);

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
    setStreak((s) => {
      const next = s + 1;
      setBestStreak((b) => Math.max(b, next));
      return next;
    });
    setStreakBump(true);
    setTimeout(() => setStreakBump(false), 300);
    setCompletedLevels((prev) => {
      const next = new Set([...prev, currentLevel]);
      if (next.size === totalLevels) {
        setTimeout(() => setShowGameComplete(true), 600);
      }
      return next;
    });
  }, [currentLevel, totalLevels]);

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
    const nextZone = zoneIndex + 1;
    if (nextZone < ZONE_LEVEL_RANGES.length) {
      const nextLevelId = getFirstIncompleteLevelInZone(nextZone, completedLevels);
      setCurrentLevel(nextLevelId);
    }
  }, [zoneIndex, completedLevels]);

  const handleRestart = useCallback(() => {
    setShowGameComplete(false);
    setCurrentLevel(1);
    setCompletedLevels(new Set());
    setStreak(0);
    setBestStreak(0);
  }, []);

  const handleSelectLevel = useCallback((levelId) => {
    setCurrentLevel(levelId);
    setShowReveal(false);
    setShowZonePicker(false);
    setHasStarted(true);
  }, []);

  if (!level) return null;

  const zoneLevelCount = getZoneLevelCount(zoneIndex);
  const zoneLevelIndex = getLevelIndexInZone(currentLevel);
  const zoneCompleted = getZoneCompletedCount(zoneIndex, completedLevels);
  const zoneProgressPct = (zoneCompleted / zoneLevelCount) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          {/* Zone dots */}
          <button
            className="flex items-center gap-2.5"
            onClick={() => setShowZonePicker(true)}
            title="Choose a level"
          >
            {ZONE_LEVEL_RANGES.map((_, zi) => {
              const complete = isZoneComplete(zi, completedLevels);
              const partial = !complete && getZoneCompletedCount(zi, completedLevels) > 0;
              const isCurrent = zi === zoneIndex;
              const dotColor = complete
                ? '#68D391'
                : partial || isCurrent
                  ? '#EDAB68'
                  : '#2D3748';
              return (
                <span
                  key={zi}
                  className={`block w-3 h-3 rounded-full transition-all ${
                    isCurrent ? 'animate-zone-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: dotColor,
                    cursor: 'pointer',
                    transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                    opacity: !complete && !partial && !isCurrent ? 0.4 : 1,
                    boxShadow: isCurrent
                      ? `0 0 10px ${dotColor}, 0 0 4px ${dotColor}`
                      : complete
                        ? `0 0 6px ${dotColor}40`
                        : 'none',
                  }}
                  title={ZONE_NAMES[zi]}
                />
              );
            })}
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`font-mono font-bold text-sm ${streakBump ? 'animate-streak-bump' : ''}`}
              style={{
                color: streak > 0 ? '#EDAB68' : '#4A5568',
                textShadow: streak > 0 ? '0 0 12px rgba(237, 171, 104, 0.4)' : 'none',
              }}
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

        {/* Per-zone progress bar */}
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(45, 55, 72, 0.5)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 relative"
            style={{
              width: `${zoneProgressPct}%`,
              background: 'linear-gradient(90deg, #EDAB68 0%, #F0C78E 100%)',
              boxShadow: zoneProgressPct > 0 ? '4px 0 12px rgba(237, 171, 104, 0.5)' : 'none',
            }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Level card */}
        <div className="glass-card p-5 mb-4 animate-glass-appear">
          {/* Level header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: '#4A5568' }}
              >
                Level {currentLevel} of {totalLevels}
              </span>
              <span
                className="text-xs"
                style={{ color: '#2D3748' }}
              >
                •
              </span>
              <button
                onClick={() => setShowZonePicker(true)}
                className="text-xs font-medium hover:opacity-80 transition-opacity tracking-wide"
                style={{ color: '#4A5568', cursor: 'pointer' }}
              >
                {ZONE_NAMES[zoneIndex]}
              </button>
            </div>

            {level.newConcept && (
              <span
                className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                style={{
                  background: 'rgba(237, 171, 104, 0.12)',
                  color: '#EDAB68',
                  border: '1px solid rgba(237, 171, 104, 0.2)',
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
        </div>

        {/* Correct indicator + Next button */}
        {showReveal && (
          <div className="mt-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-lg font-bold"
                style={{ color: '#68D391', textShadow: '0 0 12px rgba(104, 211, 145, 0.3)' }}
              >
                ✓ Correct
              </span>
            </div>
            <button
              onClick={handleNext}
              className="btn-primary w-full py-3.5 text-lg"
            >
              {level.isGameEnd
                ? 'Finish'
                : isLastLevelInZone(currentLevel)
                  ? 'Complete Zone'
                  : 'Next →'}
            </button>
          </div>
        )}

        {/* Hint */}
        {!showReveal && (
          <div className="mt-5">
            {hintVisible ? (
              showHintText ? (
                <div
                  className="glass-card-subtle text-sm px-4 py-3 animate-fade-in"
                  style={{
                    borderColor: 'rgba(237, 171, 104, 0.15)',
                    color: '#EDAB68',
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
          streak={bestStreak}
          onRestart={handleRestart}
        />
      )}

      {showZonePicker && (
        <ZonePicker
          completedLevels={completedLevels}
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowZonePicker(false)}
          isLanding={!hasStarted}
        />
      )}

      {showAbout && (
        <AboutOverlay onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}
