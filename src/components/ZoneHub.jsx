import {
  ZONE_NAMES,
  ZONE_DESCRIPTIONS,
  ZONE_EMOJIS,
  ZONE_LEVEL_RANGES,
  getZoneLevelCount,
  getZoneCompletedCount,
  isZoneComplete,
} from '../levels.js';

export default function ZoneHub({ completedLevels, onEnterZone, streak }) {
  const allZonesComplete = ZONE_LEVEL_RANGES.every((_, zi) =>
    isZoneComplete(zi, completedLevels)
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0D1117' }}
    >
      <header className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between">
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: '#E2E8F0' }}
          >
            FRAME IT
          </h1>
          <div
            className="font-mono font-bold text-sm"
            style={{ color: streak > 0 ? '#F6AD55' : '#4A5568' }}
          >
            🔥 {streak}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <h2
          className="text-sm font-medium mb-4 uppercase tracking-wider"
          style={{ color: '#A0AEC0' }}
        >
          Choose a Track
        </h2>

        <div className="flex flex-col gap-3">
          {ZONE_LEVEL_RANGES.map((_, zi) => {
            const total = getZoneLevelCount(zi);
            const done = getZoneCompletedCount(zi, completedLevels);
            const complete = isZoneComplete(zi, completedLevels);
            const pct = (done / total) * 100;

            return (
              <button
                key={zi}
                onClick={() => onEnterZone(zi)}
                className="w-full text-left rounded-xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  backgroundColor: '#1C2333',
                  border: `1px solid ${complete ? '#68D391' : '#2D3748'}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{ZONE_EMOJIS[zi]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-base"
                        style={{ color: '#E2E8F0' }}
                      >
                        {ZONE_NAMES[zi]}
                      </span>
                      {complete && (
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: 'rgba(104, 211, 145, 0.15)',
                            color: '#68D391',
                          }}
                        >
                          ✓ Complete
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: '#A0AEC0' }}
                    >
                      {ZONE_DESCRIPTIONS[zi]}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5">
                      <div
                        className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#2D3748' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: complete ? '#68D391' : '#F6AD55',
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-mono tabular-nums"
                        style={{ color: '#A0AEC0' }}
                      >
                        {done}/{total}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {allZonesComplete && (
          <div
            className="mt-6 text-center p-4 rounded-xl animate-fade-in"
            style={{
              backgroundColor: 'rgba(104, 211, 145, 0.08)',
              border: '1px solid rgba(104, 211, 145, 0.2)',
            }}
          >
            <span className="text-3xl">🏆</span>
            <p
              className="text-lg font-bold mt-2"
              style={{ color: '#68D391' }}
            >
              FDL CERTIFIED
            </p>
            <p className="text-sm mt-1" style={{ color: '#A0AEC0' }}>
              You understand the ASC Framing Decision List!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
