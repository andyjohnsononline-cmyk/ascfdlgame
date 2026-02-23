import { useEffect, useState } from 'react';

export default function GameComplete({ totalLevels, streak, onRestart }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(8, 10, 15, 0.92)' }}
    >
      <div
        className={`text-center px-8 py-10 max-w-md glass-card ${show ? 'animate-bounce-in' : 'opacity-0'}`}
      >
        <div className="text-7xl mb-4">🏆</div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#EDAB68', textShadow: '0 0 24px rgba(237, 171, 104, 0.3)' }}
        >
          FDL CERTIFIED
        </h1>
        <p
          className="text-lg mb-6 leading-relaxed"
          style={{ color: '#E2E8F0' }}
        >
          You understand the ASC Framing Decision List and the Template Application Pipeline!
        </p>

        <div
          className="glass-card-subtle p-4 mb-6 flex justify-around"
        >
          <div className="text-center">
            <p className="text-2xl font-bold font-mono" style={{ color: '#68D391' }}>{totalLevels}</p>
            <p className="text-xs tracking-wide" style={{ color: '#A0AEC0' }}>Levels</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono" style={{ color: '#EDAB68' }}>🔥 {streak}</p>
            <p className="text-xs tracking-wide" style={{ color: '#A0AEC0' }}>Best Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono" style={{ color: '#4FD1C5' }}>6</p>
            <p className="text-xs tracking-wide" style={{ color: '#A0AEC0' }}>Zones</p>
          </div>
        </div>

        <div
          className="glass-card-subtle p-6 mb-8 text-left"
        >
          <h3
            className="font-semibold mb-4 text-center tracking-wide"
            style={{ color: '#4FD1C5' }}
          >
            What you learned
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: '#A0AEC0' }}>
            {[
              'The four-level geometry hierarchy',
              'What anchor points are and how they position each layer',
              'Framing Intents and how aspect ratios work',
              'How Framing Decisions are calculated',
              'Protection dimensions — and that they\'re never auto-filled',
              'How Contexts wire canvases to framing decisions',
              'What a complete FDL JSON file looks like',
              'Canvas Templates and what they control',
              'How fit_source determines which layer drives scaling',
              'The four fit methods and when to use each',
              'Scale factors, rounding strategies, and alignment',
              'PAD, CROP, and FIT output modes',
              'How anamorphic squeeze affects the pipeline',
              'The 8-phase template application pipeline',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: '#68D391' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="btn-primary px-8 py-3 text-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
