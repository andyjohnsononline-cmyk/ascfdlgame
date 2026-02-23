import { useMemo } from 'react';
import {
  ZONE_NAMES,
  ZONE_EMOJIS,
  ZONE_LEVEL_RANGES,
  LEVELS,
  getZoneCompletedCount,
  getZoneLevelCount,
  isZoneComplete,
} from '../levels.js';

const ZONE_CLUSTERS = [
  // Zone 1 – Post Supervisor (top-left)
  [
    { x: 130, y: 155 },
    { x: 210, y: 120 },
    { x: 280, y: 160 },
    { x: 260, y: 240 },
    { x: 175, y: 265 },
    { x: 115, y: 220 },
  ],
  // Zone 2 – DIT (top-right)
  [
    { x: 520, y: 140 },
    { x: 595, y: 110 },
    { x: 675, y: 135 },
    { x: 690, y: 215 },
    { x: 615, y: 255 },
    { x: 530, y: 225 },
  ],
  // Zone 3 – VFX Supervisor (bottom-left)
  [
    { x: 110, y: 505 },
    { x: 190, y: 475 },
    { x: 265, y: 510 },
    { x: 255, y: 590 },
    { x: 170, y: 620 },
    { x: 100, y: 575 },
  ],
  // Zone 4 – FDL Expert (bottom-right)
  [
    { x: 530, y: 490 },
    { x: 610, y: 465 },
    { x: 685, y: 495 },
    { x: 695, y: 575 },
    { x: 620, y: 610 },
    { x: 535, y: 565 },
  ],
];

const ZONE_CENTERS = [
  { x: 195, y: 193 },
  { x: 604, y: 180 },
  { x: 182, y: 546 },
  { x: 612, y: 533 },
];

const ZONE_LABEL_POS = [
  { x: 195, y: 310 },
  { x: 604, y: 300 },
  { x: 182, y: 665 },
  { x: 612, y: 655 },
];

const CROSS_LINKS = [
  [0, 3],
  [1, 4],
  [0, 4],
  [1, 3],
];

