import { useEffect, useState } from 'react';
import CharacterPortrait, { CHARACTER_NAMES } from './CharacterPortrait.jsx';

export default function ZoneComplete({ chapterIndex, reward, character, onContinue, onChapterSelect }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4"
      style={{ backgroundColor: 'rgba(26, 48, 18, 0.92)', WebkitOverflowScrolling: 'touch' }}
    >
    <div className="min-h-full flex items-center justify-center">
      <div
        className={`text-center px-6 py-8 max-w-sm pixel-panel ${show ? 'animate-bounce-in' : 'opacity-0'}`}
      >
        <div className="flex justify-center mb-4">
          <div
            className="p-1.5"
            style={{
              border: '3px solid #8b5e3c',
              background: '#2a1f14',
            }}
          >
            <CharacterPortrait character={character} expression="happy" size="xl" />
          </div>
        </div>

        <h2
          className="font-pixel text-[10px] leading-relaxed mb-2"
          style={{ color: '#8b6914' }}
        >
          CHAPTER COMPLETE
        </h2>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: '#3d2b1f' }}
        >
          {reward.text}
        </p>

        <button
          onClick={onContinue}
          className="btn-primary px-8 py-3 font-pixel text-[10px]"
        >
          CONTINUE
        </button>
        {onChapterSelect && (
          <button
            onClick={onChapterSelect}
            className="block mx-auto mt-3 text-xs px-4 py-2 transition-opacity hover:opacity-80"
            style={{ color: '#8D6E63' }}
          >
            Chapter Select
          </button>
        )}
      </div>
      </div>
    </div>
  );
}
