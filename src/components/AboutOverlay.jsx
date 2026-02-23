export default function AboutOverlay({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13, 17, 23, 0.92)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 max-w-md w-full animate-slide-up"
        style={{
          backgroundColor: '#1C2333',
          border: '1px solid #2D3748',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#E2E8F0' }}>
            About Frame It
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors"
            style={{ color: '#A0AEC0' }}
          >
            ✕
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: '#A0AEC0' }}>
          An interactive game to learn the ASC Framing Decision List —
          the industry standard for communicating creative framing from set to screen,
          including the Canvas Template application pipeline.
        </p>

        <h3 className="font-semibold mb-2 text-sm" style={{ color: '#4FD1C5' }}>
          Resources
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://github.com/ascmitc/fdl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F6AD55' }}
              className="hover:underline"
            >
              ASC FDL Spec & Docs
            </a>
          </li>
          <li>
            <a
              href="https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F6AD55' }}
              className="hover:underline"
            >
              FDL Template Implementer Guide
            </a>
          </li>
          <li>
            <a
              href="https://theasc.com/society/ascmitc/asc-framing-decision-list"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F6AD55' }}
              className="hover:underline"
            >
              ASC FDL Official Page
            </a>
          </li>
          <li>
            <a
              href="https://apetrynet.github.io/pyfdl/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F6AD55' }}
              className="hover:underline"
            >
              pyfdl Python Toolkit
            </a>
          </li>
          <li>
            <span style={{ color: '#A0AEC0' }}>
              Netflix Framing Working Resolution Calculator — search online
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