function bezierPath(x1, y1, x2, y2, curveFactor = 0.25) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * curveFactor;
  const cy = my + dx * curveFactor;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function ZonePicker({ completedLevels, currentLevel, onSelectLevel, onClose, isLanding = false }) {
  const stars = useMemo(() => {
    const result = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 100; i++) {
      result.push({
        x: rand() * 800,
        y: rand() * 780,
        r: 0.4 + rand() * 1.2,
        opacity: 0.06 + rand() * 0.2,
      });
    }
    return result;
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in"
      style={{ backgroundColor: 'rgba(8, 10, 15, 0.98)' }}
      onClick={isLanding ? undefined : onClose}
    >
      {!isLanding && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all hover:scale-110"
          style={{ color: '#A0AEC0', backgroundColor: 'rgba(45, 55, 72, 0.5)' }}
        >
          ✕
        </button>
      )}

      <div className="absolute top-4 left-4 z-10">
        {isLanding ? (
          <div className="animate-fade-in">
            <h1
              className="text-lg font-bold tracking-wide"
              style={{ color: '#E2E8F0', textShadow: '0 0 30px rgba(246, 173, 85, 0.3)' }}
            >
              Frame It
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>
              The ASC FDL Learning Game
            </p>
          </div>
        ) : (
          <h2
            className="text-sm font-bold tracking-wide uppercase"
            style={{ color: '#4A5568' }}
          >
            Choose a Role
          </h2>
        )}
      </div>

      {isLanding && (
        <div
          className="absolute bottom-6 left-0 right-0 text-center z-10 animate-fade-in"
          style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
        >
          <p className="text-sm font-medium" style={{ color: '#A0AEC0' }}>
            Tap any level to begin
          </p>
        </div>
      )}

      <svg
        viewBox="0 0 800 780"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={(e) => e.stopPropagation()}
      >
        <defs>
          <filter id="glow-amber" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>

          {ZONE_CENTERS.map((c, zi) => (
            <radialGradient
              key={zi}
              id={`nebula-${zi}`}
              cx={c.x}
              cy={c.y}
              r="160"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor={isZoneComplete(zi, completedLevels) ? '#68D391' : '#EDAB68'}
                stopOpacity="0.12"
              />
              <stop
                offset="50%"
                stopColor={isZoneComplete(zi, completedLevels) ? '#68D391' : '#EDAB68'}
                stopOpacity="0.04"
              />
              <stop
                offset="100%"
                stopColor={isZoneComplete(zi, completedLevels) ? '#68D391' : '#EDAB68'}
                stopOpacity="0"
              />
            </radialGradient>
          ))}
        </defs>

        {/* Star-field */}
        {stars.map((s, i) => (
          <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r} fill="#E2E8F0" opacity={s.opacity} />
        ))}

        {/* Nebula glow behind each zone */}
        {ZONE_CENTERS.map((c, zi) => (
          <circle key={`neb${zi}`} cx={c.x} cy={c.y} r={160} fill={`url(#nebula-${zi})`} />
        ))}

        {/* Workflow flow lines between zones (top-left→top-right, top-left→bottom-left, etc.) */}
        {/* Horizontal: Zone 1 → Zone 2 */}
        <path
          d={bezierPath(280, 200, 520, 185, 0.08)}
          fill="none"
          stroke="#2D3748"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        {/* Vertical: Zone 1 → Zone 3 */}
        <path
          d={bezierPath(195, 270, 182, 470, 0.08)}
          fill="none"
          stroke="#2D3748"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        {/* Horizontal: Zone 3 → Zone 4 */}
        <path
          d={bezierPath(265, 555, 530, 535, 0.08)}
          fill="none"
          stroke="#2D3748"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        {/* Vertical: Zone 2 → Zone 4 */}
        <path
          d={bezierPath(610, 260, 615, 460, 0.08)}
          fill="none"
          stroke="#2D3748"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        {/* Diagonal: Zone 2 → Zone 3 */}
        <path
          d={bezierPath(530, 230, 265, 500, -0.06)}
          fill="none"
          stroke="#2D3748"
          strokeWidth="0.8"
          strokeDasharray="4 6"
          opacity="0.2"
        />

        {/* Workflow labels on connectors */}
        <text x="400" y="375" textAnchor="middle" fill="#2D3748" fontSize="10" fontFamily="'IBM Plex Sans', sans-serif" fontWeight="600" opacity="0.6">
          PRODUCTION WORKFLOW
        </text>

        {/* Per-zone groups */}
        {ZONE_CLUSTERS.map((zone, zi) => {
          const [start] = ZONE_LEVEL_RANGES[zi];
          const zoneDone = isZoneComplete(zi, completedLevels);
          const completed = getZoneCompletedCount(zi, completedLevels);
          const total = getZoneLevelCount(zi);
          const labelPos = ZONE_LABEL_POS[zi];
          const pathColor = zoneDone ? '#68D391' : '#4A5568';
          const pathOpacity = zoneDone ? 0.55 : 0.3;

          return (
            <g
              key={`zone${zi}`}
              className="constellation-zone"
              style={{ animationDelay: `${zi * 0.08}s` }}
            >
              {/* Sequential intra-zone paths */}
              {zone.slice(0, -1).map((node, ni) => {
                const next = zone[ni + 1];
                return (
                  <path
                    key={`p${zi}-${ni}`}
                    d={bezierPath(node.x, node.y, next.x, next.y, ni % 2 === 0 ? 0.25 : -0.25)}
                    fill="none"
                    stroke={pathColor}
                    strokeWidth="1.5"
                    opacity={pathOpacity}
                  />
                );
              })}

              {/* Cross-link path */}
              {(() => {
                const [a, b] = CROSS_LINKS[zi];
                return (
                  <path
                    d={bezierPath(zone[a].x, zone[a].y, zone[b].x, zone[b].y, -0.15)}
                    fill="none"
                    stroke={pathColor}
                    strokeWidth="0.8"
                    strokeDasharray="3 3"
                    opacity={zoneDone ? 0.35 : 0.12}
                  />
                );
              })()}

              {/* Zone label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                fill={zoneDone ? '#68D391' : '#A0AEC0'}
                fontSize="12"
                fontFamily="'IBM Plex Sans', sans-serif"
                fontWeight="600"
                opacity="0.9"
              >
                {ZONE_EMOJIS[zi]} {ZONE_NAMES[zi]}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 16}
                textAnchor="middle"
                fill={zoneDone ? '#68D391' : '#4A5568'}
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
              >
                {completed}/{total}
              </text>

              {/* Level nodes */}
              {zone.map((node, ni) => {
                const levelId = start + ni;
                const level = LEVELS.find((l) => l.id === levelId);
                const isDone = completedLevels.has(levelId);
                const isCurrent = levelId === currentLevel;
                const typeLabel =
                  level?.type === 'frame' ? 'A' : level?.type === 'fix' ? 'B' : 'C';

                const fill = isCurrent ? '#EDAB68' : isDone ? '#68D391' : '#161E2C';
                const stroke = isCurrent ? '#EDAB68' : isDone ? '#68D391' : '#4A5568';
                const filterAttr = isCurrent
                  ? 'url(#glow-amber)'
                  : isDone
                    ? 'url(#glow-green)'
                    : 'url(#node-shadow)';
                const textFill = isCurrent || isDone ? '#0D1117' : '#A0AEC0';

                return (
                  <g
                    key={levelId}
                    className="constellation-node"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLevel(levelId);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill="none"
                        stroke="#EDAB68"
                        strokeWidth="1.5"
                      >
                        <animate
                          attributeName="r"
                          values="20;30;20"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.5;0;0.5"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    <circle cx={node.x} cy={node.y} r={24} fill="transparent" />

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isCurrent ? 2.5 : 1.5}
                      filter={filterAttr}
                      opacity={isDone || isCurrent ? 1 : 0.75}
                    />

                    <text
                      x={node.x}
                      y={node.y + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textFill}
                      fontSize="11"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="700"
                      style={{ pointerEvents: 'none' }}
                    >
                      {ni + 1}
                    </text>

                    <text
                      x={node.x}
                      y={node.y + 28}
                      textAnchor="middle"
                      fill={isCurrent ? '#EDAB68' : isDone ? '#68D391' : '#4A5568'}
                      fontSize="8"
                      fontFamily="'JetBrains Mono', monospace"
                      style={{ pointerEvents: 'none' }}
                      opacity="0.7"
                    >
                      {typeLabel}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
