import { useState, useEffect } from 'react';
import CharacterPortrait, { CHARACTER_NAMES, CHARACTER_ROLES, CHARACTER_COLORS } from './CharacterPortrait.jsx';
import SceneBackground from './SceneBackground.jsx';
import { CHAPTER_BACKGROUNDS } from '../scenes.js';

const ROLE_MISSIONS = {
  robin: "I align every department. If a camera isn't accounted for, the whole pipeline breaks.",
  morgan: "I'm the bridge between set and post. Every camera, every look, every frame runs through me.",
  quinn: "If the VFX plates are wrong, we burn time and budget. I make sure Nuke gets what it needs.",
  sage: "I know every byte of the FDL spec. When the pipeline breaks, I find out why.",
};

const ROLE_TOOLS = {
  robin: ['MPS Portal', 'Camera Format Config', 'Delivery Specs'],
  morgan: ['Silverstack / Pomfort', 'LiveGrade', 'FDL Creator'],
  quinn: ['Nuke', 'DaVinci Resolve', 'VFX Pull Pipeline'],
  sage: ['pyfdl', 'JSON Validators', 'FDL Spec'],
};

const PIPELINE_STEPS = [
  { character: 'robin', label: 'Configure', short: 'Config' },
  { character: 'morgan', label: 'Create', short: 'Create' },
  { character: 'quinn', label: 'Consume', short: 'Consume' },
  { character: 'sage', label: 'Validate', short: 'Validate' },
];

export default function StageIntro({ chapterIndex, onContinue, completedChapters = [] }) {
  const [phase, setPhase] = useState(0);

  const character = PIPELINE_STEPS[chapterIndex].character;
  const colors = CHARACTER_COLORS[character];
  const bg = CHAPTER_BACKGROUNDS[chapterIndex];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={phase >= 3 ? onContinue : undefined}>
      <SceneBackground scene={bg} />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 70%, transparent 20%, ${colors.bg}E0 70%)`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Character portrait */}
        <div
          className={`mb-6 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div
            className="p-2"
            style={{
              border: `3px solid ${colors.primary}`,
              background: colors.bg,
              boxShadow: `0 0 30px ${colors.primary}40, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            <CharacterPortrait character={character} expression="neutral" size="xxl" />
          </div>
        </div>

        {/* Name and role */}
        <div
          className={`text-center mb-6 transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <h2
            className="pixel-header-lg mb-2"
            style={{ color: '#FFF8E7', textShadow: `2px 2px 0 ${colors.bg}` }}
          >
            {CHARACTER_NAMES[character]}
          </h2>
          <p
            className="font-pixel text-xs tracking-wider"
            style={{ color: colors.primary }}
          >
            {CHARACTER_ROLES[character]}
          </p>
        </div>

        {/* Mission statement */}
        <div
          className={`max-w-sm text-center mb-8 transition-all duration-700 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: '#f5f0e1CC' }}
          >
            "{ROLE_MISSIONS[character]}"
          </p>
        </div>

        {/* Tools strip */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {ROLE_TOOLS[character].map((tool) => (
            <span
              key={tool}
              className="text-xs px-3 py-1.5 font-mono"
              style={{
                color: colors.primary,
                border: `1px solid ${colors.primary}60`,
                background: `${colors.primary}15`,
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Pipeline position */}
        <div
          className={`w-full max-w-md mb-8 transition-all duration-700 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="flex items-center justify-between">
            {PIPELINE_STEPS.map((step, i) => {
              const isActive = i === chapterIndex;
              const isDone = completedChapters.includes(i);
              const stepColor = CHARACTER_COLORS[step.character].primary;

              return (
                <div key={step.character} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className="w-8 h-8 flex items-center justify-center text-xs font-bold mb-1 transition-all"
                      style={{
                        background: isActive ? stepColor : isDone ? `${stepColor}80` : 'rgba(255,255,255,0.1)',
                        border: `2px solid ${isActive ? stepColor : isDone ? stepColor : 'rgba(255,255,255,0.2)'}`,
                        color: isActive || isDone ? '#FFF8E7' : 'rgba(255,255,255,0.3)',
                        boxShadow: isActive ? `0 0 12px ${stepColor}60` : 'none',
                      }}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span
                      className="text-[9px] font-pixel"
                      style={{ color: isActive ? '#FFF8E7' : 'rgba(255,255,255,0.4)' }}
                    >
                      {step.short}
                    </span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div
                      className="h-0.5 flex-shrink-0 mx-1"
                      style={{
                        width: '16px',
                        background: i < chapterIndex ? stepColor : 'rgba(255,255,255,0.15)',
                        marginBottom: '18px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Enter button */}
        <div
          className={`transition-all duration-500 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <button
            onClick={onContinue}
            className="btn-primary px-8 py-3 font-pixel text-[10px] animate-stage-pulse"
          >
            ENTER STAGE
          </button>
        </div>
      </div>
    </div>
  );
}
