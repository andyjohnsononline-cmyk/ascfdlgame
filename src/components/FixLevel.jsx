import { useState, useEffect } from 'react';
import Canvas from './Canvas.jsx';
import JsonReveal from './JsonReveal.jsx';

export default function FixLevel({ level, onCorrect, onWrong, showReveal }) {
  const [selected, setSelected] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [foundBugs, setFoundBugs] = useState(new Set());

  useEffect(() => {
    setSelected(null);
    setDisabledOptions(new Set());
    setIsCorrect(false);
    setIsShaking(false);
    setFoundBugs(new Set());
  }, [level.id]);

  const handleOption = (option, index) => {
    if (isCorrect || disabledOptions.has(index)) return;

    setSelected(index);

    if (level.multiFix) {
      if (option.correct) {
        const next = new Set(foundBugs);
        next.add(option.bugIndex);
        setFoundBugs(next);
        setDisabledOptions(new Set([...disabledOptions, index]));
        const totalBugs = level.bugs.length;
        if (next.size >= totalBugs) {
          setIsCorrect(true);
          setTimeout(() => onCorrect(), 400);
        }
      } else {
        setIsShaking(true);
        setDisabledOptions(new Set([...disabledOptions, index]));
        if (onWrong) onWrong();
        setTimeout(() => setIsShaking(false), 400);
      }
      return;
    }

    if (option.correct) {
      setIsCorrect(true);
      setTimeout(() => onCorrect(), 400);
    } else {
      setIsShaking(true);
      setDisabledOptions(new Set([...disabledOptions, index]));
      if (onWrong) onWrong();
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  const hasCanvas = level.canvas && level.shownFrame;

  return (
    <div>
      {hasCanvas && (
        <Canvas
          canvasDims={level.canvas}
          playerFrame={isCorrect ? level.correctFrame : level.shownFrame}
          shownProtection={level.shownProtection}
          labels={level.labels}
          isCorrect={isCorrect}
          isShaking={isShaking}
          showTarget={false}
        />
      )}

      {level.shownJson && !hasCanvas && (
        <div
          className={`rounded-lg p-4 font-mono text-sm leading-relaxed mb-4 ${isShaking ? 'animate-shake' : ''}`}
          style={{
            backgroundColor: '#1C2333',
            border: `1px solid ${isCorrect ? '#68D391' : '#2D3748'}`,
            color: '#E2E8F0',
            whiteSpace: 'pre-wrap',
          }}
        >
          {level.shownJson}
        </div>
      )}

      {level.multiFix && (
        <div className="text-xs mb-2 font-medium" style={{ color: '#A0AEC0' }}>
          Found {foundBugs.size} of {level.bugs.length} bugs
        </div>
      )}

      <div className="space-y-2 mt-4">
        {level.options.map((option, i) => {
          const isSelected = selected === i;
          const isDisabled = disabledOptions.has(i);
          const showCorrect = isSelected && option.correct;
          const showWrong = isDisabled && !option.correct;

          return (
            <button
              key={i}
              onClick={() => handleOption(option, i)}
              disabled={isDisabled}
              className="w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-all"
              style={{
                backgroundColor: showCorrect
                  ? 'rgba(104, 211, 145, 0.15)'
                  : showWrong
                    ? 'rgba(252, 129, 129, 0.08)'
                    : '#1C2333',
                border: `1px solid ${
                  showCorrect
                    ? '#68D391'
                    : showWrong
                      ? '#FC8181'
                      : '#2D3748'
                }`,
                color: showCorrect
                  ? '#68D391'
                  : showWrong
                    ? '#FC8181'
                    : isDisabled
                      ? '#4A5568'
                      : '#E2E8F0',
                opacity: isDisabled && !showCorrect ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
              }}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <JsonReveal
        lines={level.reveal.lines}
        highlightKeys={level.reveal.highlightKeys}
        visible={showReveal}
      />
    </div>
  );
}
