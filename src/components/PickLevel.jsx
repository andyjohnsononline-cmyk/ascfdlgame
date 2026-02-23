import { useState, useEffect } from 'react';
import JsonReveal from './JsonReveal.jsx';

export default function PickLevel({ level, onCorrect, onWrong, showReveal }) {
  const [selected, setSelected] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelected(null);
    setDisabledOptions(new Set());
    setIsCorrect(false);
  }, [level.id]);

  const handleOption = (option, index) => {
    if (isCorrect || disabledOptions.has(index)) return;

    setSelected(index);

    if (option.correct) {
      setIsCorrect(true);
      setTimeout(() => onCorrect(), 400);
    } else {
      setDisabledOptions(new Set([...disabledOptions, index]));
      if (onWrong) onWrong();
    }
  };

  return (
    <div>
      <div className="space-y-2.5">
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
        docRef={level.docRef}
      />
    </div>
  );
}
