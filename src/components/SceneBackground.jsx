const BACKGROUNDS = {
  production_office: {
    base: 'linear-gradient(180deg, #3d2b1f 0%, #2a1f14 60%, #1f170e 100%)',
    elements: [
      { type: 'shelf', x: '5%', y: '8%', w: '28%', h: '3px', color: '#5a4432' },
      { type: 'shelf', x: '5%', y: '16%', w: '28%', h: '3px', color: '#5a4432' },
      { type: 'shelf', x: '67%', y: '10%', w: '28%', h: '3px', color: '#5a4432' },
      { type: 'monitor', x: '10%', y: '22%', w: '18%', h: '14%', color: '#1a2a3a', border: '#4a5a6a' },
      { type: 'monitor', x: '72%', y: '22%', w: '18%', h: '14%', color: '#1a2a3a', border: '#4a5a6a' },
      { type: 'desk', x: '0%', y: '55%', w: '100%', h: '4px', color: '#6b5440' },
      { type: 'floor', x: '0%', y: '80%', w: '100%', h: '20%', color: '#2a1f14' },
    ],
    ambient: '#3d2b1f',
  },
  on_set: {
    base: 'linear-gradient(180deg, #1a1a2e 0%, #2a2a3e 30%, #3a3a4e 100%)',
    elements: [
      { type: 'light', x: '15%', y: '5%', w: '8%', h: '12%', color: '#e8a94f', glow: true },
      { type: 'light', x: '50%', y: '3%', w: '8%', h: '14%', color: '#e8a94f', glow: true },
      { type: 'light', x: '80%', y: '6%', w: '8%', h: '11%', color: '#e8a94f', glow: true },
      { type: 'tripod', x: '25%', y: '40%', w: '3px', h: '25%', color: '#4a4a4a' },
      { type: 'tripod', x: '70%', y: '38%', w: '3px', h: '27%', color: '#4a4a4a' },
      { type: 'camera', x: '22%', y: '35%', w: '10%', h: '8%', color: '#2a2a3e', border: '#5a5a6e' },
      { type: 'floor', x: '0%', y: '78%', w: '100%', h: '22%', color: '#2a2a3a' },
    ],
    ambient: '#2a2a3e',
  },
  vfx_suite: {
    base: 'linear-gradient(180deg, #1a1a2e 0%, #1e1e32 50%, #141428 100%)',
    elements: [
      { type: 'monitor', x: '5%', y: '12%', w: '25%', h: '20%', color: '#0a1a2a', border: '#3a5a7a' },
      { type: 'monitor', x: '35%', y: '8%', w: '30%', h: '24%', color: '#0a1a2a', border: '#3a5a7a' },
      { type: 'monitor', x: '70%', y: '12%', w: '25%', h: '20%', color: '#0a1a2a', border: '#3a5a7a' },
      { type: 'screen-glow', x: '37%', y: '10%', w: '26%', h: '20%', color: 'rgba(107, 58, 139, 0.15)' },
      { type: 'desk', x: '0%', y: '50%', w: '100%', h: '4px', color: '#3a3a4e' },
      { type: 'keyboard', x: '38%', y: '54%', w: '24%', h: '6%', color: '#2a2a3e', border: '#4a4a5e' },
      { type: 'floor', x: '0%', y: '78%', w: '100%', h: '22%', color: '#1a1a2a' },
    ],
    ambient: '#1e1e32',
  },
  control_room: {
    base: 'linear-gradient(180deg, #2a1f14 0%, #1f1a10 50%, #14100a 100%)',
    elements: [
      { type: 'panel', x: '5%', y: '8%', w: '40%', h: '30%', color: '#1a1a2a', border: '#8b6914' },
      { type: 'panel', x: '55%', y: '8%', w: '40%', h: '30%', color: '#1a1a2a', border: '#8b6914' },
      { type: 'indicator', x: '12%', y: '15%', w: '6px', h: '6px', color: '#5b8c3e' },
      { type: 'indicator', x: '22%', y: '15%', w: '6px', h: '6px', color: '#e8a94f' },
      { type: 'indicator', x: '32%', y: '15%', w: '6px', h: '6px', color: '#5b8c3e' },
      { type: 'indicator', x: '62%', y: '15%', w: '6px', h: '6px', color: '#5b8c3e' },
      { type: 'indicator', x: '72%', y: '15%', w: '6px', h: '6px', color: '#c85a5a' },
      { type: 'indicator', x: '82%', y: '15%', w: '6px', h: '6px', color: '#5b8c3e' },
      { type: 'console', x: '10%', y: '50%', w: '80%', h: '8%', color: '#3d2b1f', border: '#5a4432' },
      { type: 'floor', x: '0%', y: '78%', w: '100%', h: '22%', color: '#1a100a' },
    ],
    ambient: '#2a1f14',
  },
};

export default function SceneBackground({ scene = 'production_office', children }) {
  const bg = BACKGROUNDS[scene] || BACKGROUNDS.production_office;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: bg.base }}
    >
      {bg.elements.map((el, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: el.x,
            top: el.y,
            width: el.w,
            height: el.h,
            backgroundColor: el.color,
            border: el.border ? `2px solid ${el.border}` : 'none',
            boxShadow: el.glow
              ? `0 8px 24px ${el.color}40, 0 2px 8px ${el.color}60`
              : 'none',
            opacity: 0.7,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, transparent 40%, ${bg.ambient}CC 100%)`,
        }}
      />
      {children}
    </div>
  );
}
