import { useState, useCallback, useRef, useEffect } from 'react';
import Canvas from './Canvas.jsx';
import JsonReveal from './JsonReveal.jsx';

function ConnectLevel({ level, onCorrect }) {
  const [placed, setPlaced] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [done, setDone] = useState(false);

  const handleCardTap = (cardId) => {
    if (done) return;
    setSelectedCard(cardId === selectedCard ? null : cardId);
    setWrongSlot(null);
  };

  const handleSlotTap = (slot) => {
    if (done || !selectedCard) return;
    if (slot.accepts === selectedCard) {
      const next = { ...placed, [slot.id]: selectedCard };
      setPlaced(next);
      setSelectedCard(null);
      setWrongSlot(null);
      if (Object.keys(next).length === level.slots.length) {
        setDone(true);
        setTimeout(() => onCorrect(), 300);
      }
    } else {
      setWrongSlot(slot.id);
      setTimeout(() => setWrongSlot(null), 500);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {level.cards.map((card) => {
          const isPlaced = Object.values(placed).includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => handleCardTap(card.id)}
              disabled={isPlaced}
              className="pixel-pill px-4 py-3 text-sm font-medium whitespace-pre-line text-center"
              style={{
                background: isPlaced
                  ? '#c8b89a'
                  : selectedCard === card.id
                    ? '#e8a94f'
                    : undefined,
                color: isPlaced
                  ? '#8a7a6a'
                  : selectedCard === card.id
                    ? '#3d2b1f'
                    : '#3d2b1f',
                borderColor: selectedCard === card.id ? '#8b6914' : undefined,
                opacity: isPlaced ? 0.5 : 1,
                minWidth: '100px',
                boxShadow: selectedCard === card.id ? '3px 3px 0 rgba(139,105,20,0.3)' : undefined,
              }}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5">
        {level.slots.map((slot) => {
          const filledCard = placed[slot.id]
            ? level.cards.find((c) => c.id === placed[slot.id])
            : null;
          const isWrong = wrongSlot === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => handleSlotTap(slot)}
              className={`pixel-pill w-full px-4 py-3.5 text-left font-mono text-sm ${isWrong ? 'animate-shake' : ''}`}
              style={{
                background: filledCard ? '#d4e8c4' : undefined,
                border: `3px dashed ${
                  filledCard
                    ? '#5b8c3e'
                    : isWrong
                      ? '#c85a5a'
                      : selectedCard
                        ? '#e8a94f'
                        : '#8b5e3c'
                }`,
                color: filledCard ? '#2a5a1e' : '#7a6350',
              }}
            >
              <span style={{ color: '#3c7a3c' }}>{slot.label}</span>
              {filledCard && (
                <span style={{ color: '#2a5a1e' }}> \u2190 {filledCard.label.split('\n')[0]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillHeaderLevel({ level, onCorrect }) {
  const [values, setValues] = useState({});
  const [done, setDone] = useState(false);

  const allFilled = level.fields.every((f) => {
    if (f.auto) return values[f.key] !== undefined;
    if (f.options) return values[f.key] === f.correct;
    if (f.freeText) return (values[f.key] || '').trim().length > 0;
    return false;
  });

  useEffect(() => {
    if (allFilled && !done) {
      setDone(true);
      setTimeout(() => onCorrect(), 300);
    }
  }, [allFilled, done, onCorrect]);

  return (
    <div className="space-y-3">
      {level.fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1">
          <label className="font-mono text-sm font-medium" style={{ color: '#3c7a3c' }}>
            "{field.key}":
          </label>
          {field.auto ? (
            <button
              onClick={() => setValues({ ...values, [field.key]: true })}
              className="pixel-pill px-4 py-2.5 text-left font-mono text-sm"
              style={{
                background: values[field.key] ? '#d4e8c4' : undefined,
                borderColor: values[field.key] ? '#5b8c3e' : undefined,
                color: values[field.key] ? '#2a5a1e' : '#7a6350',
              }}
            >
              {values[field.key] ? '\u2713 urn:uuid:a1b2c3d4-e5f6-...' : field.prefill + ' (tap to generate)'}
            </button>
          ) : field.options ? (
            <div className="flex gap-2 flex-wrap">
              {field.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setValues({ ...values, [field.key]: opt })}
                  className="pixel-pill px-4 py-2.5 font-mono text-sm"
                  style={{
                    background:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? '#d4e8c4'
                          : '#e8c4c4'
                        : undefined,
                    borderColor:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? '#5b8c3e'
                          : '#c85a5a'
                        : undefined,
                    color:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? '#2a5a1e'
                          : '#8a3a3a'
                        : '#3d2b1f',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.key] || ''}
              onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              className="pixel-pill px-4 py-2.5 font-mono text-sm outline-none w-full"
              style={{ color: '#3d2b1f' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PickDefaultLevel({ level, onCorrect }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const handlePick = (id) => {
    if (done) return;
    setSelected(id);
    if (id === level.correctIntent) {
      setDone(true);
      setTimeout(() => onCorrect(), 300);
    }
  };

  return (
    <div className="space-y-2">
      <p className="font-mono text-sm mb-3" style={{ color: '#3c7a3c' }}>
        "default_framing_intent": ?
      </p>
      {level.intentOptions.map((opt) => {
        const isSelected = selected === opt.id;
        const isCorrect = opt.id === level.correctIntent;
        return (
          <button
            key={opt.id}
            onClick={() => handlePick(opt.id)}
            className="pixel-pill w-full px-4 py-3.5 text-left font-mono text-sm"
            style={{
              background: isSelected
                ? isCorrect ? '#d4e8c4' : '#e8c4c4'
                : undefined,
              borderColor: isSelected
                ? isCorrect ? '#5b8c3e' : '#c85a5a'
                : undefined,
              color: isSelected ? (isCorrect ? '#2a5a1e' : '#8a3a3a') : '#3d2b1f',
            }}
          >
            "{opt.id}" \u2014 {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function LayerSelectLevel({ level, onCorrect }) {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(false);

  const handleLayerSelect = (layerKey) => {
    if (done) return;
    setSelectedLayer(layerKey);
    setWrong(false);
  };

  const handleCheck = () => {
    if (done || !selectedLayer) return;
    if (selectedLayer === level.correctLayer) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  const canvasDims = level.canvas;
  const layersData = {
    effective: level.effectiveFrame,
    protection: level.protectionFrame,
    framing: level.framingFrame,
  };

  return (
    <div>
      <Canvas
        canvasDims={canvasDims}
        layers={layersData}
        selectedLayer={selectedLayer}
        onLayerSelect={handleLayerSelect}
        isCorrect={done}
        isShaking={wrong}
      />
      <p className="text-sm mt-3 mb-3 text-center" style={{ color: '#b8a080' }}>
        Tap a layer to select it as <span className="font-mono" style={{ color: '#3c7a3c' }}>{level.correctLabel || 'fit_source'}</span>
      </p>
      <button
        onClick={handleCheck}
        disabled={!selectedLayer}
        className={`btn-primary w-full py-3 text-base font-pixel text-[10px] ${wrong ? 'animate-shake' : ''}`}
      >
        CHECK
      </button>
    </div>
  );
}

function SideBySideLevel({ level, onCorrect }) {
  const [completed, setCompleted] = useState(new Set());
  const [done, setDone] = useState(false);

  const handleTargetComplete = (idx) => {
    if (done) return;
    const next = new Set(completed);
    next.add(idx);
    setCompleted(next);
    if (next.size === level.targets.length) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {level.targets.map((t, idx) => {
        const isComplete = completed.has(idx);
        const resultFrame = t.resultFrame;
        const targetDims = t.dims;
        const frameX = (targetDims.width - resultFrame.width) / 2;
        const frameY = (targetDims.height - resultFrame.height) / 2;

        return (
          <div key={idx}>
            <p className="font-pixel text-[7px] text-center mb-1" style={{ color: '#b8a080' }}>
              {t.label}
            </p>
            <button
              onClick={() => handleTargetComplete(idx)}
              disabled={isComplete}
              className="pixel-pill w-full overflow-hidden"
              style={{
                borderColor: isComplete ? '#5b8c3e' : undefined,
              }}
            >
              <div
                className="relative w-full"
                style={{ aspectRatio: `${targetDims.width}/${targetDims.height}` }}
              >
                {t.fitMethod === 'fill' && (
                  <div className="absolute inset-0 crop-hatching" />
                )}
                <div
                  style={{
                    position: 'absolute',
                    left: `${(Math.max(0, frameX) / targetDims.width) * 100}%`,
                    top: `${(Math.max(0, frameY) / targetDims.height) * 100}%`,
                    width: `${(Math.min(resultFrame.width, targetDims.width) / targetDims.width) * 100}%`,
                    height: `${(Math.min(resultFrame.height, targetDims.height) / targetDims.height) * 100}%`,
                    border: `2px solid ${isComplete ? '#5b8c3e' : '#e8a94f'}`,
                    transition: 'all 0.3s ease-out',
                  }}
                />
              </div>
            </button>
            {isComplete && (
              <p className="font-pixel text-[7px] text-center mt-1" style={{ color: '#5b8c3e' }}>\u2713</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScaleFactorLevel({ level, onCorrect }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState(null);

  const handlePick = (idx) => {
    if (done) return;
    const opt = level.scaleOptions[idx];
    setSelected(idx);
    if (opt.correct) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    } else {
      setWrong(idx);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const source = level.sourceFrame;
  const target = level.targetDims;

  return (
    <div>
      <div className="pixel-panel-dark p-4 mb-4">
        <div className="flex justify-between mb-3">
          <div className="text-sm" style={{ color: '#b8a080' }}>
            <span className="font-mono" style={{ color: '#3c7a3c' }}>Source:</span>{' '}
            <span className="font-mono" style={{ color: '#e8a94f' }}>{source.width} \u00d7 {source.height}</span>
          </div>
          <div className="text-sm" style={{ color: '#b8a080' }}>
            <span className="font-mono" style={{ color: '#3c7a3c' }}>Target:</span>{' '}
            <span className="font-mono" style={{ color: '#e8a94f' }}>{target.width} \u00d7 {target.height}</span>
          </div>
        </div>
        <p className="text-xs mb-1" style={{ color: '#b8a080' }}>
          Fit method: <span className="font-mono" style={{ color: '#e8a94f' }}>{level.fitMethod}</span> = pick the <strong>{level.fitMethod === 'fit_all' ? 'smaller' : 'larger'}</strong> ratio
        </p>
      </div>

      <div className="space-y-2.5">
        {level.scaleOptions.map((opt, idx) => {
          const isSelected = selected === idx;
          const isWrong = wrong === idx;
          const isCorrectPick = isSelected && opt.correct;
          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={done || isWrong}
              className={`pixel-pill w-full px-4 py-3.5 text-left font-mono text-sm ${isWrong ? 'animate-shake' : ''}`}
              style={{
                background: isCorrectPick ? '#d4e8c4' : isWrong ? '#e8c4c4' : undefined,
                borderColor: isCorrectPick ? '#5b8c3e' : isWrong ? '#c85a5a' : undefined,
                color: isCorrectPick ? '#2a5a1e' : isWrong ? '#8a3a3a' : '#3d2b1f',
                opacity: isWrong ? 0.5 : 1,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {done && (
        <div className="mt-3 text-center animate-fade-in">
          <p className="text-sm font-mono" style={{ color: '#5b8c3e' }}>
            Scale factor = {level.scaleOptions.find((o) => o.correct).value}
          </p>
        </div>
      )}
    </div>
  );
}

function RoundingPickLevel({ level, onCorrect }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [disabledOpts, setDisabledOpts] = useState(new Set());

  const handlePick = (idx) => {
    if (done || disabledOpts.has(idx)) return;
    const opt = level.roundOptions[idx];
    setSelected(idx);
    if (opt.correct) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    } else {
      setDisabledOpts(new Set([...disabledOpts, idx]));
    }
  };

  return (
    <div>
      <div className="pixel-panel-dark p-4 mb-4 font-mono text-sm" style={{ color: '#f5f0e1' }}>
        <p style={{ color: '#b8a080' }}>{level.calculation}</p>
        <p className="mt-1" style={{ color: '#e8a94f' }}>Round to even, up \u2192</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {level.roundOptions.map((opt, idx) => {
          const isSelected = selected === idx;
          const isDisabled = disabledOpts.has(idx);
          const isCorrectPick = isSelected && opt.correct;
          const isWrong = isDisabled && !opt.correct;
          return (
            <button
              key={idx}
              onClick={() => handlePick(idx)}
              disabled={isDisabled || done}
              className="pixel-pill px-4 py-3.5 font-mono text-lg font-bold"
              style={{
                background: isCorrectPick ? '#d4e8c4' : isWrong ? '#e8c4c4' : undefined,
                borderColor: isCorrectPick ? '#5b8c3e' : isWrong ? '#c85a5a' : undefined,
                color: isCorrectPick ? '#2a5a1e' : isWrong ? '#8a3a3a' : '#3d2b1f',
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled || done ? 'not-allowed' : 'pointer',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AlignmentLevel({ level, onCorrect }) {
  const [currentMode, setCurrentMode] = useState(0);
  const [done, setDone] = useState(false);
  const [snapped, setSnapped] = useState(new Set());

  const mode = level.alignmentModes[currentMode];
  const target = level.targetDims;
  const frame = level.scaledFrame;
  const isPad = level.padMode;

  const getAlignedPosition = (h, v) => {
    const hFactor = h === 'left' ? 0 : h === 'center' ? 0.5 : 1;
    const vFactor = v === 'top' ? 0 : v === 'center' ? 0.5 : 1;
    return {
      x: Math.round((target.width - frame.width) * hFactor),
      y: Math.round((target.height - frame.height) * vFactor),
    };
  };

  const pos = getAlignedPosition(mode.h, mode.v);

  const handleSnap = () => {
    if (done) return;
    const next = new Set(snapped);
    next.add(currentMode);
    setSnapped(next);

    if (next.size === level.alignmentModes.length) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    } else if (currentMode + 1 < level.alignmentModes.length) {
      setTimeout(() => setCurrentMode(currentMode + 1), 600);
    }
  };

  return (
    <div>
      <div
        className="relative w-full mx-auto"
        style={{
          aspectRatio: `${target.width}/${target.height}`,
          backgroundColor: '#1a1008',
          border: isPad ? '3px dotted #5a4432' : '3px solid #5a4432',
          boxShadow: 'inset 2px 2px 0 #2a1f14, 3px 3px 0 rgba(0,0,0,0.2)',
          maxWidth: '100%',
        }}
      >
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: `${(pos.x / target.width) * 100}%`,
            top: `${(pos.y / target.height) * 100}%`,
            width: `${(frame.width / target.width) * 100}%`,
            height: `${(frame.height / target.height) * 100}%`,
            backgroundColor: '#3d3225',
            border: `2px solid ${snapped.has(currentMode) ? '#5b8c3e' : '#e8a94f'}`,
          }}
        />
      </div>

      <p className="text-sm mt-3 mb-3 text-center font-mono" style={{ color: '#b8a080' }}>
        {mode.label}
        <span className="ml-2" style={{ color: '#e8a94f' }}>
          ({pos.x}, {pos.y})
        </span>
      </p>

      {!snapped.has(currentMode) && (
        <button
          onClick={handleSnap}
          className="btn-primary w-full py-3 text-base font-pixel text-[10px]"
        >
          {isPad ? 'CONFIRM' : `ALIGN: ${mode.label}`}
        </button>
      )}

      {snapped.has(currentMode) && !done && (
        <p className="text-sm text-center mt-2 animate-fade-in" style={{ color: '#5b8c3e' }}>
          Now try the next alignment...
        </p>
      )}
    </div>
  );
}

function AnamorphicLevel({ level, onCorrect }) {
  const [squeeze, setSqueeze] = useState(1.0);
  const [done, setDone] = useState(false);

  const canvasDims = level.canvas;
  const framing = level.framingFrame;
  const targetSqueeze = level.squeezeValue;

  const desqueezedWidth = framing.width * squeeze;
  const isCorrectVal = Math.abs(squeeze - targetSqueeze) < 0.05;

  useEffect(() => {
    if (isCorrectVal && !done) {
      setSqueeze(targetSqueeze);
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    }
  }, [isCorrectVal, done, targetSqueeze, onCorrect]);

  const displayAR = canvasDims.width / canvasDims.height;

  return (
    <div>
      <div
        className="relative w-full mx-auto select-none"
        style={{
          aspectRatio: `${displayAR}`,
          backgroundColor: '#3d3225',
          border: `3px solid ${done ? '#5b8c3e' : '#5a4432'}`,
          boxShadow: 'inset 2px 2px 0 #4d3c2a, 3px 3px 0 rgba(0,0,0,0.2)',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            top: `${(framing.y / canvasDims.height) * 100}%`,
            height: `${(framing.height / canvasDims.height) * 100}%`,
            width: `${((desqueezedWidth / canvasDims.width) * 100)}%`,
            left: `${((canvasDims.width - desqueezedWidth) / 2 / canvasDims.width) * 100}%`,
            border: `2px solid ${done ? '#5b8c3e' : '#e8a94f'}`,
          }}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-mono block mb-2" style={{ color: '#b8a080' }}>
          anamorphic_squeeze:
          <span className="ml-2 font-bold" style={{ color: '#e8a94f' }}>
            {squeeze.toFixed(1)}
          </span>
        </label>
        <input
          type="range"
          min="1.0"
          max="2.0"
          step="0.1"
          value={squeeze}
          onChange={(e) => !done && setSqueeze(parseFloat(e.target.value))}
          disabled={done}
          className="w-full"
        />
        <div className="flex justify-between font-pixel text-[7px]" style={{ color: '#6b5a4e' }}>
          <span>1.0x</span>
          <span>1.5x</span>
          <span>2.0x</span>
        </div>
      </div>

      <div className="mt-3 font-mono text-sm text-center" style={{ color: '#b8a080' }}>
        Normalized width: <span style={{ color: '#e8a94f' }}>{Math.round(desqueezedWidth)}</span> px
      </div>
    </div>
  );
}

function PipelineConfigLevel({ level, onCorrect }) {
  const [fitSource, setFitSource] = useState(null);
  const [preserve, setPreserve] = useState(null);
  const [done, setDone] = useState(false);

  const fitCorrect = level.fitSourceOptions.find((o) => o.correct)?.id;
  const preserveCorrect = level.preserveOptions.find((o) => o.correct)?.id;

  useEffect(() => {
    if (fitSource === fitCorrect && preserve === preserveCorrect && !done) {
      setDone(true);
      setTimeout(() => onCorrect(), 400);
    }
  }, [fitSource, preserve, fitCorrect, preserveCorrect, done, onCorrect]);

  const renderOptions = (options, selected, onSelect, label) => (
    <div className="mb-4">
      <p className="font-mono text-sm mb-2 font-medium" style={{ color: '#3c7a3c' }}>
        "{label}":
      </p>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const isCorrectOpt = opt.correct && isSelected;
          const isWrongOpt = !opt.correct && isSelected;
          return (
            <button
              key={opt.id}
              onClick={() => !done && onSelect(opt.id)}
              className="pixel-pill w-full px-4 py-2.5 text-left font-mono text-sm"
              style={{
                background: isCorrectOpt ? '#d4e8c4' : isWrongOpt ? '#e8c4c4' : isSelected ? '#e8dcc8' : undefined,
                borderColor: isCorrectOpt ? '#5b8c3e' : isWrongOpt ? '#c85a5a' : isSelected ? '#b8a080' : undefined,
                color: isCorrectOpt ? '#2a5a1e' : isWrongOpt ? '#8a3a3a' : '#3d2b1f',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {renderOptions(level.fitSourceOptions, fitSource, setFitSource, 'fit_source')}
      {renderOptions(level.preserveOptions, preserve, setPreserve, 'preserve_from_source_canvas')}

      {done && (
        <div className="pixel-panel-dark mt-3 p-3 animate-fade-in" style={{ borderColor: '#5b8c3e' }}>
          <p className="font-pixel text-[7px]" style={{ color: '#5b8c3e' }}>
            Phase 2: Populate source geometry
          </p>
          <p className="font-pixel text-[7px]" style={{ color: '#5b8c3e' }}>
            Phase 3: Fill hierarchy gaps
          </p>
        </div>
      )}
    </div>
  );
}

export default function FrameLevel({ level, onCorrect, showReveal }) {
  const [frame, setFrame] = useState(null);
  const [protection, setProtection] = useState(null);
  const [anchorPos, setAnchorPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const dragStart = useRef(null);
  const frameAtDragStart = useRef(null);

  useEffect(() => {
    if (level.startFrame) setFrame({ ...level.startFrame });
    if (level.startProtection) setProtection({ ...level.startProtection });
    if (level.anchorStart) setAnchorPos({ ...level.anchorStart });
    setIsCorrect(false);
  }, [level.id]);

  if (level.subtype === 'connect') {
    return (
      <div>
        <ConnectLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'fillHeader') {
    return (
      <div>
        <FillHeaderLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'pickDefault') {
    return (
      <div>
        <PickDefaultLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'layerSelect') {
    return (
      <div>
        <LayerSelectLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'sideBySide') {
    return (
      <div>
        <SideBySideLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'scaleFactor') {
    return (
      <div>
        <ScaleFactorLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'roundingPick') {
    return (
      <div>
        <RoundingPickLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'alignment') {
    return (
      <div>
        <AlignmentLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'anamorphic') {
    return (
      <div>
        <AnamorphicLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  if (level.subtype === 'pipelineConfig') {
    return (
      <div>
        <PipelineConfigLevel level={level} onCorrect={onCorrect} />
        <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
      </div>
    );
  }

  const canvasDims = level.canvas;
  const target = level.target;

  const checkSnap = useCallback(
    (val) => {
      if (!target || isCorrect) return false;
      const draggable = level.draggable;
      const tol = level.tolerance || 0.08;

      if (draggable === 'anchorMarker') {
        const at = level.anchorTarget;
        const yTol = canvasDims.height * tol;
        return (
          Math.abs(val.y - at.y) <= yTol &&
          Math.abs(val.x - at.x) <= canvasDims.width * tol
        );
      }

      let match = true;
      if (draggable === 'width' || draggable === 'both') {
        match = match && Math.abs(val.width - target.width) <= canvasDims.width * tol;
      }
      if (draggable === 'height' || draggable === 'both') {
        match = match && Math.abs(val.height - target.height) <= canvasDims.height * tol;
      }
      if (draggable === 'position') {
        match = match && Math.abs(val.y - target.y) <= canvasDims.height * tol;
      }
      if (draggable === 'protection') {
        const pt = level.protectionTarget;
        match =
          Math.abs(val.width - pt.width) <= canvasDims.width * tol &&
          Math.abs(val.height - pt.height) <= canvasDims.height * tol;
      }
      return match;
    },
    [target, level, canvasDims, isCorrect]
  );

  const handlePointerDown = useCallback(
    (e, rect) => {
      if (isCorrect) return;
      setIsDragging(true);
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      dragStart.current = { xPct, yPct };

      if (level.draggable === 'anchorMarker') {
        frameAtDragStart.current = { ...(anchorPos || level.anchorStart) };
      } else if (level.draggable === 'protection') {
        frameAtDragStart.current = { ...(protection || level.startProtection) };
      } else {
        frameAtDragStart.current = { ...(frame || level.startFrame) };
      }
    },
    [isCorrect, frame, protection, anchorPos, level]
  );

  const handlePointerMove = useCallback(
    (e, rect) => {
      if (!isDragging || isCorrect || !dragStart.current) return;

      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      const dxPct = xPct - dragStart.current.xPct;
      const dyPct = yPct - dragStart.current.yPct;

      const draggable = level.draggable;
      const startF = frameAtDragStart.current;

      if (draggable === 'anchorMarker') {
        const newY = Math.round(startF.y + dyPct * canvasDims.height);
        const newX = Math.round(startF.x + dxPct * canvasDims.width);
        const clampedY = Math.max(0, Math.min(newY, canvasDims.height));
        const clampedX = Math.max(0, Math.min(newX, canvasDims.width));
        const newPos = { x: clampedX, y: clampedY };
        setAnchorPos(newPos);
        if (checkSnap(newPos)) {
          setAnchorPos({ ...level.anchorTarget });
          setIsCorrect(true);
          setIsDragging(false);
          setTimeout(() => onCorrect(), 400);
        }
        return;
      }

      if (draggable === 'protection') {
        const dxPx = dxPct * canvasDims.width;
        const dyPx = dyPct * canvasDims.height;
        const avgD = (Math.abs(dxPx) + Math.abs(dyPx)) / 2;
        const minW = level.target.width;
        const minH = level.target.height;
        const maxW = Math.round(canvasDims.width * 1.2);
        const maxH = Math.round(canvasDims.height * 1.2);
        const newW = Math.max(minW, Math.round((startF.width + avgD * 2) / 2) * 2);
        const newH = Math.max(minH, Math.round((startF.height + avgD * 2) / 2) * 2);
        const p = { width: Math.min(newW, maxW), height: Math.min(newH, maxH) };
        setProtection(p);
        if (checkSnap(p)) {
          setProtection({ ...level.protectionTarget });
          setIsCorrect(true);
          setIsDragging(false);
          setTimeout(() => onCorrect(), 400);
        }
        return;
      }

      let newFrame = { ...startF };

      if (draggable === 'width' || draggable === 'both') {
        const newW = Math.round((startF.width + dxPct * canvasDims.width) / 2) * 2;
        newFrame.width = Math.max(200, Math.min(newW, canvasDims.width));
      }
      if (draggable === 'height' || draggable === 'both') {
        const newH = Math.round((startF.height + dyPct * canvasDims.height) / 2) * 2;
        newFrame.height = Math.max(200, Math.min(newH, canvasDims.height));
      }
      if (draggable === 'position') {
        const newY = Math.round(startF.y + dyPct * canvasDims.height);
        newFrame.y = Math.max(0, Math.min(newY, canvasDims.height - newFrame.height));
      }

      setFrame(newFrame);

      if (checkSnap(newFrame)) {
        setFrame({ ...target });
        setIsCorrect(true);
        setIsDragging(false);
        setTimeout(() => onCorrect(), 400);
      }
    },
    [isDragging, isCorrect, level, canvasDims, checkSnap, onCorrect]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const currentFrame = frame || level.startFrame;
  const displayFrame = level.draggable === 'protection' ? level.target : currentFrame;

  const protectionDisplay =
    level.draggable === 'protection' ? protection || level.startProtection : null;
  const centerRect = (dims) => ({
    width: dims.width,
    height: dims.height,
    x: (canvasDims.width - dims.width) / 2,
    y: (canvasDims.height - dims.height) / 2,
  });
  const protectionCentered = protectionDisplay ? centerRect(protectionDisplay) : null;

  const protectionTargetGuide =
    level.draggable === 'protection' && level.protectionTarget
      ? centerRect(level.protectionTarget)
      : null;

  const currentAnchor =
    level.draggable === 'anchorMarker' ? anchorPos || level.anchorStart : null;

  const readoutFrame =
    level.draggable === 'protection'
      ? protectionDisplay
      : level.draggable === 'anchorMarker'
        ? currentAnchor
        : currentFrame;

  const showTarget = level.draggable !== 'anchorMarker' && level.draggable !== 'protection';

  return (
    <div>
      <Canvas
        canvasDims={canvasDims}
        targetFrame={showTarget ? target : null}
        playerFrame={displayFrame}
        effectiveFrame={level.effectiveFrame}
        protectionFrame={protectionCentered}
        protectionGuide={protectionTargetGuide}
        anchorMarker={currentAnchor}
        labels={level.labels}
        isCorrect={isCorrect}
        showTarget={showTarget}
        showCanvasOutline={level.showCanvasOutline}
        allowOverflow={level.draggable === 'protection'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <div className="flex justify-center gap-4 mt-3 font-mono text-sm" style={{ color: '#b8a080' }}>
        {readoutFrame && (
          <>
            {(level.draggable === 'position' || level.draggable === 'anchorMarker') && (
              <>
                <span>
                  x: <span style={{ color: '#e8a94f' }}>{Math.round(readoutFrame.x)}</span>
                </span>
                <span>
                  y: <span style={{ color: '#e8a94f' }}>{Math.round(readoutFrame.y)}</span>
                </span>
              </>
            )}
            {level.draggable !== 'anchorMarker' && (
              <>
                <span>
                  w: <span style={{ color: '#e8a94f' }}>{Math.round(readoutFrame.width)}</span>
                </span>
                <span>
                  h: <span style={{ color: '#e8a94f' }}>{Math.round(readoutFrame.height)}</span>
                </span>
              </>
            )}
          </>
        )}
      </div>

      <JsonReveal lines={level.reveal.lines} highlightKeys={level.reveal.highlightKeys} visible={showReveal} />
    </div>
  );
}
