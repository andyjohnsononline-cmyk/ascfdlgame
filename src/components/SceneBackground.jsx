const BACKGROUNDS = {
  production_office: {
    base: 'linear-gradient(180deg, #2a2030 0%, #1e1828 40%, #181420 100%)',
    elements: [
      // Ceiling lights
      { type: 'rect', x: '20%', y: '2%', w: '12%', h: '2px', color: '#4a4a5a', opacity: 0.6 },
      { type: 'rect', x: '55%', y: '2%', w: '12%', h: '2px', color: '#4a4a5a', opacity: 0.6 },
      // Whiteboard with camera info
      { type: 'rect', x: '3%', y: '6%', w: '30%', h: '22%', color: '#e8e4dc', border: '#8a7a6a', opacity: 0.9 },
      { type: 'rect', x: '5%', y: '9%', w: '10%', h: '2px', color: '#3A6B9B', opacity: 0.7 },
      { type: 'rect', x: '5%', y: '12%', w: '14%', h: '2px', color: '#3A6B9B', opacity: 0.5 },
      { type: 'rect', x: '5%', y: '15%', w: '8%', h: '2px', color: '#c85050', opacity: 0.5 },
      { type: 'rect', x: '5%', y: '18%', w: '12%', h: '2px', color: '#3A6B9B', opacity: 0.5 },
      { type: 'rect', x: '5%', y: '21%', w: '16%', h: '2px', color: '#4a8b4a', opacity: 0.5 },
      // Main monitor - MPS portal
      { type: 'rect', x: '36%', y: '8%', w: '28%', h: '22%', color: '#0c1520', border: '#3a4a5a', opacity: 1 },
      { type: 'rect', x: '37%', y: '9%', w: '26%', h: '3px', color: '#1a3050', opacity: 0.8 },
      { type: 'rect', x: '37%', y: '13%', w: '12%', h: '2px', color: '#3A6B9B', opacity: 0.5 },
      { type: 'rect', x: '37%', y: '16%', w: '20%', h: '2px', color: '#2a4a6a', opacity: 0.4 },
      { type: 'rect', x: '37%', y: '19%', w: '16%', h: '2px', color: '#2a4a6a', opacity: 0.3 },
      { type: 'rect', x: '37%', y: '22%', w: '22%', h: '2px', color: '#2a4a6a', opacity: 0.3 },
      { type: 'rect', x: '37%', y: '25%', w: '8%', h: '2px', color: '#4a8b4a', opacity: 0.4 },
      // Monitor glow
      { type: 'glow', x: '38%', y: '10%', w: '24%', h: '18%', color: 'rgba(58, 107, 155, 0.08)' },
      // Right monitor - spreadsheet
      { type: 'rect', x: '68%', y: '10%', w: '28%', h: '18%', color: '#0c1520', border: '#3a4a5a', opacity: 1 },
      { type: 'rect', x: '69%', y: '11%', w: '26%', h: '2px', color: '#1a3050', opacity: 0.6 },
      { type: 'rect', x: '69%', y: '14%', w: '10%', h: '1px', color: '#4a6a4a', opacity: 0.4 },
      { type: 'rect', x: '81%', y: '14%', w: '10%', h: '1px', color: '#4a6a4a', opacity: 0.4 },
      { type: 'rect', x: '69%', y: '17%', w: '10%', h: '1px', color: '#4a6a4a', opacity: 0.3 },
      { type: 'rect', x: '81%', y: '17%', w: '10%', h: '1px', color: '#4a6a4a', opacity: 0.3 },
      { type: 'rect', x: '69%', y: '20%', w: '10%', h: '1px', color: '#4a6a4a', opacity: 0.3 },
      // Desk surface
      { type: 'rect', x: '0%', y: '48%', w: '100%', h: '6px', color: '#4a3828', opacity: 0.9 },
      { type: 'rect', x: '0%', y: '49%', w: '100%', h: '18%', color: '#3a2818', opacity: 0.5 },
      // Call sheet on desk
      { type: 'rect', x: '8%', y: '50%', w: '14%', h: '10%', color: '#e8e0d0', opacity: 0.15 },
      { type: 'rect', x: '9%', y: '52%', w: '8%', h: '1px', color: '#3E2723', opacity: 0.1 },
      { type: 'rect', x: '9%', y: '54%', w: '10%', h: '1px', color: '#3E2723', opacity: 0.08 },
      // Phone
      { type: 'rect', x: '76%', y: '50%', w: '8%', h: '5%', color: '#2a2a30', border: '#4a4a50', opacity: 0.6 },
      // Keyboard
      { type: 'rect', x: '40%', y: '52%', w: '20%', h: '5%', color: '#2a2a30', border: '#3a3a40', opacity: 0.5 },
      // Floor
      { type: 'rect', x: '0%', y: '78%', w: '100%', h: '22%', color: '#14101a', opacity: 0.8 },
      // Chair back silhouette
      { type: 'rect', x: '42%', y: '66%', w: '16%', h: '12%', color: '#1a1620', opacity: 0.4 },
    ],
    ambient: '#1e1828',
  },
  on_set: {
    base: 'linear-gradient(180deg, #0a0a14 0%, #14141e 20%, #1a1a28 100%)',
    elements: [
      // Rigging grid
      { type: 'rect', x: '0%', y: '3%', w: '100%', h: '2px', color: '#2a2a3a', opacity: 0.4 },
      { type: 'rect', x: '25%', y: '0%', w: '2px', h: '6%', color: '#2a2a3a', opacity: 0.3 },
      { type: 'rect', x: '50%', y: '0%', w: '2px', h: '5%', color: '#2a2a3a', opacity: 0.3 },
      { type: 'rect', x: '75%', y: '0%', w: '2px', h: '7%', color: '#2a2a3a', opacity: 0.3 },
      // Overhead lights with glow
      { type: 'rect', x: '12%', y: '4%', w: '12%', h: '8%', color: '#1a1a20', border: '#3a3a4a', opacity: 0.8 },
      { type: 'glow', x: '13%', y: '12%', w: '10%', h: '20%', color: 'rgba(232, 169, 79, 0.12)' },
      { type: 'rect', x: '44%', y: '3%', w: '14%', h: '9%', color: '#1a1a20', border: '#3a3a4a', opacity: 0.8 },
      { type: 'glow', x: '45%', y: '12%', w: '12%', h: '24%', color: 'rgba(232, 169, 79, 0.15)' },
      { type: 'rect', x: '76%', y: '5%', w: '10%', h: '7%', color: '#1a1a20', border: '#3a3a4a', opacity: 0.8 },
      { type: 'glow', x: '77%', y: '12%', w: '8%', h: '18%', color: 'rgba(232, 169, 79, 0.1)' },
      // Camera A on dolly
      { type: 'rect', x: '18%', y: '38%', w: '14%', h: '10%', color: '#1a1a22', border: '#4a4a5a', opacity: 0.9 },
      { type: 'rect', x: '20%', y: '36%', w: '6%', h: '3%', color: '#2a2a3a', opacity: 0.7 },
      { type: 'rect', x: '22%', y: '48%', w: '2px', h: '22%', color: '#3a3a4a', opacity: 0.5 },
      { type: 'rect', x: '28%', y: '48%', w: '2px', h: '22%', color: '#3a3a4a', opacity: 0.5 },
      { type: 'rect', x: '19%', y: '70%', w: '14%', h: '3px', color: '#2a2a3a', opacity: 0.5 },
      // Camera label A
      { type: 'rect', x: '23%', y: '40%', w: '6%', h: '3%', color: '#c85050', opacity: 0.4 },
      // Video village monitors
      { type: 'rect', x: '58%', y: '28%', w: '16%', h: '12%', color: '#0c1018', border: '#3a4a5a', opacity: 0.9 },
      { type: 'rect', x: '59%', y: '29%', w: '14%', h: '2px', color: '#2a4a3a', opacity: 0.5 },
      { type: 'rect', x: '76%', y: '30%', w: '12%', h: '10%', color: '#0c1018', border: '#3a4a5a', opacity: 0.8 },
      { type: 'rect', x: '77%', y: '31%', w: '10%', h: '2px', color: '#4a3a2a', opacity: 0.4 },
      // Monitor glow from video village
      { type: 'glow', x: '60%', y: '30%', w: '12%', h: '8%', color: 'rgba(60, 107, 53, 0.06)' },
      // DIT cart
      { type: 'rect', x: '82%', y: '44%', w: '16%', h: '26%', color: '#1a1a22', border: '#3a3a4a', opacity: 0.7 },
      { type: 'rect', x: '83%', y: '45%', w: '14%', h: '8%', color: '#0c1018', border: '#3C6B35', opacity: 0.6 },
      { type: 'rect', x: '84%', y: '46%', w: '4%', h: '1px', color: '#3C6B35', opacity: 0.4 },
      { type: 'rect', x: '84%', y: '48%', w: '8%', h: '1px', color: '#3C6B35', opacity: 0.3 },
      // Waveform monitor on DIT cart
      { type: 'rect', x: '83%', y: '55%', w: '14%', h: '6%', color: '#0c1018', opacity: 0.5 },
      { type: 'rect', x: '84%', y: '56%', w: '4%', h: '3%', color: '#2a4a2a', opacity: 0.3 },
      // Cables on floor
      { type: 'rect', x: '30%', y: '74%', w: '30%', h: '2px', color: '#1a1a28', opacity: 0.3 },
      { type: 'rect', x: '45%', y: '76%', w: '20%', h: '2px', color: '#1a1a28', opacity: 0.25 },
      // Floor
      { type: 'rect', x: '0%', y: '76%', w: '100%', h: '24%', color: '#0c0c14', opacity: 0.6 },
      // Clapperboard leaning
      { type: 'rect', x: '6%', y: '60%', w: '8%', h: '10%', color: '#1a1a20', opacity: 0.3 },
      { type: 'rect', x: '6%', y: '60%', w: '8%', h: '3%', color: '#e8e4dc', opacity: 0.15 },
    ],
    ambient: '#14141e',
  },
  vfx_suite: {
    base: 'linear-gradient(180deg, #0a0a18 0%, #0e0e1e 40%, #0a0a14 100%)',
    elements: [
      // Overhead ambient
      { type: 'rect', x: '0%', y: '0%', w: '100%', h: '3%', color: '#14142a', opacity: 0.5 },
      // Left monitor - reference frames
      { type: 'rect', x: '2%', y: '8%', w: '26%', h: '22%', color: '#080810', border: '#3a3a5a', opacity: 1 },
      { type: 'rect', x: '3%', y: '9%', w: '24%', h: '14%', color: '#0c1020', opacity: 0.8 },
      { type: 'rect', x: '4%', y: '10%', w: '10%', h: '8%', color: '#1a2a3a', opacity: 0.3 },
      { type: 'rect', x: '16%', y: '10%', w: '10%', h: '8%', color: '#1a2a3a', opacity: 0.25 },
      { type: 'rect', x: '3%', y: '25%', w: '12%', h: '2px', color: '#6B3A8B', opacity: 0.4 },
      // Center monitor - Nuke node graph
      { type: 'rect', x: '30%', y: '4%', w: '40%', h: '30%', color: '#080810', border: '#4a3a6a', opacity: 1 },
      { type: 'glow', x: '32%', y: '6%', w: '36%', h: '26%', color: 'rgba(107, 58, 139, 0.08)' },
      // Nuke nodes
      { type: 'rect', x: '34%', y: '10%', w: '6%', h: '3%', color: '#3a5a3a', opacity: 0.5 },
      { type: 'rect', x: '44%', y: '8%', w: '6%', h: '3%', color: '#5a3a6a', opacity: 0.5 },
      { type: 'rect', x: '54%', y: '12%', w: '6%', h: '3%', color: '#5a5a3a', opacity: 0.5 },
      { type: 'rect', x: '38%', y: '18%', w: '6%', h: '3%', color: '#3a3a6a', opacity: 0.5 },
      { type: 'rect', x: '50%', y: '20%', w: '8%', h: '3%', color: '#6a3a3a', opacity: 0.5 },
      { type: 'rect', x: '62%', y: '16%', w: '6%', h: '3%', color: '#3a5a5a', opacity: 0.5 },
      // Node connections
      { type: 'rect', x: '40%', y: '12%', w: '4%', h: '1px', color: '#6B3A8B', opacity: 0.3 },
      { type: 'rect', x: '50%', y: '11%', w: '4%', h: '1px', color: '#6B3A8B', opacity: 0.3 },
      { type: 'rect', x: '44%', y: '15%', w: '1px', h: '4%', color: '#6B3A8B', opacity: 0.25 },
      { type: 'rect', x: '57%', y: '15%', w: '5%', h: '1px', color: '#6B3A8B', opacity: 0.25 },
      // Right monitor - Resolve color page
      { type: 'rect', x: '72%', y: '8%', w: '26%', h: '22%', color: '#080810', border: '#3a3a5a', opacity: 1 },
      { type: 'rect', x: '73%', y: '9%', w: '24%', h: '14%', color: '#0c1020', opacity: 0.8 },
      // Color wheels hint
      { type: 'rect', x: '75%', y: '12%', w: '5%', h: '5%', color: '#2a1a1a', opacity: 0.3 },
      { type: 'rect', x: '82%', y: '12%', w: '5%', h: '5%', color: '#1a2a1a', opacity: 0.3 },
      { type: 'rect', x: '89%', y: '12%', w: '5%', h: '5%', color: '#1a1a2a', opacity: 0.3 },
      { type: 'rect', x: '73%', y: '25%', w: '8%', h: '2px', color: '#e8a94f', opacity: 0.3 },
      // Desk
      { type: 'rect', x: '0%', y: '48%', w: '100%', h: '5px', color: '#2a2a3a', opacity: 0.9 },
      { type: 'rect', x: '0%', y: '49%', w: '100%', h: '16%', color: '#1a1a2a', opacity: 0.4 },
      // Keyboard
      { type: 'rect', x: '36%', y: '52%', w: '28%', h: '5%', color: '#1a1a24', border: '#2a2a3a', opacity: 0.6 },
      // Wacom tablet
      { type: 'rect', x: '10%', y: '52%', w: '18%', h: '10%', color: '#1a1a24', border: '#2a2a3a', opacity: 0.4 },
      // Reference printouts
      { type: 'rect', x: '72%', y: '52%', w: '10%', h: '8%', color: '#1a1a24', opacity: 0.2 },
      // Render queue indicator
      { type: 'rect', x: '85%', y: '52%', w: '12%', h: '3%', color: '#0c0c18', border: '#2a2a3a', opacity: 0.5 },
      { type: 'rect', x: '86%', y: '53%', w: '4%', h: '1px', color: '#4a8b4a', opacity: 0.4 },
      { type: 'rect', x: '91%', y: '53%', w: '4%', h: '1px', color: '#e8a94f', opacity: 0.3 },
      // Floor
      { type: 'rect', x: '0%', y: '76%', w: '100%', h: '24%', color: '#06060e', opacity: 0.7 },
    ],
    ambient: '#0e0e1e',
  },
  control_room: {
    base: 'linear-gradient(180deg, #1a1408 0%, #14100a 40%, #0e0c08 100%)',
    elements: [
      // Left panel - pipeline diagram
      { type: 'rect', x: '3%', y: '6%', w: '42%', h: '32%', color: '#0c0c14', border: '#8b6914', opacity: 0.9 },
      { type: 'glow', x: '5%', y: '8%', w: '38%', h: '28%', color: 'rgba(139, 105, 20, 0.06)' },
      // Pipeline nodes on screen
      { type: 'rect', x: '8%', y: '12%', w: '8%', h: '4%', color: '#3A6B9B', opacity: 0.4 },
      { type: 'rect', x: '20%', y: '12%', w: '8%', h: '4%', color: '#3C6B35', opacity: 0.4 },
      { type: 'rect', x: '32%', y: '12%', w: '8%', h: '4%', color: '#6B3A8B', opacity: 0.4 },
      { type: 'rect', x: '16%', y: '14%', w: '4%', h: '1px', color: '#8b6914', opacity: 0.3 },
      { type: 'rect', x: '28%', y: '14%', w: '4%', h: '1px', color: '#8b6914', opacity: 0.3 },
      // FDL JSON on screen
      { type: 'rect', x: '6%', y: '22%', w: '16%', h: '2px', color: '#3c7a3c', opacity: 0.4 },
      { type: 'rect', x: '6%', y: '25%', w: '20%', h: '2px', color: '#b8782a', opacity: 0.3 },
      { type: 'rect', x: '6%', y: '28%', w: '12%', h: '2px', color: '#4a7aab', opacity: 0.3 },
      { type: 'rect', x: '6%', y: '31%', w: '18%', h: '2px', color: '#3c7a3c', opacity: 0.3 },
      // Right panel - terminal / pyfdl output
      { type: 'rect', x: '50%', y: '6%', w: '47%', h: '32%', color: '#0c0c14', border: '#8b6914', opacity: 0.9 },
      { type: 'rect', x: '52%', y: '8%', w: '20%', h: '2px', color: '#4a8b4a', opacity: 0.5 },
      { type: 'rect', x: '52%', y: '11%', w: '30%', h: '2px', color: '#e8e4dc', opacity: 0.2 },
      { type: 'rect', x: '52%', y: '14%', w: '25%', h: '2px', color: '#e8e4dc', opacity: 0.15 },
      { type: 'rect', x: '52%', y: '17%', w: '35%', h: '2px', color: '#e8e4dc', opacity: 0.15 },
      { type: 'rect', x: '52%', y: '20%', w: '15%', h: '2px', color: '#4a8b4a', opacity: 0.3 },
      { type: 'rect', x: '52%', y: '23%', w: '28%', h: '2px', color: '#e8e4dc', opacity: 0.15 },
      { type: 'rect', x: '52%', y: '26%', w: '22%', h: '2px', color: '#c85a5a', opacity: 0.3 },
      { type: 'rect', x: '52%', y: '29%', w: '18%', h: '2px', color: '#e8e4dc', opacity: 0.15 },
      // Status indicators row
      { type: 'rect', x: '10%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      { type: 'rect', x: '16%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      { type: 'rect', x: '22%', y: '42%', w: '6px', h: '6px', color: '#e8a94f', opacity: 0.7 },
      { type: 'rect', x: '28%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      { type: 'rect', x: '60%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      { type: 'rect', x: '66%', y: '42%', w: '6px', h: '6px', color: '#c85a5a', opacity: 0.7 },
      { type: 'rect', x: '72%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      { type: 'rect', x: '78%', y: '42%', w: '6px', h: '6px', color: '#4a8b4a', opacity: 0.7 },
      // Console desk
      { type: 'rect', x: '5%', y: '50%', w: '90%', h: '8%', color: '#2a1f14', border: '#5a4432', opacity: 0.8 },
      // Console buttons/faders
      { type: 'rect', x: '10%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      { type: 'rect', x: '16%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      { type: 'rect', x: '22%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      { type: 'rect', x: '70%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      { type: 'rect', x: '76%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      { type: 'rect', x: '82%', y: '52%', w: '3%', h: '3%', color: '#3a3a3a', opacity: 0.4 },
      // Floor
      { type: 'rect', x: '0%', y: '78%', w: '100%', h: '22%', color: '#0a0808', opacity: 0.7 },
    ],
    ambient: '#14100a',
  },
};

export default function SceneBackground({ scene = 'production_office', children }) {
  const bg = BACKGROUNDS[scene] || BACKGROUNDS.production_office;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: bg.base }}
    >
      {bg.elements.map((el, i) => {
        if (el.type === 'glow') {
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                background: `radial-gradient(ellipse, ${el.color}, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
          );
        }

        return (
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
              opacity: el.opacity ?? 0.7,
            }}
          />
        );
      })}

      {/* Ambient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, transparent 30%, ${bg.ambient}DD 90%)`,
        }}
      />

      {/* Subtle scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      {children}
    </div>
  );
}
