import { useState, useEffect } from 'react';
import Canvas from './Canvas.jsx';
import JsonReveal from './JsonReveal.jsx';

export default function FixLevel({ level, onCorrect, onWrong, showReveal }) {
  const [selected, setSelected] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    setSelected(null);
    setDisabledOptions(new Set());
    setIsCorrect(false);
    setIsShaking(false);
  }, [level.id]);

  const handleOption = (option, index) => {
    if (isCorrect || disabledOptions.has(index)) return;

    setSelected(index);

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
          className={`pixel-panel-dark p-4 font-mono text-sm leading-relaxed mb-4 ${isShaking ? 'animate-shake' : ''}`}
          style={{
            borderColor: isCorrect ? '#5b8c3e' : undefined,
            color: '#f5f0e1',
            whiteSpace: 'pre-wrap',
          }}
        >
          {level.shownJson}
        </div>
      )}

      <div className="space-y-2.5 mt-4">
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
              className={`pixel-pill w-full px-4 py-3.5 text-left text-sm font-medium ${
                showWrong ? 'animate-shake' : ''
              }`}
              style={{
                background: showCorrect
                  ? '#d4e8c4'
                  : showWrong
                    ? '#e8c4c4'
                    : undefined,
                borderColor: showCorrect
                  ? '#5b8c3e'
                  : showWrong
                    ? '#c85a5a'
                    : undefined,
                color: showCorrect
                  ? '#2a5a1e'
                  : showWrong
                    ? '#8a3a3a'
                    : isDisabled
                      ? '#a09080'
                      : '#3d2b1f',
                opacity: isDisabled && !showCorrect ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                boxShadow: showCorrect ? '3px 3px 0 rgba(91,140,62,0.3)' : undefined,
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
