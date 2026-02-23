import { useEffect, useState } from 'react';
import CharacterPortrait, { CHARACTER_NAMES } from './CharacterPortrait.jsx';

const ALL_CHARACTERS = ['robin', 'morgan', 'quinn', 'sage'];

const RESOURCE_LINKS = [
  { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  { label: 'Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  { label: 'ASC FDL Page', url: 'https://theasc.com/society/ascmitc/asc-framing-decision-list' },
  { label: 'Netflix MPS', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  { label: 'Framing Calculator', url: 'https://production-technology-tools.netflixstudios.com/calculators' },
  { label: 'pyfdl', url: 'https://apetrynet.github.io/pyfdl/' },
];

export default function GameComplete({ totalScenes, streak, onRestart }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4"
      style={{ backgroundColor: 'rgba(26, 48, 18, 0.95)', WebkitOverflowScrolling: 'touch' }}
    >
      <div className="min-h-full flex items-center justify-center">
      <div
        className={`text-center px-6 py-8 max-w-md w-full pixel-panel ${show ? 'animate-bounce-in' : 'opacity-0'}`}
      >
        <h1
          className="font-pixel text-sm mb-2"
          style={{ color: '#8b6914', textShadow: '2px 2px 0 rgba(139,105,20,0.3)' }}
        >
          PRODUCTION SAVED
        </h1>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#3d2b1f' }}>
          Thanks to the whole team, the FDL pipeline is fixed
          and every frame is being delivered exactly as the DP intended.
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {ALL_CHARACTERS.map((char) => (
            <div key={char} className="text-center">
              <div
                className="p-1 mb-1"
                style={{
                  border: '2px solid #8b5e3c',
                  background: '#2a1f14',
                }}
              >
                <CharacterPortrait character={char} expression="happy" size="lg" />
              </div>
              <p className="font-pixel text-[6px]" style={{ color: '#5a4432' }}>
                {CHARACTER_NAMES[char]}
              </p>
            </div>
          ))}
        </div>

        <div className="pixel-panel-dark p-4 mb-6 flex justify-around" style={{ background: '#e8dcc8', borderColor: '#8b5e3c' }}>
          <div className="text-center">
            <p className="text-xl font-bold font-mono" style={{ color: '#5b8c3e' }}>{totalScenes}</p>
            <p className="font-pixel text-[6px]" style={{ color: '#7a6350' }}>Scenes</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold font-mono" style={{ color: '#e8a94f' }}>{streak}x</p>
            <p className="font-pixel text-[6px]" style={{ color: '#7a6350' }}>Best Streak</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold font-mono" style={{ color: '#5ba3c9' }}>4</p>
            <p className="font-pixel text-[6px]" style={{ color: '#7a6350' }}>Chapters</p>
          </div>
        </div>

        <div className="pixel-panel p-4 mb-6 text-left" style={{ background: '#e8dcc8' }}>
          <h3
            className="font-pixel text-[8px] mb-3 text-center"
            style={{ color: '#8b6914' }}
          >
            WHAT YOU LEARNED
          </h3>
          <ul className="space-y-1.5 text-xs" style={{ color: '#5a4432' }}>
            {[
              'When and why to use FDL (Rule of Defaults)',
              'Camera Formats and MPS workflow',
              'Canvas setup from real camera sensors',
              'Framing Decisions from DP intent',
              'Protection zones for stabilization',
              'Multi-camera Contexts with shared intents',
              'Anamorphic squeeze and desqueeze',
              'FDL file metadata and structure',
              'Canvas Templates for VFX pulls',
              'fit_all vs fill for plate delivery',
              'Scale factors and rounding rules',
              'Alignment methods and the 8-phase pipeline',
              'Reference integrity and validation',
              'Protection is sacred — never auto-filled',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span style={{ color: '#5b8c3e' }}>\u2713</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3
            className="font-pixel text-[8px] mb-3 text-center"
            style={{ color: '#8b6914' }}
          >
            LEARN MORE
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {RESOURCE_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2.5 py-1 font-medium transition-opacity hover:opacity-80"
                style={{
                  color: '#8b6914',
                  border: '2px solid #d4c09a',
                  background: '#f5eed8',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="btn-primary w-full py-3 font-pixel text-[10px]"
        >
          PLAY AGAIN
        </button>
      </div>
      </div>
    </div>
  );
}
