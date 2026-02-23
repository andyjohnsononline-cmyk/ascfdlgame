import { CHARACTER_COLORS } from './CharacterPortrait.jsx';

const STEPS = [
  { character: 'robin', label: 'Config', icon: '📋' },
  { character: 'morgan', label: 'Create', icon: '🎬' },
  { character: 'quinn', label: 'Consume', icon: '🎞' },
  { character: 'sage', label: 'Validate', icon: '🔍' },
];

export default function PipelineBar({ activeChapter, completedChapters = [] }) {
  return (
    <div className="flex items-center justify-center gap-0.5 py-1.5 px-2">
      {STEPS.map((step, i) => {
        const isActive = i === activeChapter;
        const isDone = completedChapters.includes(i);
        const color = CHARACTER_COLORS[step.character].primary;

        return (
          <div key={step.character} className="flex items-center">
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 transition-all"
              style={{
                background: isActive ? `${color}25` : 'transparent',
                border: `1px solid ${isActive ? color : isDone ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
                opacity: isActive ? 1 : isDone ? 0.8 : 0.4,
              }}
            >
              <span className="text-[10px]">{isDone ? '✓' : step.icon}</span>
              <span
                className="text-[8px] font-pixel hidden sm:inline"
                style={{ color: isActive ? color : isDone ? color : 'rgba(255,255,255,0.5)' }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-2 h-px mx-0.5"
                style={{
                  background: i < activeChapter ? color : 'rgba(255,255,255,0.15)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
