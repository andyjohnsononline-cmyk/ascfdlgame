import { useState, useEffect, useRef, useCallback } from 'react';
import CharacterPortrait, { CHARACTER_NAMES } from './CharacterPortrait.jsx';

const CHARS_PER_TICK = 2;
const TICK_MS = 30;

export default function DialogueBox({
  character,
  expression = 'neutral',
  text,
  onAdvance,
  showAdvanceIndicator = true,
  children,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current += CHARS_PER_TICK;
      if (indexRef.current >= text.length) {
        setDisplayedText(text);
        setIsComplete(true);
        clearInterval(timerRef.current);
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, TICK_MS);

    return () => clearInterval(timerRef.current);
  }, [text]);

  const handleClick = useCallback(() => {
    if (!isComplete) {
      clearInterval(timerRef.current);
      setDisplayedText(text);
      setIsComplete(true);
    } else if (onAdvance) {
      onAdvance();
    }
  }, [isComplete, text, onAdvance]);

  return (
    <div
      className="dialogue-box relative p-4 pt-6 animate-dialogue-up cursor-pointer select-none"
      onClick={handleClick}
    >
      <div className="dialogue-nameplate">
        {CHARACTER_NAMES[character] || character}
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 animate-portrait-in">
          <div
            className="p-1"
            style={{
              border: '2px solid #5a4432',
              background: '#1a1008',
            }}
          >
            <CharacterPortrait character={character} expression={expression} size="lg" />
          </div>
        </div>

        <div className="flex-1 min-h-[60px] flex flex-col justify-between">
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#f5f0e1', minHeight: '3em' }}
          >
            {displayedText}
            {!isComplete && (
              <span
                className="inline-block w-2 ml-0.5"
                style={{
                  borderBottom: '2px solid #e8a94f',
                  animation: 'typewriter-cursor 0.6s step-end infinite',
                }}
              >
                &nbsp;
              </span>
            )}
          </p>

          {children}

          {isComplete && showAdvanceIndicator && !children && (
            <div className="text-right mt-1">
              <span
                className="font-pixel text-xs animate-advance-bounce inline-block"
                style={{ color: '#e8a94f' }}
              >
                ▼
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
