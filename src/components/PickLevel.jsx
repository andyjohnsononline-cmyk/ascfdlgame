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
              className="glass-pill w-full px-4 py-3.5 rounded-xl text-left text-sm font-medium"
              style={{
                background: showCorrect
                  ? 'rgba(104, 211, 145, 0.12)'
                  : showWrong
                    ? 'rgba(252, 129, 129, 0.06)'
                    : undefined,
                borderColor: showCorrect
                  ? 'rgba(104, 211, 145, 0.4)'
                  : showWrong
                    ? 'rgba(252, 129, 129, 0.3)'
                    : undefined,
                color: showCorrect
                  ? '#68D391'
                  : showWrong
                    ? '#FC8181'
                    : isDisabled
                      ? '#4A5568'
                      : '#E2E8F0',
                opacity: isDisabled && !showCorrect ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                boxShadow: showCorrect ? '0 0 16px rgba(104, 211, 145, 0.15)' : 'none',
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
