export default function JsonReveal({ lines, highlightKeys = [], visible, docRef }) {
  if (!visible || !lines) return null;

  const highlightLine = (line) => {
    const parts = [];
    let remaining = line;
    let idx = 0;

    while (remaining.length > 0) {
      const keyMatch = remaining.match(/^("[\w_.]+")\s*:/);
      if (keyMatch) {
        const key = keyMatch[1];
        const keyName = key.replace(/"/g, '');
        const isHighlighted = highlightKeys.includes(keyName);
        parts.push(
          <span
            key={idx++}
            className={isHighlighted ? 'px-0.5' : ''}
            style={{
              color: '#2E7D32',
              backgroundColor: isHighlighted ? 'rgba(232, 169, 70, 0.2)' : 'transparent',
              fontWeight: isHighlighted ? 700 : 400,
            }}
          >
            {key}
          </span>
        );
        parts.push(<span key={idx++} style={{ color: '#795548' }}>: </span>);
        remaining = remaining.slice(keyMatch[0].length);
        continue;
      }

      const strMatch = remaining.match(/^"([^"]*)"/);
      if (strMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#E65100' }}>
            "{strMatch[1]}"
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      const numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#1565C0' }}>
            {numMatch[1]}
          </span>
        );
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      const bracketMatch = remaining.match(/^([{}[\],])/);
      if (bracketMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#795548' }}>
            {bracketMatch[1]}
          </span>
        );
        remaining = remaining.slice(1);
        continue;
      }

      const commentMatch = remaining.match(/^(\/\/.*)/);
      if (commentMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#8D6E63', fontStyle: 'italic' }}>
            {commentMatch[1]}
          </span>
        );
        remaining = '';
        continue;
      }

      const arrowMatch = remaining.match(/^(←[^"]*)/);
      if (arrowMatch) {
        parts.push(
          <span key={idx++} style={{ color: '#E57373', fontStyle: 'italic', fontWeight: 700 }}>
            {arrowMatch[1]}
          </span>
        );
        remaining = remaining.slice(arrowMatch[0].length);
        continue;
      }

      parts.push(
        <span key={idx++} style={{ color: '#3E2723' }}>
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
      <div className="pixel-panel p-4 font-mono text-sm leading-relaxed overflow-x-auto" style={{ minHeight: '40px', fontSize: '13px' }}>
        <div
          className="pixel-header mb-2"
          style={{ color: '#2E7D32', fontSize: '8px' }}
        >
          FDL
        </div>
        {codeLines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {highlightLine(line)}
          </div>
        ))}
      </div>

      {docRef && (
        <a
          href={docRef.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium mt-2 px-3 py-1.5 transition-opacity hover:opacity-80"
          style={{
            color: '#6D4C41',
            border: '2px solid #D7CCC8',
            background: '#FFF8E7',
          }}
        >
          <span style={{ fontSize: '14px' }}>&#x1F4D6;</span>
          {docRef.label}
          <span style={{ color: '#8D6E63' }}>&rarr;</span>
        </a>
      )}
    </div>
  );
}
