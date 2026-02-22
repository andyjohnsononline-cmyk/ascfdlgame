export default function JsonReveal({ lines, highlightKeys = [], visible }) {
  if (!visible) return null;

  const highlightLine = (line) => {
    const parts = [];
    let remaining = line;
    let idx = 0;

    while (remaining.length > 0) {
      // Match JSON key: "key"
      const keyMatch = remaining.match(/^("[\w_.]+")\s*:/);
      if (keyMatch) {
        const key = keyMatch[1];
        const keyName = key.replace(/"/g, '');
        const isHighlighted = highlightKeys.includes(keyName);
        parts.push(
          <span
            key={idx++}
            className={isHighlighted ? 'rounded px-0.5' : ''}
            style={{
              color: '#4FD1C5',
              backgroundColor: isHighlighted ? 'rgba(246, 173, 85, 0.15)' : 'transparent',
            }}
          >
            {key}
          </span>
        );
        parts.push(<span key={idx++} style={{ color: '#718096' }}>: </span>);
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }

      // Match string value: "value"
      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#68D391' }}>
            "{strMatch[1]}"
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // Match number
      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#F6AD55' }}>
            {numMatch[1]}
          </span>
        );
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // Match brackets / braces
      const bracketMatch = remaining.match(/^([{}[\],])/);
      if (bracketMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#718096' }}>
            {bracketMatch[1]}
          </span>
        );
        remaining = remaining.slice(1);
        continue;
      }

      // Match comment: // ...
      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#A0AEC0', fontStyle: 'italic' }}>
            {commentMatch[1]}
          </span>
        );
        remaining = '';
        continue;
      }

      // Match arrow or special chars
      const arrowMatch = remaining.match(/^(←[^"]*)/);
      if (arrowMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#68D391', fontStyle: 'italic' }}>
            {arrowMatch[1]}
          </span>
        );
        remaining = remaining.slice(arrowMatch[0].length);
        continue;
      }

      // Default: take one character
      parts.push(
        <span key={idx++} style={{ color: '#E2E8F0' }}>
          {remaining[0]}
        </span>
      );
      remaining = remaining.slice(1);
    }

    return parts;
  };

  const codeLines = lines.split('\n');

  return (
    <div className="animate-slide-up mt-4">
      <div
        className="rounded-lg p-4 font-mono text-sm leading-relaxed"
        style={{
          backgroundColor: 'rgba(28, 35, 51, 0.8)',
          border: '1px solid #2D3748',
          minHeight: '40px',
          fontSize: '14px',
        }}
      >
        <div className="text-xs font-sans font-medium mb-2" style={{ color: '#4FD1C5' }}>
          JSON
        </div>
        {codeLines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {highlightLine(line)}
          </div>
        ))}
      </div>
    </div>
  );
}
