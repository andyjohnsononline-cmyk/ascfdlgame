import CharacterPortrait, { CHARACTER_NAMES, CHARACTER_ROLES, CHARACTER_COLORS } from './CharacterPortrait.jsx';

const ROLE_TOOLS = {
  robin: ['MPS Portal', 'Delivery Specs'],
  morgan: ['Silverstack', 'FDL Creator'],
  quinn: ['Nuke', 'Resolve'],
  sage: ['pyfdl', 'FDL Spec'],
};

export default function RoleContext({ character, taskContext }) {
  const colors = CHARACTER_COLORS[character];

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 mb-3"
      style={{
        background: `${colors.bg}90`,
        borderLeft: `3px solid ${colors.primary}`,
        borderBottom: `1px solid ${colors.primary}30`,
      }}
    >
      <div className="flex-shrink-0">
        <div
          className="p-0.5"
          style={{ border: `1px solid ${colors.primary}60`, background: colors.bg }}
        >
          <CharacterPortrait character={character} expression="neutral" size="env" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="font-pixel text-[9px] font-bold"
            style={{ color: colors.primary }}
          >
            {CHARACTER_NAMES[character]}
          </span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {CHARACTER_ROLES[character]}
          </span>
        </div>

        {taskContext && (
          <p className="text-[11px] leading-snug truncate" style={{ color: '#f5f0e1AA' }}>
            {taskContext}
          </p>
        )}
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {ROLE_TOOLS[character]?.map((tool) => (
          <span
            key={tool}
            className="text-[8px] px-1.5 py-0.5 font-mono whitespace-nowrap"
            style={{
              color: `${colors.primary}CC`,
              border: `1px solid ${colors.primary}30`,
              background: `${colors.primary}10`,
            }}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
