import { useState, useEffect, useRef, useCallback } from 'react';
import CharacterPortrait, { CHARACTER_NAMES } from './CharacterPortrait.jsx';

const CHARS_PER_TICK = 2;
const TICK_MS = 30;

export default function DialogueBox({
  character,
  expression: defaultExpression = 'neutral',
  lines = [],
  onComplete,
  showAdvanceIndicator = true,
  children,
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isLineComplete, setIsLineComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  const currentLine = lines[lineIndex];
  const text = currentLine?.text || '';
  const expression = currentLine?.expression || defaultExpression;

  useEffect(() => {
    setDisplayedText('');
    setIsLineComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsLineComplete(true);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current += CHARS_PER_TICK;
      if (indexRef.current >= text.length) {
        setDisplayedText(text);
        setIsLineComplete(true);
        clearInterval(timerRef.current);
      } else {
        setDisplayedText(text.slice(0, indexRef.current));
      }
    }, TICK_MS);

    return () => clearInterval(timerRef.current);
  }, [lineIndex, text]);

  const handleClick = useCallback(() => {
    if (!isLineComplete) {
      clearInterval(timerRef.current);
      setDisplayedText(text);
      setIsLineComplete(true);
    } else if (lineIndex < lines.length - 1) {
      setLineIndex(lineIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  }, [isLineComplete, text, lineIndex, lines.length, onComplete]);

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
            {!isLineComplete && (
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

          {isLineComplete && showAdvanceIndicator && !children && (
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
