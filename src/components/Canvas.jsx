import { useRef, useCallback } from 'react';

export default function Canvas({
  canvasDims,
  targetFrame,
  playerFrame,
  protectionFrame,
  protectionGuide,
  shownProtection,
  anchorMarker,
  labels,
  showTarget = true,
  isCorrect = false,
  isShaking = false,
  allowOverflow = false,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
}) {
  const containerRef = useRef(null);

  const toPercent = useCallback((px, axis) => {
    const total = axis === 'x' ? canvasDims.width : canvasDims.height;
    return (px / total) * 100;
  }, [canvasDims]);

  const frameStyle = (frame, color, dashed = false) => {
    if (!frame) return null;
    return {
      position: 'absolute',
      left: `${toPercent(frame.x || 0, 'x')}%`,
      top: `${toPercent(frame.y || 0, 'y')}%`,
      width: `${toPercent(frame.width, 'x')}%`,
      height: `${toPercent(frame.height, 'y')}%`,
      border: `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
      boxSizing: 'border-box',
      transition: 'all 0.25s ease-out',
      pointerEvents: 'none',
    };
  };

  const labelStyle = (color) => ({
    position: 'absolute',
    fontSize: '9px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color,
    opacity: 0.7,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  });

  const handlePointerDown = useCallback((e) => {
    if (!onPointerDown || !containerRef.current) return;
    e.preventDefault();
    containerRef.current.setPointerCapture(e.pointerId);
    const rect = containerRef.current.getBoundingClientRect();
    onPointerDown(e, rect);
  }, [onPointerDown]);

  const handlePointerMove = useCallback((e) => {
    if (!onPointerMove || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    onPointerMove(e, rect);
  }, [onPointerMove]);

  const handlePointerUp = useCallback((e) => {
    if (!onPointerUp) return;
    e.preventDefault();
    onPointerUp(e);
  }, [onPointerUp]);

  const aspectRatio = canvasDims.width / canvasDims.height;

  return (
    <div
      ref={containerRef}
      className={`relative w-full mx-auto select-none touch-none ${isShaking ? 'animate-shake' : ''} ${isCorrect ? 'animate-green-flash' : ''}`}
      style={{
        aspectRatio: `${aspectRatio}`,
        maxWidth: '100%',
        backgroundColor: '#1C2333',
        border: '1px solid #2D3748',
        borderRadius: '4px',
        cursor: onPointerDown ? 'grab' : 'default',
        overflow: allowOverflow ? 'visible' : 'hidden',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {labels?.canvas && (
        <span style={{ ...labelStyle('#4A5568'), top: 4, left: 6, zIndex: 5 }}>
          {labels.canvas}
        </span>
      )}

      {/* Target frame (dashed guide) */}
      {showTarget && targetFrame && (
        <div style={frameStyle(targetFrame, 'rgba(74, 85, 104, 0.4)', true)} />
      )}

      {/* Protection target guide (dashed cyan) */}
      {protectionGuide && (
        <div style={frameStyle(protectionGuide, 'rgba(79, 209, 197, 0.35)', true)} />
      )}

      {/* Protection frame (cyan, draggable — rendered behind the framing decision) */}
      {protectionFrame && (
        <div style={frameStyle(protectionFrame, isCorrect ? '#68D391' : '#4FD1C5', false)}>
          {labels?.protection && (
            <span style={{ ...labelStyle(isCorrect ? '#68D391' : '#4FD1C5'), top: -16, left: 0 }}>
              {labels.protection}
            </span>
          )}
        </div>
      )}

      {/* Shown protection (for fix levels — wrong protection) */}
      {shownProtection && (
        <div style={frameStyle(shownProtection, '#FC8181', true)}>
          {labels?.protection && (
            <span style={{ ...labelStyle('#FC8181'), top: -16, left: 0 }}>
              {labels.protection}
            </span>
          )}
        </div>
      )}

      {/* Player's active frame / framing decision (amber — rendered on top of protection) */}
      {playerFrame && (
        <div
          style={{
            ...frameStyle(playerFrame, isCorrect ? '#68D391' : '#F6AD55', false),
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {labels?.frame && (
            <span style={{
              ...labelStyle(isCorrect ? '#68D391' : '#F6AD55'),
              bottom: -16,
              left: 0,
            }}>
              {labels.frame}
            </span>
          )}
        </div>
      )}

      {/* Anchor marker (crosshair) */}
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
            <line x1="14" y1="0" x2="14" y2="28" stroke={isCorrect ? '#68D391' : '#F6AD55'} strokeWidth="2" />
            <line x1="0" y1="14" x2="28" y2="14" stroke={isCorrect ? '#68D391' : '#F6AD55'} strokeWidth="2" />
            <circle cx="14" cy="14" r="6" stroke={isCorrect ? '#68D391' : '#F6AD55'} strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {children}
    </div>
  );
}
