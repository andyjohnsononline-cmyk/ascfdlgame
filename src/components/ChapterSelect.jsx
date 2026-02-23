import CharacterPortrait, { CHARACTER_NAMES, CHARACTER_ROLES, CHARACTER_COLORS } from './CharacterPortrait.jsx';
import SceneBackground from './SceneBackground.jsx';
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

const ROLE_MISSIONS = {
  robin: 'Aligns every department and ensures all cameras are accounted for',
  morgan: 'The bridge between set and post — every frame runs through the DIT cart',
  quinn: 'Makes sure VFX plates are correct and the Nuke pipeline works',
  sage: 'Understands every byte of the spec and finds where pipelines break',
};

const ROLE_TOOLS_SHORT = {
  robin: ['MPS Portal', 'Delivery Specs'],
  morgan: ['Silverstack', 'FDL Creator'],
  quinn: ['Nuke', 'Resolve'],
  sage: ['pyfdl', 'FDL Spec'],
};

const PIPELINE_LABELS = ['Config', 'Create', 'Consume', 'Validate'];

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
        background: 'linear-gradient(180deg, #0a0a14 0%, #14141e 30%, #1a1a28 60%, #0e0e18 100%)',
      }}
    >
      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        {isLanding ? (
          <div className="animate-pixel-fade">
            <h1
              className="pixel-header-lg mb-2"
              style={{ color: '#FFF8E7', textShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
            >
              Frame It
            </h1>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,248,231,0.5)' }}>
              The ASC FDL Learning Game
            </p>

            {/* Pipeline overview */}
            <div className="flex items-center justify-center gap-1 mb-2">
              {CHAPTER_CHARACTERS.map((char, i) => {
                const color = CHARACTER_COLORS[char].primary;
                const done = isChapterComplete(i, completedScenes);
                return (
                  <div key={char} className="flex items-center">
                    <div
                      className="flex items-center gap-1 px-2 py-1"
                      style={{
                        border: `1px solid ${done ? color : `${color}40`}`,
                        background: done ? `${color}20` : 'transparent',
                        opacity: done ? 1 : 0.6,
                      }}
                    >
                      <span className="text-[9px] font-pixel" style={{ color }}>
                        {done ? '✓' : PIPELINE_LABELS[i]}
                      </span>
                    </div>
                    {i < 3 && (
                      <div
                        className="w-3 h-px"
                        style={{ background: done ? color : 'rgba(255,255,255,0.15)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2
              className="pixel-header"
              style={{ color: '#FFF8E7', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
            >
              Select Stage
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

      {/* Chapter cards */}
      <div className="px-4 pb-8 max-w-lg mx-auto space-y-4">
        {CHAPTER_RANGES.map((_, ci) => {
          const character = CHAPTER_CHARACTERS[ci];
          const completed = getChapterCompletedCount(ci, completedScenes);
          const total = getChapterSceneCount(ci);
          const done = isChapterComplete(ci, completedScenes);
          const nextScene = getFirstIncompleteSceneInChapter(ci, completedScenes);
          const progressPct = (completed / total) * 100;
          const colors = CHARACTER_COLORS[character];
          const bg = CHAPTER_BACKGROUNDS[ci];

          return (
            <button
              key={ci}
              onClick={() => onSelectScene(nextScene)}
              className="w-full text-left transition-all relative overflow-hidden"
              style={{
                border: `2px solid ${done ? '#4CAF50' : colors.primary}60`,
                background: colors.bg,
                boxShadow: done
                  ? '0 0 12px rgba(76, 175, 80, 0.2)'
                  : `0 0 12px ${colors.primary}15`,
              }}
            >
              {/* Environment backdrop */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <SceneBackground scene={bg} />
              </div>

              <div className="relative z-10 p-4">
                <div className="flex gap-3 items-start">
                  {/* Character portrait */}
                  <div className="flex-shrink-0">
                    <div
                      className="p-1"
                      style={{
                        border: `2px solid ${done ? '#4CAF50' : colors.primary}60`,
                        background: `${colors.bg}CC`,
                      }}
                    >
                      <CharacterPortrait character={character} expression={done ? 'happy' : 'neutral'} size="xl" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Stage number and location */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="pixel-header"
                        style={{
                          color: done ? '#4CAF50' : colors.primary,
                          fontSize: '9px',
                        }}
                      >
                        Stage {ci + 1}
                      </span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {LOCATION_LABELS[bg]}
                      </span>
                    </div>

                    {/* Name and role */}
                    <p className="text-sm font-bold mb-0.5" style={{ color: '#FFF8E7' }}>
                      {CHARACTER_NAMES[character]} — {CHARACTER_ROLES[character]}
                    </p>

                    {/* Mission statement */}
                    <p className="text-[11px] mb-2 italic" style={{ color: 'rgba(255,248,231,0.5)' }}>
                      {ROLE_MISSIONS[character]}
                    </p>

                    {/* Tools */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ROLE_TOOLS_SHORT[character].map((tool) => (
                        <span
                          key={tool}
                          className="text-[9px] px-1.5 py-0.5 font-mono"
                          style={{
                            color: `${colors.primary}CC`,
                            border: `1px solid ${colors.primary}30`,
                            background: `${colors.primary}10`,
                          }}
                        >
                          {tool}
                        </span>
                      ))}
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
                            className="text-[9px] px-1.5 py-0.5 font-mono transition-opacity hover:opacity-80"
                            style={{
                              color: `${colors.primary}AA`,
                              border: `1px solid ${colors.primary}20`,
                              background: `${colors.primary}08`,
                            }}
                          >
                            {res.label}
                          </a>
                        );
                      })}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] mb-2" style={{ color: 'rgba(255,248,231,0.4)' }}>
                      {CHAPTER_DESCRIPTIONS[ci]}
                    </p>

                    {/* Progress bar */}
                    <div className="pixel-progress" style={{ borderColor: `${colors.primary}40` }}>
                      <div
                        className="pixel-progress-fill"
                        style={{
                          width: `${progressPct}%`,
                          background: done
                            ? 'linear-gradient(180deg, #4CAF50 0%, #388E3C 100%)'
                            : `linear-gradient(180deg, ${colors.primary} 0%, ${colors.bg} 100%)`,
                        }}
                      />
                    </div>
                    <p
                      className="text-[10px] font-mono mt-1"
                      style={{ color: done ? '#4CAF50' : colors.primary }}
                    >
                      {completed}/{total} {done ? '✓ COMPLETE' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pipeline connector arrow */}
              {ci < 3 && (
                <div className="flex justify-center -mb-2 relative z-10">
                  <div
                    className="w-px h-4"
                    style={{
                      background: done
                        ? `linear-gradient(180deg, ${colors.primary}60, ${CHARACTER_COLORS[CHAPTER_CHARACTERS[ci + 1]].primary}60)`
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}

        {isLanding && (
          <p
            className="text-center text-sm mt-4 animate-fade-in"
            style={{ color: 'rgba(255,248,231,0.4)', animationDelay: '0.5s', animationFillMode: 'backwards' }}
          >
            Tap any stage to begin
          </p>
        )}

        {/* Resources */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <h3
            className="pixel-header text-center mb-3"
            style={{ color: 'rgba(255,248,231,0.3)', fontSize: '8px' }}
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
                    color: 'rgba(255,248,231,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
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
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                        title={CHARACTER_NAMES[char]}
                      />
                    ))}
                  </span>
                </a>
              );
            })}
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: 'rgba(255,248,231,0.25)' }}>
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
              style={{ color: 'rgba(255,248,231,0.3)' }}
            >
              Reset Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
