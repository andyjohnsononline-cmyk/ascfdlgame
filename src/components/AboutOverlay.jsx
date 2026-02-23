export default function AboutOverlay({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(8, 10, 15, 0.88)' }}
      onClick={onClose}
    >
      <div
        className="glass-card p-6 max-w-md w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#E2E8F0' }}>
            About Frame It
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-all hover:scale-110"
            style={{ color: '#A0AEC0' }}
          >
            ✕
          </button>
        </div>

        <p className="text-sm mb-4 leading-relaxed" style={{ color: '#A0AEC0' }}>
          Learn the ASC Framing Decision List from four production perspectives:
          Post Supervisor, DIT, VFX Supervisor, and FDL Expert.
          Understand when to use FDL, how to build one, how it drives
          downstream VFX and delivery, and how to troubleshoot the pipeline.
        </p>

        <h3 className="font-semibold mb-2 text-sm tracking-wide" style={{ color: '#4FD1C5' }}>
          Resources
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://github.com/ascmitc/fdl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#EDAB68' }}
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
              style={{ color: '#EDAB68' }}
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
              style={{ color: '#EDAB68' }}
              className="hover:underline"
            >
              ASC FDL Official Page
            </a>
          </li>
          <li>
            <a
              href="https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115-Technical-Specifications-for-Image-and-Sound-Processing-in-MPS-Media-Production-Suite"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#EDAB68' }}
              className="hover:underline"
            >
              Netflix MPS Technical Specifications
            </a>
          </li>
          <li>
            <a
              href="https://production-technology-tools.netflixstudios.com/calculators"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#EDAB68' }}
              className="hover:underline"
            >
              Netflix Framing & Resolution Calculator
            </a>
          </li>
          <li>
            <a
              href="https://apetrynet.github.io/pyfdl/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#EDAB68' }}
              className="hover:underline"
            >
              pyfdl Python Toolkit
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
