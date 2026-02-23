import { useRef, useCallback, useState, useEffect } from 'react';

export default function Canvas({
  canvasDims,
  targetFrame,
  playerFrame,
  effectiveFrame,
  protectionFrame,
  protectionGuide,
  shownProtection,
  anchorMarker,
  labels,
  showTarget = true,
  showCanvasOutline = false,
  isCorrect = false,
  isShaking = false,
  allowOverflow = false,
  layers,
  selectedLayer,
  onLayerSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
}) {
  const containerRef = useRef(null);
  const [staggerReady, setStaggerReady] = useState([]);

  const hasHierarchy = !!(effectiveFrame || protectionFrame || (labels && (labels.effective || labels.protection)));
  useEffect(() => {
    if (!hasHierarchy && !layers) return;
    const layerCount = layers ? 4 : 3;
    const timers = [];
    for (let i = 0; i < layerCount; i++) {
      timers.push(
        setTimeout(() => {
          setStaggerReady((prev) => [...prev, i]);
        }, 100 * (i + 1))
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [hasHierarchy, layers]);

  const toPercent = useCallback(
    (px, axis) => {
      const total = axis === 'x' ? canvasDims.width : canvasDims.height;
      return (px / total) * 100;
    },
    [canvasDims]
  );

  const frameStyle = (frame, color, dashed = false, extra = {}) => {
    if (!frame) return null;
    return {
      position: 'absolute',
      left: `${toPercent(frame.x || 0, 'x')}%`,
      top: `${toPercent(frame.y || 0, 'y')}%`,
      width: `${toPercent(frame.width, 'x')}%`,
      height: `${toPercent(frame.height, 'y')}%`,
      border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`,
      boxSizing: 'border-box',
      transition: 'all 0.25s ease-out',
      pointerEvents: 'none',
      ...extra,
    };
  };

  const labelStyle = (color) => ({
    position: 'absolute',
    fontSize: '9px',
    fontFamily: 'var(--font-pixel)',
    fontWeight: 400,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color,
    opacity: 0.85,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  });

  const handlePointerDown = useCallback(
    (e) => {
      if (!onPointerDown || !containerRef.current) return;
      e.preventDefault();
      containerRef.current.setPointerCapture(e.pointerId);
      const rect = containerRef.current.getBoundingClientRect();
      onPointerDown(e, rect);
    },
    [onPointerDown]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!onPointerMove || !containerRef.current) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      onPointerMove(e, rect);
    },
    [onPointerMove]
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!onPointerUp) return;
      e.preventDefault();
      onPointerUp(e);
    },
    [onPointerUp]
  );

  const aspectRatio = canvasDims.width / canvasDims.height;

  const isLayerSelectMode = !!layers;

  const layerDefs = isLayerSelectMode
    ? [
        {
          key: 'canvas',
          frame: { width: canvasDims.width, height: canvasDims.height, x: 0, y: 0 },
          color: '#8D6E63',
          label: 'CANVAS',
          pathLabel: 'canvas.dimensions',
        },
        {
          key: 'effective',
          frame: layers.effective || effectiveFrame,
          color: '#795548',
          label: 'EFFECTIVE',
          pathLabel: 'canvas.effective_dimensions',
        },
        {
          key: 'protection',
          frame: layers.protection || protectionFrame,
          color: '#4DB6AC',
          label: 'PROTECTION',
          pathLabel: 'protection_dimensions',
        },
        {
          key: 'framing',
          frame: layers.framing,
          color: '#E8A946',
          label: 'FRAMING',
          pathLabel: 'framing_decision.dimensions',
        },
      ].filter((l) => l.frame)
    : null;

  return (
    <div
      ref={containerRef}
      className={`pixel-canvas relative w-full mx-auto select-none touch-none ${isShaking ? 'animate-shake' : ''} ${isCorrect ? 'animate-green-flash' : ''}`}
      style={{
        aspectRatio: `${aspectRatio}`,
        maxWidth: '100%',
        cursor: onPointerDown ? 'grab' : 'default',
        overflow: allowOverflow ? 'visible' : 'hidden',
        borderColor: isCorrect ? '#4CAF50' : '#5D3A1A',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Canvas label */}
      {labels?.canvas && (
        <span style={{ ...labelStyle('#8D6E63'), top: 4, left: 6, zIndex: 5, fontSize: '8px' }}>
          {labels.canvas}
        </span>
      )}

      {/* Effective canvas (dotted) */}
      {effectiveFrame && !isLayerSelectMode && (
        <div
          style={{
            ...frameStyle(effectiveFrame, '#795548', true),
            opacity: staggerReady.includes(0) ? 1 : 0,
          }}
        >
          {labels?.effective && (
            <span style={{ ...labelStyle('#795548'), top: 4, left: 4, fontSize: '8px' }}>
              {labels.effective}
            </span>
          )}
        </div>
      )}

      {/* Target frame (dashed guide) */}
      {showTarget && targetFrame && (
        <div style={frameStyle(targetFrame, 'rgba(139, 105, 20, 0.4)', true)} />
      )}

      {/* Protection target guide */}
      {protectionGuide && (
        <div style={frameStyle(protectionGuide, 'rgba(77, 182, 172, 0.35)', true)} />
      )}

      {/* Protection frame */}
      {protectionFrame && !isLayerSelectMode && (
        <div
          style={{
            ...frameStyle(protectionFrame, isCorrect ? '#4CAF50' : '#4DB6AC', false),
            opacity: staggerReady.includes(1) ? 1 : 0,
          }}
        >
          {labels?.protection && (
            <span style={{ ...labelStyle(isCorrect ? '#4CAF50' : '#4DB6AC'), top: -16, left: 0, fontSize: '8px' }}>
              {labels.protection}
            </span>
          )}
        </div>
      )}

      {/* Shown protection (fix levels) */}
      {shownProtection && (
        <div style={frameStyle(shownProtection, '#E57373', true)}>
          {labels?.protection && (
            <span style={{ ...labelStyle('#E57373'), top: -16, left: 0, fontSize: '8px' }}>
              {labels.protection}
            </span>
          )}
        </div>
      )}

      {/* Player frame (amber) */}
      {playerFrame && !isLayerSelectMode && (
        <div
          style={{
            ...frameStyle(playerFrame, isCorrect ? '#4CAF50' : '#E8A946', false),
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {labels?.frame && (
            <span
              style={{
                ...labelStyle(isCorrect ? '#4CAF50' : '#E8A946'),
                bottom: -16,
                left: 0,
                fontSize: '8px',
              }}
            >
              {labels.frame}
            </span>
          )}
        </div>
      )}

      {/* Layer-select mode */}
      {isLayerSelectMode &&
        layerDefs.map((layer, idx) => {
          const isSelected = selectedLayer === layer.key;
          const borderColor = isSelected ? '#FFF8E7' : layer.color;
          const borderWidth = isSelected ? 4 : 3;
          return (
            <div
              key={layer.key}
              onClick={(e) => {
                e.stopPropagation();
                onLayerSelect?.(layer.key);
              }}
              style={{
                ...frameStyle(layer.frame, borderColor, layer.key === 'effective'),
                border: `${borderWidth}px ${layer.key === 'effective' ? 'dotted' : 'solid'} ${borderColor}`,
                pointerEvents: 'auto',
                cursor: 'pointer',
                zIndex: idx + 1,
                opacity: staggerReady.includes(idx) ? 1 : 0,
                backgroundColor: isSelected ? `${layer.color}20` : 'transparent',
              }}
            >
              <span
                style={{
                  ...labelStyle(isSelected ? '#FFF8E7' : layer.color),
                  top: 4,
                  left: 4,
                  opacity: 1,
                  fontSize: '8px',
                }}
              >
                {layer.label}
              </span>
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    fontSize: '8px',
                    fontFamily: 'var(--font-mono)',
                    color: '#E8A946',
                    fontWeight: 700,
                  }}
                >
                  {layer.pathLabel}
                </span>
              )}
            </div>
          );
        })}

      {/* Anchor marker */}
      {anchorMarker && (
        <div
          style={{
            position: 'absolute',
            left: `${toPercent(anchorMarker.x, 'x')}%`,
            top: `${toPercent(anchorMarker.y, 'y')}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.15s ease-out',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="14" y1="0" x2="14" y2="28" stroke={isCorrect ? '#4CAF50' : '#E8A946'} strokeWidth="3" />
            <line x1="0" y1="14" x2="28" y2="14" stroke={isCorrect ? '#4CAF50' : '#E8A946'} strokeWidth="3" />
            <rect x="8" y="8" width="12" height="12" stroke={isCorrect ? '#4CAF50' : '#E8A946'} strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {children}
    </div>
  );
}
