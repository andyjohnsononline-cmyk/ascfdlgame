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
  // Zone 1 – Ring / pentagon (top-left)
  [
    { x: 130, y: 85 },
    { x: 215, y: 85 },
    { x: 250, y: 155 },
    { x: 195, y: 215 },
    { x: 110, y: 195 },
    { x: 95, y: 130 },
  ],
  // Zone 2 – Arc / crescent (top-right)
  [
    { x: 535, y: 115 },
    { x: 585, y: 80 },
    { x: 645, y: 85 },
    { x: 700, y: 130 },
    { x: 680, y: 205 },
    { x: 600, y: 215 },
  ],
  // Zone 3 – Zigzag cluster (mid-left)
  [
    { x: 75, y: 375 },
    { x: 145, y: 395 },
    { x: 95, y: 445 },
    { x: 175, y: 465 },
    { x: 235, y: 435 },
    { x: 205, y: 375 },
  ],
  // Zone 4 – Diamond / triangular (mid-right)
  [
    { x: 575, y: 370 },
    { x: 660, y: 375 },
    { x: 700, y: 440 },
    { x: 645, y: 505 },
    { x: 555, y: 490 },
    { x: 535, y: 415 },
  ],
  // Zone 5 – W-scatter (bottom-left)
  [
    { x: 105, y: 640 },
    { x: 155, y: 690 },
    { x: 120, y: 740 },
    { x: 195, y: 715 },
    { x: 265, y: 745 },
    { x: 245, y: 675 },
  ],
  // Zone 6 – Hex cluster (bottom-right)
  [
    { x: 535, y: 670 },
    { x: 620, y: 660 },
    { x: 670, y: 715 },
    { x: 635, y: 775 },
    { x: 550, y: 775 },
    { x: 510, y: 720 },
  ],
];

const ZONE_CENTERS = [
  { x: 166, y: 144 },
  { x: 624, y: 138 },
  { x: 154, y: 414 },
  { x: 612, y: 432 },
  { x: 181, y: 701 },
  { x: 587, y: 719 },
];

const ZONE_LABEL_POS = [
  { x: 170, y: 258 },
  { x: 620, y: 260 },
  { x: 155, y: 510 },
  { x: 615, y: 550 },
  { x: 185, y: 792 },
  { x: 585, y: 822 },
];

const CROSS_LINKS = [
  [0, 3],
  [1, 5],
  [0, 4],
  [2, 5],
  [1, 4],
  [0, 3],
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

export default function ZonePicker({ completedLevels, currentLevel, onSelectLevel, onClose }) {
  const stars = useMemo(() => {
    const result = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 120; i++) {
      result.push({
        x: rand() * 800,
        y: rand() * 900,
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
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full text-xl transition-all hover:scale-110"
        style={{ color: '#A0AEC0', backgroundColor: 'rgba(45, 55, 72, 0.5)' }}
      >
        ✕
      </button>

      <div className="absolute top-4 left-4 z-10">
        <h2
          className="text-sm font-bold tracking-wide uppercase"
          style={{ color: '#4A5568' }}
        >
          Star Map
        </h2>
      </div>

      <svg
        viewBox="0 0 800 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onClick={(e) => e.stopPropagation()}
      >
        <defs>
          <filter id="glow-amber" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-green" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {ZONE_CENTERS.map((c, zi) => (
            <radialGradient
              key={zi}
              id={`nebula-${zi}`}
              cx={c.x}
              cy={c.y}
              r="130"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor={isZoneComplete(zi, completedLevels) ? '#68D391' : '#F6AD55'}
                stopOpacity="0.07"
              />
              <stop
                offset="100%"
                stopColor={isZoneComplete(zi, completedLevels) ? '#68D391' : '#F6AD55'}
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
          <circle key={`neb${zi}`} cx={c.x} cy={c.y} r={130} fill={`url(#nebula-${zi})`} />
        ))}

        {/* Inter-zone dashed connectors */}
        {ZONE_CLUSTERS.slice(0, -1).map((zone, zi) => {
          const from = zone[zone.length - 1];
          const to = ZONE_CLUSTERS[zi + 1][0];
          return (
            <path
              key={`iz${zi}`}
              d={bezierPath(from.x, from.y, to.x, to.y, zi % 2 === 0 ? 0.12 : -0.12)}
              fill="none"
              stroke="#2D3748"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity="0.35"
            />
          );
        })}

        {/* Per-zone groups */}
        {ZONE_CLUSTERS.map((zone, zi) => {
          const [start] = ZONE_LEVEL_RANGES[zi];
          const zoneDone = isZoneComplete(zi, completedLevels);
          const completed = getZoneCompletedCount(zi, completedLevels);
          const total = getZoneLevelCount(zi);
          const labelPos = ZONE_LABEL_POS[zi];
          const pathColor = zoneDone ? '#68D391' : '#4A5568';
          const pathOpacity = zoneDone ? 0.5 : 0.25;

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

              {/* Cross-link path (one per zone, adds web-like feel) */}
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
                fontSize="11"
                fontFamily="'IBM Plex Sans', sans-serif"
                fontWeight="600"
                opacity="0.9"
              >
                {ZONE_EMOJIS[zi]} {ZONE_NAMES[zi]}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 15}
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

                const fill = isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#1C2333';
                const stroke = isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#4A5568';
                const filterAttr = isCurrent
                  ? 'url(#glow-amber)'
                  : isDone
                    ? 'url(#glow-green)'
                    : undefined;
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
                    {/* Animated pulse ring for current level */}
                    {isCurrent && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={20}
                        fill="none"
                        stroke="#F6AD55"
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

                    {/* Invisible hit area */}
                    <circle cx={node.x} cy={node.y} r={24} fill="transparent" />

                    {/* Visible node */}
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

                    {/* Level number */}
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

                    {/* Type badge below node */}
                    <text
                      x={node.x}
                      y={node.y + 28}
                      textAnchor="middle"
                      fill={isCurrent ? '#F6AD55' : isDone ? '#68D391' : '#4A5568'}
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
