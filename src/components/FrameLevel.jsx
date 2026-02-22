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
              className="px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-pre-line text-center"
              style={{
                backgroundColor: isPlaced
                  ? '#2D3748'
                  : selectedCard === card.id
                    ? '#F6AD55'
                    : '#1C2333',
                color: isPlaced
                  ? '#4A5568'
                  : selectedCard === card.id
                    ? '#0D1117'
                    : '#E2E8F0',
                border: `2px solid ${
                  selectedCard === card.id ? '#F6AD55' : '#2D3748'
                }`,
                opacity: isPlaced ? 0.5 : 1,
                minWidth: '100px',
              }}
            >
              {card.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {level.slots.map((slot) => {
          const filledCard = placed[slot.id]
            ? level.cards.find((c) => c.id === placed[slot.id])
            : null;
          const isWrong = wrongSlot === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => handleSlotTap(slot)}
              className={`w-full px-4 py-3 rounded-lg text-left font-mono text-sm transition-all ${isWrong ? 'animate-shake' : ''}`}
              style={{
                backgroundColor: filledCard ? 'rgba(104, 211, 145, 0.1)' : 'rgba(28, 35, 51, 0.6)',
                border: `2px dashed ${
                  filledCard
                    ? '#68D391'
                    : isWrong
                      ? '#FC8181'
                      : selectedCard
                        ? '#F6AD55'
                        : '#2D3748'
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
              className="px-4 py-2 rounded text-left font-mono text-sm transition-all"
              style={{
                backgroundColor: values[field.key]
                  ? 'rgba(104, 211, 145, 0.1)'
                  : '#1C2333',
                border: `1px solid ${values[field.key] ? '#68D391' : '#2D3748'}`,
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
                  className="px-4 py-2 rounded font-mono text-sm transition-all"
                  style={{
                    backgroundColor:
                      values[field.key] === opt
                        ? opt === field.correct
                          ? 'rgba(104, 211, 145, 0.15)'
                          : 'rgba(252, 129, 129, 0.15)'
                        : '#1C2333',
                    border: `1px solid ${
                      values[field.key] === opt
                        ? opt === field.correct ? '#68D391' : '#FC8181'
                        : '#2D3748'
                    }`,
                    color: values[field.key] === opt
                      ? opt === field.correct ? '#68D391' : '#FC8181'
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
              className="px-4 py-2 rounded font-mono text-sm outline-none"
              style={{
                backgroundColor: '#1C2333',
                border: '1px solid #2D3748',
                color: '#E2E8F0',
              }}
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
            className="w-full px-4 py-3 rounded-lg text-left font-mono text-sm transition-all"
            style={{
              backgroundColor: isSelected
                ? isCorrect
                  ? 'rgba(104, 211, 145, 0.15)'
                  : 'rgba(252, 129, 129, 0.15)'
                : '#1C2333',
              border: `1px solid ${
                isSelected
                  ? isCorrect ? '#68D391' : '#FC8181'
                  : '#2D3748'
              }`,
              color: isSelected
                ? isCorrect ? '#68D391' : '#FC8181'
                : '#E2E8F0',
            }}
          >
            "{opt.id}" — {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function MatchLevel({ level, onCorrect }) {
  const [assignments, setAssignments] = useState({});
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [wrongTarget, setWrongTarget] = useState(null);
  const [done, setDone] = useState(false);
  const canvasDims = level.canvas;

  const sorted = [...level.matchItems].sort((a, b) => b.ratio - a.ratio);

  const getFrameForRatio = (ratio) => {
    const h = Math.round(canvasDims.width / ratio / 2) * 2;
    const y = Math.round((canvasDims.height - h) / 2);
    return { width: canvasDims.width, height: h, x: 0, y };
  };

  const handleLabelTap = (label) => {
    if (done) return;
    setSelectedLabel(label === selectedLabel ? null : label);
    setWrongTarget(null);
  };

  const handleFrameTap = (item) => {
    if (done || !selectedLabel) return;
    if (selectedLabel === item.label) {
      const next = { ...assignments, [item.label]: true };
      setAssignments(next);
      setSelectedLabel(null);
      if (Object.keys(next).length === level.matchItems.length) {
        setDone(true);
        setTimeout(() => onCorrect(), 300);
      }
    } else {
      setWrongTarget(item.label);
      setTimeout(() => setWrongTarget(null), 500);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {level.matchItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleLabelTap(item.label)}
            disabled={assignments[item.label]}
            className="px-3 py-2 rounded font-mono text-sm transition-all"
            style={{
              backgroundColor:
                assignments[item.label]
                  ? '#2D3748'
                  : selectedLabel === item.label
                    ? '#F6AD55'
                    : '#1C2333',
              color:
                assignments[item.label]
                  ? '#4A5568'
                  : selectedLabel === item.label
                    ? '#0D1117'
                    : '#E2E8F0',
              border: `1px solid ${selectedLabel === item.label ? '#F6AD55' : '#2D3748'}`,
              opacity: assignments[item.label] ? 0.5 : 1,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sorted.map((item) => {
          const frame = getFrameForRatio(item.ratio);
          const matched = assignments[item.label];
          const isWrong = wrongTarget === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleFrameTap(item)}
              className={`rounded-lg p-1 transition-all ${isWrong ? 'animate-shake' : ''}`}
              style={{
                backgroundColor: 'rgba(28, 35, 51, 0.6)',
                border: `2px solid ${
                  matched ? '#68D391' : isWrong ? '#FC8181' : selectedLabel ? '#F6AD55' : '#2D3748'
                }`,
              }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${canvasDims.width}/${canvasDims.height}`,
                  backgroundColor: '#1C2333',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${(frame.x / canvasDims.width) * 100}%`,
                    top: `${(frame.y / canvasDims.height) * 100}%`,
                    width: `${(frame.width / canvasDims.width) * 100}%`,
                    height: `${(frame.height / canvasDims.height) * 100}%`,
                    border: `2px solid ${matched ? '#68D391' : '#F6AD55'}`,
                  }}
                />
              </div>
              {matched && (
                <div className="text-xs font-mono mt-1" style={{ color: '#68D391' }}>
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
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

  if (level.subtype === 'connect') {
    return (
      <div>
        <ConnectLevel level={level} onCorrect={onCorrect} />
        <JsonReveal
          lines={level.reveal.lines}
          highlightKeys={level.reveal.highlightKeys}
          visible={showReveal}
        />
      </div>
    );
  }

  if (level.subtype === 'match') {
    return (
      <div>
        <MatchLevel level={level} onCorrect={onCorrect} />
        <JsonReveal
          lines={level.reveal.lines}
          highlightKeys={level.reveal.highlightKeys}
          visible={showReveal}
        />
      </div>
    );
  }

  if (level.subtype === 'fillHeader') {
    return (
      <div>
        <FillHeaderLevel level={level} onCorrect={onCorrect} />
        <JsonReveal
          lines={level.reveal.lines}
          highlightKeys={level.reveal.highlightKeys}
          visible={showReveal}
        />
      </div>
    );
  }

  if (level.subtype === 'pickDefault') {
    return (
      <div>
        <PickDefaultLevel level={level} onCorrect={onCorrect} />
        <JsonReveal
          lines={level.reveal.lines}
          highlightKeys={level.reveal.highlightKeys}
          visible={showReveal}
        />
      </div>
    );
  }

  const canvasDims = level.canvas;
  const target = level.target;

  const checkSnap = useCallback((val) => {
    if (!target || isCorrect) return false;
    const draggable = level.draggable;
    const tol = level.tolerance || 0.08;

    if (draggable === 'anchorMarker') {
      const at = level.anchorTarget;
      const yTol = canvasDims.height * tol;
      return Math.abs(val.y - at.y) <= yTol && Math.abs(val.x - at.x) <= canvasDims.width * tol;
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
  }, [target, level, canvasDims, isCorrect]);

  const handlePointerDown = useCallback((e, rect) => {
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
  }, [isCorrect, frame, protection, anchorPos, level]);

  const handlePointerMove = useCallback((e, rect) => {
    if (!isDragging || isCorrect || !dragStart.current) return;

    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const dxPct = xPct - dragStart.current.xPct;
    const dyPct = yPct - dragStart.current.yPct;

    const draggable = level.draggable;
    const startF = frameAtDragStart.current;

    if (draggable === 'anchorMarker') {
      const newY = Math.round(startF.y + dyPct * canvasDims.height);
      const clampedY = Math.max(0, Math.min(newY, canvasDims.height));
      const newPos = { x: 0, y: clampedY };
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
      const newW = Math.max(minW, Math.round((startF.width + avgD * 2) / 2) * 2);
      const newH = Math.max(minH, Math.round((startF.height + avgD * 2) / 2) * 2);
      const p = { width: Math.min(newW, canvasDims.width), height: Math.min(newH, canvasDims.height) };
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
  }, [isDragging, isCorrect, level, canvasDims, frame, target, checkSnap, onCorrect, protection, anchorPos]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const currentFrame = frame || level.startFrame;
  const displayFrame = level.draggable === 'protection' ? level.target : currentFrame;

  const protectionDisplay = level.draggable === 'protection'
    ? protection || level.startProtection
    : null;
  const protectionCentered = protectionDisplay
    ? {
        width: protectionDisplay.width,
        height: protectionDisplay.height,
        x: (canvasDims.width - protectionDisplay.width) / 2,
        y: (canvasDims.height - protectionDisplay.height) / 2,
      }
    : null;

  const currentAnchor = level.draggable === 'anchorMarker'
    ? anchorPos || level.anchorStart
    : null;

  const readoutFrame = level.draggable === 'protection'
    ? protectionDisplay
    : level.draggable === 'anchorMarker'
      ? currentAnchor
      : currentFrame;

  return (
    <div>
      <Canvas
        canvasDims={canvasDims}
        targetFrame={target}
        playerFrame={displayFrame}
        protectionFrame={protectionCentered}
        anchorMarker={currentAnchor}
        labels={level.labels}
        isCorrect={isCorrect}
        showTarget={level.draggable !== 'anchorMarker'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <div
        className="flex justify-center gap-4 mt-3 font-mono text-sm"
        style={{ color: '#A0AEC0' }}
      >
        {readoutFrame && (
          <>
            {(level.draggable === 'position' || level.draggable === 'anchorMarker') && (
              <>
                <span>
                  x: <span style={{ color: '#F6AD55' }}>{Math.round(readoutFrame.x)}</span>
                </span>
                <span>
                  y: <span style={{ color: '#F6AD55' }}>{Math.round(readoutFrame.y)}</span>
                </span>
              </>
            )}
            {(level.draggable !== 'anchorMarker') && (
              <>
                <span>
                  w: <span style={{ color: '#F6AD55' }}>{Math.round(readoutFrame.width)}</span>
                </span>
                <span>
                  h: <span style={{ color: '#F6AD55' }}>{Math.round(readoutFrame.height)}</span>
                </span>
              </>
            )}
          </>
        )}
      </div>

      <JsonReveal
        lines={level.reveal.lines}
        highlightKeys={level.reveal.highlightKeys}
        visible={showReveal}
      />
    </div>
  );
}
