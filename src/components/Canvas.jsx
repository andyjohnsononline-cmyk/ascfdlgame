import { useRef, useCallback } from 'react';

export default function Canvas({
  canvasDims,
  targetFrame,
  playerFrame,
  protectionFrame,
  shownProtection,
  showTarget = true,
  isCorrect = false,
  isShaking = false,
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
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Target frame (dashed guide) */}
      {showTarget && targetFrame && (
        <div style={frameStyle(targetFrame, 'rgba(74, 85, 104, 0.4)', true)} />
      )}

      {/* Protection frame (cyan) */}
      {protectionFrame && (
        <div style={frameStyle(protectionFrame, '#4FD1C5', false)} />
      )}

      {/* Shown protection (for fix levels — wrong protection) */}
      {shownProtection && (
        <div style={frameStyle(shownProtection, '#FC8181', true)} />
      )}

      {/* Player's active frame (amber) */}
      {playerFrame && (
        <div
          style={{
            ...frameStyle(playerFrame, isCorrect ? '#68D391' : '#F6AD55', false),
            pointerEvents: 'none',
          }}
        />
      )}

      {children}
    </div>
  );
}
