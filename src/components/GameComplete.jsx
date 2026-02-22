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
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.96)' }}
    >
      <div
        className={`text-center px-8 py-10 max-w-md ${show ? 'animate-bounce-in' : 'opacity-0'}`}
      >
        <div className="text-7xl mb-4">🏆</div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#F6AD55' }}
        >
          FDL CERTIFIED
        </h1>
        <p
          className="text-lg mb-8 leading-relaxed"
          style={{ color: '#E2E8F0' }}
        >
          You understand the ASC Framing Decision List!
        </p>

        <div
          className="rounded-lg p-6 mb-8 text-left"
          style={{ backgroundColor: '#1C2333', border: '1px solid #2D3748' }}
        >
          <h3
            className="font-semibold mb-4 text-center"
            style={{ color: '#4FD1C5' }}
          >
            What you learned
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: '#A0AEC0' }}>
            {[
              'What a Canvas is and how it maps to a camera sensor',
              'What a Framing Intent is and how aspect ratios work',
              'How Framing Decisions are calculated',
              'What protection percentages do',
              'How Contexts wire it all together',
              'How the same intent works across different cameras',
              'What a complete FDL JSON file looks like',
              'How to spot and fix common FDL errors',
              'How delivery canvases extend the pipeline',
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
            className="px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#F6AD55',
              color: '#0D1117',
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
