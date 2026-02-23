import { useState, useCallback, useRef, useEffect } from 'react';
import Canvas from './Canvas.jsx';
import JsonReveal from './JsonReveal.jsx';

// ═══════════════════════════════════════
// Connect: tap cards into slots
// ═══════════════════════════════════════
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
              className="glass-pill px-4 py-3 rounded-xl text-sm font-medium whitespace-pre-line text-center"
              style={{
                background: isPlaced
                  ? '#2D3748'
                  : selectedCard === card.id
                    ? '#EDAB68'
                    : undefined,
                color: isPlaced
                  ? '#4A5568'
                  : selectedCard === card.id
                    ? '#0D1117'
                    : '#E2E8F0',
                borderColor: selectedCard === card.id ? '#EDAB68' : undefined,
                opacity: isPlaced ? 0.5 : 1,
                minWidth: '100px',
                boxShadow: selectedCard === card.id ? '0 0 16px rgba(237, 171, 104, 0.2)' : 'none',
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
              className={`glass-pill w-full px-4 py-3.5 rounded-xl text-left font-mono text-sm ${isWrong ? 'animate-shake' : ''}`}
              style={{
                background: filledCard ? 'rgba(104, 211, 145, 0.08)' : undefined,
                border: `2px dashed ${
                  filledCard
                    ? '#68D391'
                    : isWrong
                      ? '#FC8181'
                      : selectedCard
                        ? '#EDAB68'
                        : 'rgba(255, 255, 255, 0.06)'
                }`,
                color: filledCard ? '#68D391' : '#A0AEC0',
              }}
            >
              <span style={{ color: '#4FD1C5' }}>{slot.label}</span>
              {filledCard && (
                <span style={{ color: '#68D391' }}> ← {filledCard.label.split('\n')[0]}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// FillHeader: fill in FDL header fields
// ═══════════════════════════════════════
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
          <label className="font-mono text-sm" style={{ color: '#4FD1C5' }}>
            "{field.key}":
          </label>
          {field.auto ? (
            <button
              onClick={() => setValues({ ...values, [field.key]: true })}
              className="glass-pill px-4 py-2.5 rounded-xl text-left font-mono text-sm"
              style={{
                background: values[field.key] ? 'rgba(104, 211, 145, 0.08)' : undefined,
                borderColor: values[field.key] ? 'rgba(104, 211, 145, 0.3)' : undefined,
                color: values[field.key] ? '#68D391' : '#A0AEC0',
              }}
            >
              {values[field.key] ? '✓ urn:uuid:a1b2c3d4-e5f6-...' : field.prefill + ' (tap to generate)'}
            </button>
          ) : field.options ? (
            <div className="flex gap-2 flex-wrap">
              {field.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setValues({ ...values, [field.key]: opt })}
                  className="glass-pill px-4 py-2.5 rounded-xl font-mono text-sm"
                  style={{
                    background:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? 'rgba(104, 211, 145, 0.12)'
                          : 'rgba(252, 129, 129, 0.1)'
                        : undefined,
                    borderColor:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? 'rgba(104, 211, 145, 0.4)'
                          : 'rgba(252, 129, 129, 0.3)'
                        : undefined,
                    color:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? '#68D391'
                          : '#FC8181'
                        : '#E2E8F0',
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
              className="glass-pill px-4 py-2.5 rounded-xl font-mono text-sm outline-none w-full"
              style={{
                color: '#E2E8F0',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// PickDefault: pick default framing intent
// ═══════════════════════════════════════
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
      <p className="font-mono text-sm mb-3" style={{ color: '#4FD1C5' }}>
        "default_framing_intent": ?
      </p>
      {level.intentOptions.map((opt) => {
        const isSelected = selected === opt.id;
        const isCorrect = opt.id === level.correctIntent;
        return (
          <button
            key={opt.id}
            onClick={() => handlePick(opt.id)}
            className="glass-pill w-full px-4 py-3.5 rounded-xl text-left font-mono text-sm"
            style={{
              background: isSelected
                ? isCorrect
                  ? 'rgba(104, 211, 145, 0.12)'
                  : 'rgba(252, 129, 129, 0.08)'
                : undefined,
              borderColor: isSelected
                ? isCorrect ? 'rgba(104, 211, 145, 0.4)' : 'rgba(252, 129, 129, 0.3)'
                : undefined,
              color: isSelected ? (isCorrect ? '#68D391' : '#FC8181') : '#E2E8F0',
            }}
          >
            "{opt.id}" — {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// LayerSelect: tap a hierarchy layer
// ═══════════════════════════════════════
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

      <p className="text-sm mt-3 mb-3 text-center" style={{ color: '#A0AEC0' }}>
        Tap a layer to select it as <span className="font-mono" style={{ color: '#4FD1C5' }}>{level.correctLabel || 'fit_source'}</span>
      </p>

      <button
        onClick={handleCheck}
        disabled={!selectedLayer}
        className={`btn-primary w-full py-3 text-base ${wrong ? 'animate-shake' : ''}`}
      >
        CHECK
      </button>
    </div>
  );
}

// ═══════════════════════════════════════
// SideBySide: compare fit_all vs fill
// ═══════════════════════════════════════
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
            <p className="text-xs font-mono text-center mb-1" style={{ color: '#A0AEC0' }}>
              {t.label}
            </p>
            <button
              onClick={() => handleTargetComplete(idx)}
              disabled={isComplete}
              className="glass-pill w-full rounded-xl overflow-hidden"
              style={{
                borderColor: isComplete ? 'rgba(104, 211, 145, 0.4)' : undefined,
              }}
            >
              <div
                className="relative w-full"
                style={{ aspectRatio: `${targetDims.width}/${targetDims.height}` }}
              >
                {t.fitMethod === 'fill' && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(252,129,129,0.15) 4px, rgba(252,129,129,0.15) 8px)',
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    left: `${(Math.max(0, frameX) / targetDims.width) * 100}%`,
                    top: `${(Math.max(0, frameY) / targetDims.height) * 100}%`,
                    width: `${(Math.min(resultFrame.width, targetDims.width) / targetDims.width) * 100}%`,
                    height: `${(Math.min(resultFrame.height, targetDims.height) / targetDims.height) * 100}%`,
                    border: `2px solid ${isComplete ? '#68D391' : '#EDAB68'}`,
                    transition: 'all 0.3s ease-out',
                  }}
                />
              </div>
            </button>
            {isComplete && (
              <p className="text-xs font-mono text-center mt-1" style={{ color: '#68D391' }}>✓</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// ScaleFactor: pick the correct ratio
// ═══════════════════════════════════════
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
      <div className="glass-card-subtle p-4 mb-4">
        <div className="flex justify-between mb-3">
          <div className="text-sm" style={{ color: '#A0AEC0' }}>
            <span className="font-mono" style={{ color: '#4FD1C5' }}>Source:</span>{' '}
            <span className="font-mono" style={{ color: '#EDAB68' }}>{source.width} × {source.height}</span>
          </div>
          <div className="text-sm" style={{ color: '#A0AEC0' }}>
            <span className="font-mono" style={{ color: '#4FD1C5' }}>Target:</span>{' '}
            <span className="font-mono" style={{ color: '#EDAB68' }}>{target.width} × {target.height}</span>
          </div>
        </div>
        <p className="text-xs mb-1" style={{ color: '#A0AEC0' }}>
          Fit method: <span className="font-mono" style={{ color: '#EDAB68' }}>{level.fitMethod}</span> = pick the <strong>{level.fitMethod === 'fit_all' ? 'smaller' : 'larger'}</strong> ratio
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
              className={`glass-pill w-full px-4 py-3.5 rounded-xl text-left font-mono text-sm ${isWrong ? 'animate-shake' : ''}`}
              style={{
                background: isCorrectPick
                  ? 'rgba(104, 211, 145, 0.12)'
                  : isWrong
                    ? 'rgba(252, 129, 129, 0.06)'
                    : undefined,
                borderColor: isCorrectPick
                  ? 'rgba(104, 211, 145, 0.4)'
                  : isWrong
                    ? 'rgba(252, 129, 129, 0.3)'
                    : undefined,
                color: isCorrectPick ? '#68D391' : isWrong ? '#FC8181' : '#E2E8F0',
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
          <p className="text-sm font-mono" style={{ color: '#68D391' }}>
            Scale factor = {level.scaleOptions.find((o) => o.correct).value}
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// RoundingPick: pick correctly rounded value
// ═══════════════════════════════════════
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
      <div className="glass-card-subtle p-4 mb-4 font-mono text-sm" style={{ color: '#E2E8F0' }}>
        <p style={{ color: '#A0AEC0' }}>{level.calculation}</p>
        <p className="mt-1" style={{ color: '#4FD1C5' }}>Round to even, up →</p>
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
              className="glass-pill px-4 py-3.5 rounded-xl font-mono text-lg font-bold"
              style={{
                background: isCorrectPick
                  ? 'rgba(104, 211, 145, 0.12)'
                  : isWrong
                    ? 'rgba(252, 129, 129, 0.06)'
                    : undefined,
                borderColor: isCorrectPick
                  ? 'rgba(104, 211, 145, 0.4)'
                  : isWrong
                    ? 'rgba(252, 129, 129, 0.3)'
                    : undefined,
                color: isCorrectPick ? '#68D391' : isWrong ? '#FC8181' : '#E2E8F0',
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

// ═══════════════════════════════════════
// Alignment: drag frame to alignment position
// ═══════════════════════════════════════
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
        className="relative w-full mx-auto rounded-lg"
        style={{
          aspectRatio: `${target.width}/${target.height}`,
          backgroundColor: '#0D1117',
          border: isPad ? '2px dotted #2D3748' : '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
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
            backgroundColor: '#1C2333',
            border: `2px solid ${snapped.has(currentMode) ? '#68D391' : '#EDAB68'}`,
          }}
        />
      </div>

      <p className="text-sm mt-3 mb-3 text-center font-mono" style={{ color: '#A0AEC0' }}>
        {mode.label}
        <span className="ml-2" style={{ color: '#4FD1C5' }}>
          ({pos.x}, {pos.y})
        </span>
      </p>

      {!snapped.has(currentMode) && (
        <button
          onClick={handleSnap}
          className="btn-primary w-full py-3 text-base"
        >
          {isPad ? 'Confirm Alignment' : `Align: ${mode.label}`}
        </button>
      )}

      {snapped.has(currentMode) && !done && (
        <p className="text-sm text-center mt-2 animate-fade-in" style={{ color: '#68D391' }}>
          ✓ Now try the next alignment...
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Anamorphic: set squeeze value
// ═══════════════════════════════════════
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
        className="relative w-full mx-auto rounded-lg select-none"
        style={{
          aspectRatio: `${displayAR}`,
          backgroundColor: '#1C2333',
          border: `1px solid ${done ? '#68D391' : 'rgba(255, 255, 255, 0.06)'}`,
          borderBottom: `1px solid ${done ? '#68D391' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
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
            border: `2px solid ${done ? '#68D391' : '#EDAB68'}`,
          }}
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-mono block mb-2" style={{ color: '#A0AEC0' }}>
          anamorphic_squeeze:
          <span className="ml-2 font-bold" style={{ color: '#EDAB68' }}>
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
          className="w-full accent-amber-400"
          style={{ accentColor: '#EDAB68' }}
        />
        <div className="flex justify-between text-xs font-mono" style={{ color: '#4A5568' }}>
          <span>1.0×</span>
          <span>1.5×</span>
          <span>2.0×</span>
        </div>
      </div>

      <div className="mt-3 font-mono text-sm text-center" style={{ color: '#A0AEC0' }}>
        Normalized width: <span style={{ color: '#EDAB68' }}>{Math.round(desqueezedWidth)}</span> px
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PipelineConfig: select fit_source & preserve
// ═══════════════════════════════════════
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
      <p className="font-mono text-sm mb-2" style={{ color: '#4FD1C5' }}>
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
              className="glass-pill w-full px-4 py-2.5 rounded-xl text-left font-mono text-sm"
              style={{
                background: isCorrectOpt
                  ? 'rgba(104, 211, 145, 0.12)'
                  : isWrongOpt
                    ? 'rgba(252, 129, 129, 0.06)'
                    : isSelected
                      ? 'rgba(237, 171, 104, 0.08)'
                      : undefined,
                borderColor: isCorrectOpt
                  ? 'rgba(104, 211, 145, 0.4)'
                  : isWrongOpt
                    ? 'rgba(252, 129, 129, 0.3)'
                    : isSelected
                      ? 'rgba(237, 171, 104, 0.3)'
                      : undefined,
                color: isCorrectOpt ? '#68D391' : isWrongOpt ? '#FC8181' : '#E2E8F0',
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
        <div className="glass-card-subtle mt-3 p-3 animate-fade-in" style={{ borderColor: 'rgba(104,211,145,0.2)' }}>
          <p className="text-xs font-mono" style={{ color: '#68D391' }}>
            Phase 2: Populate source geometry ✓
          </p>
          <p className="text-xs font-mono" style={{ color: '#68D391' }}>
            Phase 3: Fill hierarchy gaps ✓
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// Main FrameLevel component
// ═══════════════════════════════════════
export default function FrameLevel({ level, onCorrect, showReveal }) {
  const [frame, setFrame] = useState(null);
  const [protection, setProtection] = useState(null);
  const [anchorPos, setAnchorPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const dragStart = useRef(null);
  const frameAtDragStart = useRef(null);

  useEffect(() => {
    if (level.startFrame) {
      setFrame({ ...level.startFrame });
    }
    if (level.startProtection) {
      setProtection({ ...level.startProtection });
    }
    if (level.anchorStart) {
      setAnchorPos({ ...level.anchorStart });
    }
    setIsCorrect(false);
  }, [level.id]);

  // Route to subtypes
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

  // Default: canvas drag/resize
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

      <div className="flex justify-center gap-4 mt-3 font-mono text-sm" style={{ color: '#A0AEC0' }}>
        {readoutFrame && (
          <>
            {(level.draggable === 'position' || level.draggable === 'anchorMarker') && (
              <>
                <span>
                  x: <span style={{ color: '#EDAB68' }}>{Math.round(readoutFrame.x)}</span>
                </span>
                <span>
                  y: <span style={{ color: '#EDAB68' }}>{Math.round(readoutFrame.y)}</span>
                </span>
              </>
            )}
            {level.draggable !== 'anchorMarker' && (
              <>
                <span>
                  w: <span style={{ color: '#EDAB68' }}>{Math.round(readoutFrame.width)}</span>
                </span>
                <span>
                  h: <span style={{ color: '#EDAB68' }}>{Math.round(readoutFrame.height)}</span>
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
