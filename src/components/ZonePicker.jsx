import {
  ZONE_NAMES,
  ZONE_DESCRIPTIONS,
  ZONE_EMOJIS,
  ZONE_LEVEL_RANGES,
  LEVELS,
  getZoneCompletedCount,
  getZoneLevelCount,
  isZoneComplete,
} from '../levels.js';

export default function ZonePicker({ completedLevels, currentLevel, onSelectLevel, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.94)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl max-w-md w-full animate-slide-up overflow-y-auto"
        style={{
          backgroundColor: '#1C2333',
          border: '1px solid #2D3748',
          maxHeight: 'calc(100vh - 2rem)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 pb-3 sticky top-0" style={{ backgroundColor: '#1C2333', zIndex: 1 }}>
          <h2 className="text-lg font-bold" style={{ color: '#E2E8F0' }}>
            Choose a Level
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors"
            style={{ color: '#A0AEC0' }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {ZONE_LEVEL_RANGES.map(([start, end], zi) => {
            const completed = getZoneCompletedCount(zi, completedLevels);
            const total = getZoneLevelCount(zi);
            const zoneIsDone = isZoneComplete(zi, completedLevels);

            return (
              <div key={zi}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{ZONE_EMOJIS[zi]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-semibold truncate"
                        style={{ color: zoneIsDone ? '#68D391' : '#E2E8F0' }}
                      >
                        {ZONE_NAMES[zi]}
                      </span>
                      <span
                        className="text-xs font-mono shrink-0"
                        style={{ color: zoneIsDone ? '#68D391' : '#4A5568' }}
                      >
                        {completed}/{total}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: '#4A5568' }}>
                      {ZONE_DESCRIPTIONS[zi]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {Array.from({ length: end - start + 1 }, (_, i) => {
                    const levelId = start + i;
                    const level = LEVELS.find((l) => l.id === levelId);
                    const isDone = completedLevels.has(levelId);
                    const isCurrent = levelId === currentLevel;
                    const typeLabel = level?.type === 'frame' ? 'A' : level?.type === 'fix' ? 'B' : 'C';

                    return (
                      <button
                        key={levelId}
                        onClick={() => onSelectLevel(levelId)}
                        className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all hover:scale-105 active:scale-95"
                        style={{
                          backgroundColor: isCurrent
                            ? 'rgba(246, 173, 85, 0.15)'
                            : isDone
                              ? 'rgba(104, 211, 145, 0.08)'
                              : 'rgba(45, 55, 72, 0.3)',
                          border: `1.5px solid ${
                            isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#2D3748'
                          }`,
                          cursor: 'pointer',
                          minWidth: 0,
                        }}
                      >
                        <span
                          className="text-sm font-bold font-mono"
                          style={{
                            color: isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#A0AEC0',
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-[9px] font-mono"
                          style={{
                            color: isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#4A5568',
                          }}
                        >
                          {typeLabel}
                        </span>
                        {isDone && (
                          <span className="text-[10px]" style={{ color: '#68D391', lineHeight: 1 }}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
