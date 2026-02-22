import { useEffect, useState } from 'react';

export default function ZoneComplete({ reward, onContinue }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.92)' }}
    >
      <div
        className={`text-center px-8 py-10 max-w-sm ${show ? 'animate-bounce-in' : 'opacity-0'}`}
      >
        <div className="text-6xl mb-4">{reward.emoji}</div>
        <h2
          className="text-2xl font-bold mb-6 leading-tight"
          style={{ color: '#E2E8F0' }}
        >
          {reward.text}
        </h2>
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: '#F6AD55',
            color: '#0D1117',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
