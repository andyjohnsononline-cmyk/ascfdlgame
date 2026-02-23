import CharacterPortrait, { CHARACTER_NAMES, CHARACTER_ROLES, CHARACTER_COLORS } from './CharacterPortrait.jsx';
import {
  CHAPTER_NAMES,
  CHAPTER_CHARACTERS,
  CHAPTER_BACKGROUNDS,
  CHAPTER_DESCRIPTIONS,
  CHAPTER_RANGES,
  CHAPTER_RESOURCES,
  RESOURCE_LINKS,
  getResourceById,
  getChapterCompletedCount,
  getChapterSceneCount,
  isChapterComplete,
  getFirstIncompleteSceneInChapter,
} from '../scenes.js';

const LOCATION_LABELS = {
  production_office: 'Production Office',
  on_set: 'On Set',
  vfx_suite: 'VFX Suite',
  control_room: 'Control Room',
};

const RESOURCE_CHARACTER_MAP = (() => {
  const map = {};
  CHAPTER_RESOURCES.forEach((ch, ci) => {
    ch.primary.forEach((resId) => {
      if (!map[resId]) map[resId] = [];
      map[resId].push(CHAPTER_CHARACTERS[ci]);
    });
  });
  return map;
})();

export default function ChapterSelect({ completedScenes, onSelectScene, onClose, onResetProgress, isLanding = false }) {
  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #4A7C59 30%, #3B5E3A 60%, #2D4A2C 100%)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        {isLanding ? (
          <div className="animate-pixel-fade">
            <h1
              className="pixel-header-lg mb-2"
              style={{ color: '#FFF8E7', textShadow: '3px 3px 0 #5D3A1A' }}
            >
              Frame It
            </h1>
            <p className="text-sm" style={{ color: '#B5D8A0' }}>
              The ASC FDL Learning Game
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2
              className="pixel-header"
              style={{ color: '#FFF8E7', textShadow: '2px 2px 0 #5D3A1A' }}
            >
              Choose a Chapter
            </h2>
            <button
              onClick={onClose}
              className="pixel-btn px-3 py-2 text-sm font-bold"
              style={{ color: '#3E2723', minWidth: '44px', minHeight: '44px' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Chapter grid */}
      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4">
        {CHAPTER_RANGES.map((_, ci) => {
          const character = CHAPTER_CHARACTERS[ci];
          const completed = getChapterCompletedCount(ci, completedScenes);
          const total = getChapterSceneCount(ci);
          const done = isChapterComplete(ci, completedScenes);
          const nextScene = getFirstIncompleteSceneInChapter(ci, completedScenes);
          const progressPct = (completed / total) * 100;

          return (
            <button
              key={ci}
              onClick={() => onSelectScene(nextScene)}
              className={`pixel-panel w-full text-left p-4 transition-all ${done ? '' : 'animate-chapter-pulse'}`}
              style={{
                borderColor: done ? '#4CAF50' : '#5D3A1A',
              }}
            >
              <div className="flex gap-3 items-start">
                <CharacterPortrait character={character} expression={done ? 'happy' : 'neutral'} size={56} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="pixel-header"
                      style={{
                        color: done ? '#4CAF50' : '#3E2723',
                        fontSize: '9px',
                      }}
                    >
                      Ch.{ci + 1}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: '#6D4C41' }}>
                      {LOCATION_LABELS[CHAPTER_BACKGROUNDS[ci]]}
                    </span>
                  </div>

                  <p className="text-sm font-bold mb-1" style={{ color: '#3E2723' }}>
                    {CHARACTER_NAMES[character]} — {CHARACTER_ROLES[character]}
                  </p>

                  <p className="text-xs mb-2" style={{ color: '#6D4C41' }}>
                    {CHAPTER_DESCRIPTIONS[ci]}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {CHAPTER_RESOURCES[ci].primary.map((resId) => {
                      const res = getResourceById(resId);
                      if (!res) return null;
                      return (
                        <a
                          key={resId}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 transition-opacity hover:opacity-80"
                          style={{
                            color: CHARACTER_COLORS[character].primary,
                            border: `1px solid ${CHARACTER_COLORS[character].primary}40`,
                            background: `${CHARACTER_COLORS[character].primary}10`,
                          }}
                        >
                          <span style={{ fontSize: '10px' }}>&#x1F4D6;</span>
                          {res.label}
                        </a>
                      );
                    })}
                  </div>

                  {/* Progress bar */}
                  <div className="pixel-progress">
                    <div
                      className="pixel-progress-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: done
                          ? 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)'
                          : 'linear-gradient(180deg, #E8A946 0%, #C48A2A 100%)',
                      }}
                    />
                  </div>
                  <p
                    className="text-xs font-mono mt-1"
                    style={{ color: done ? '#4CAF50' : '#8B6914' }}
                  >
                    {completed}/{total} {done ? '✓ COMPLETE' : ''}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {isLanding && (
          <p
            className="text-center text-sm mt-4 animate-fade-in"
            style={{ color: '#B5D8A0', animationDelay: '0.5s', animationFillMode: 'backwards' }}
          >
            Tap any chapter to begin
          </p>
        )}

        {/* Resources */}
        <div className="mt-8 pt-6" style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
          <h3
            className="pixel-header text-center mb-3"
            style={{ color: '#B5D8A0', fontSize: '8px' }}
          >
            Resources
          </h3>
          <div className="space-y-2">
            {RESOURCE_LINKS.map((link) => {
              const characters = RESOURCE_CHARACTER_MAP[link.id] || [];
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs px-3 py-2 transition-opacity hover:opacity-80"
                  style={{
                    color: '#B5D8A0',
                    border: '1px solid rgba(181, 216, 160, 0.2)',
                  }}
                >
                  <span className="flex-1">{link.label}</span>
                  <span className="flex gap-1">
                    {characters.map((char) => (
                      <span
                        key={char}
                        className="inline-block w-3 h-3"
                        style={{
                          backgroundColor: CHARACTER_COLORS[char].primary,
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                        title={CHARACTER_NAMES[char]}
                      />
                    ))}
                  </span>
                </a>
              );
            })}
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: 'rgba(181, 216, 160, 0.5)' }}>
            Colored squares show which character uses each resource
          </p>
        </div>

        {/* Reset progress */}
        {onResetProgress && completedScenes.size > 0 && (
          <div className="mt-6 text-center pb-4">
            <button
              onClick={() => {
                if (window.confirm('Reset all progress? This cannot be undone.')) {
                  onResetProgress();
                }
              }}
              className="text-xs px-4 py-2 transition-opacity hover:opacity-80"
              style={{ color: 'rgba(181, 216, 160, 0.5)' }}
            >
              Reset Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
