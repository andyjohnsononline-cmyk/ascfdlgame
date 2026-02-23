import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SCENES,
  CHAPTER_NAMES,
  CHAPTER_REWARDS,
  CHAPTER_RANGES,
  CHAPTER_BACKGROUNDS,
  CHAPTER_CHARACTERS,
  getChapterForScene,
  isLastSceneInChapter,
  getChapterSceneCount,
  getChapterCompletedCount,
  getFirstIncompleteSceneInChapter,
  isChapterComplete,
  getSceneIndexInChapter,
} from './scenes.js';
import SceneBackground from './components/SceneBackground.jsx';
import DialogueBox from './components/DialogueBox.jsx';
import CharacterPortrait, { CHARACTER_NAMES } from './components/CharacterPortrait.jsx';
import FrameLevel from './components/FrameLevel.jsx';
import FixLevel from './components/FixLevel.jsx';
import PickLevel from './components/PickLevel.jsx';
import ZoneComplete from './components/ZoneComplete.jsx';
import GameComplete from './components/GameComplete.jsx';
import ChapterSelect from './components/ChapterSelect.jsx';

const PHASE_DIALOGUE = 'dialogue';
const PHASE_CHALLENGE = 'challenge';
const PHASE_SUCCESS = 'success';
const PHASE_REVEAL = 'reveal';

const SAVE_KEY = 'frameit_save';

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      completedScenes: new Set(data.completedScenes || []),
      bestStreak: data.bestStreak || 0,
      currentScene: data.currentScene || 1,
    };
  } catch {
    return null;
  }
}

function writeSave(completedScenes, bestStreak, currentScene) {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        completedScenes: [...completedScenes],
        bestStreak,
        currentScene,
      })
    );
  } catch {
    // Storage unavailable — silently degrade
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // noop
  }
}

export default function App() {
  const saved = useRef(loadSave());
  const hasSave = saved.current && saved.current.completedScenes.size > 0;

  const [currentScene, setCurrentScene] = useState(hasSave ? saved.current.currentScene : 1);
  const [phase, setPhase] = useState(PHASE_DIALOGUE);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(hasSave ? saved.current.bestStreak : 0);
  const [completedScenes, setCompletedScenes] = useState(hasSave ? saved.current.completedScenes : new Set());
  const [showReveal, setShowReveal] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [showHintText, setShowHintText] = useState(false);
  const [showChapterComplete, setShowChapterComplete] = useState(null);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [showChapterSelect, setShowChapterSelect] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [streakBump, setStreakBump] = useState(false);
  const [sceneTransition, setSceneTransition] = useState(false);
  const hintTimerRef = useRef(null);

  const scene = SCENES.find((s) => s.id === currentScene);
  const chapterIndex = getChapterForScene(currentScene);
  const totalScenes = SCENES.length;

  useEffect(() => {
    setShowReveal(false);
    setHintVisible(false);
    setShowHintText(false);
    setPhase(PHASE_DIALOGUE);

    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [currentScene]);

  const handleDialogueComplete = useCallback(() => {
    setPhase(PHASE_CHALLENGE);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => {
      setHintVisible(true);
    }, 12000);
  }, []);

  const handleCorrect = useCallback(() => {
    setShowReveal(true);
    setPhase(PHASE_SUCCESS);
    let newBest;
    setStreak((s) => {
      const next = s + 1;
      setBestStreak((b) => {
        newBest = Math.max(b, next);
        return newBest;
      });
      return next;
    });
    setStreakBump(true);
    setTimeout(() => setStreakBump(false), 300);
    setCompletedScenes((prev) => {
      const next = new Set([...prev, currentScene]);
      writeSave(next, newBest ?? bestStreak, currentScene);
      if (next.size === totalScenes) {
        setTimeout(() => setShowGameComplete(true), 800);
      }
      return next;
    });

    setTimeout(() => {
      setPhase(PHASE_REVEAL);
    }, 2000);
  }, [currentScene, totalScenes, bestStreak]);

  const handleWrong = useCallback(() => {
    setStreak(0);
  }, []);

  const transitionToScene = useCallback((nextId) => {
    setSceneTransition(true);
    setTimeout(() => {
      setCurrentScene(nextId);
      setSceneTransition(false);
    }, 200);
  }, []);

  const handleNext = useCallback(() => {
    if (scene.isGameEnd) {
      setShowGameComplete(true);
      return;
    }

    if (isLastSceneInChapter(currentScene)) {
      setShowChapterComplete(chapterIndex);
      return;
    }

    const nextId = currentScene + 1;
    if (nextId <= totalScenes) {
      transitionToScene(nextId);
    }
  }, [currentScene, scene, chapterIndex, totalScenes, transitionToScene]);

  const handleChapterContinue = useCallback(() => {
    setShowChapterComplete(null);
    const nextChapter = chapterIndex + 1;
    if (nextChapter < CHAPTER_RANGES.length) {
      const nextSceneId = getFirstIncompleteSceneInChapter(nextChapter, completedScenes);
      transitionToScene(nextSceneId);
    }
  }, [chapterIndex, completedScenes, transitionToScene]);

  const handleRestart = useCallback(() => {
    clearSave();
    setShowGameComplete(false);
    setCurrentScene(1);
    setCompletedScenes(new Set());
    setStreak(0);
    setBestStreak(0);
  }, []);

  const handleResetProgress = useCallback(() => {
    clearSave();
    setCompletedScenes(new Set());
    setStreak(0);
    setBestStreak(0);
    setCurrentScene(1);
  }, []);

  const handleSelectScene = useCallback((sceneId) => {
    setCurrentScene(sceneId);
    setShowReveal(false);
    setShowChapterSelect(false);
    setHasStarted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !showChapterSelect) {
        setShowChapterSelect(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showChapterSelect]);

  if (!scene) return null;

  const chapterSceneCount = getChapterSceneCount(chapterIndex);
  const chapterCompleted = getChapterCompletedCount(chapterIndex, completedScenes);
  const chapterProgressPct = (chapterCompleted / chapterSceneCount) * 100;
  const background = CHAPTER_BACKGROUNDS[chapterIndex];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Scene background */}
      <SceneBackground scene={background} visible={!showChapterSelect} />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            {/* Chapter dots */}
            <button
              className="flex items-center gap-1 py-2 -my-2 px-1 -mx-1"
              onClick={() => setShowChapterSelect(true)}
              title="Choose a chapter"
              style={{ minHeight: '44px' }}
            >
              {CHAPTER_RANGES.map((_, ci) => {
                const complete = isChapterComplete(ci, completedScenes);
                const partial = !complete && getChapterCompletedCount(ci, completedScenes) > 0;
                const isCurrent = ci === chapterIndex;
                const dotColor = complete
                  ? '#4CAF50'
                  : partial || isCurrent
                    ? '#E8A946'
                    : '#5D3A1A';
                return (
                  <span
                    key={ci}
                    className="block w-4 h-4 transition-all"
                    style={{
                      backgroundColor: dotColor,
                      cursor: 'pointer',
                      border: '2px solid #3E2723',
                      transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                      opacity: !complete && !partial && !isCurrent ? 0.4 : 1,
                    }}
                    title={CHAPTER_NAMES[ci]}
                  />
                );
              })}
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`font-mono font-bold text-sm ${streakBump ? 'animate-streak-bump' : ''}`}
                style={{
                  color: streak > 0 ? '#E8A946' : '#8D6E63',
                  textShadow: streak > 0 ? '1px 1px 0 #5D3A1A' : 'none',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '10px',
                }}
              >
                {streak}
              </div>
            </div>
          </div>

          {/* Chapter progress bar */}
          <div className="pixel-progress">
            <div
              className="pixel-progress-fill"
              style={{ width: `${chapterProgressPct}%` }}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-4 max-w-lg mx-auto w-full flex flex-col">
          {/* Scene card */}
          <div className={`pixel-panel p-5 mb-4 flex-1 ${sceneTransition ? 'animate-scene-transition' : 'animate-pixel-fade'}`}>
            {/* Scene header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="pixel-header"
                  style={{ color: '#8D6E63', fontSize: '8px' }}
                >
                  Scene {currentScene} of {totalScenes}
                </span>
                <span style={{ color: '#D7CCC8' }}>•</span>
                <button
                  onClick={() => setShowChapterSelect(true)}
                  className="pixel-header hover:opacity-80 transition-opacity"
                  style={{ color: '#8D6E63', cursor: 'pointer', fontSize: '8px' }}
                >
                  {CHAPTER_NAMES[chapterIndex]}
                </button>
              </div>

              {scene.newConcept && (
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 mb-2"
                  style={{
                    background: '#FFF3E0',
                    color: '#E65100',
                    border: '2px solid #E8A946',
                  }}
                >
                  NEW: {scene.newConcept}
                </span>
              )}
            </div>

            {/* Phase: Dialogue */}
            {phase === PHASE_DIALOGUE && (
              <div className="mb-4">
                <DialogueBox
                  character={scene.character}
                  expression="neutral"
                  lines={scene.dialogue}
                  onComplete={handleDialogueComplete}
                />
              </div>
            )}

            {/* Phase: Challenge */}
            {(phase === PHASE_CHALLENGE || phase === PHASE_SUCCESS || phase === PHASE_REVEAL) && (
              <div>
                {/* Brief */}
                <p
                  className="text-base font-medium leading-snug mb-4"
                  style={{ color: '#3E2723' }}
                >
                  {scene.dialogue[scene.dialogue.length - 1]?.text || ''}
                </p>

                {/* Challenge content */}
                <div>
                  {scene.type === 'frame' && (
                    <FrameLevel
                      key={scene.id}
                      level={scene}
                      onCorrect={handleCorrect}
                      showReveal={showReveal}
                    />
                  )}
                  {scene.type === 'fix' && (
                    <FixLevel
                      key={scene.id}
                      level={scene}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                      showReveal={showReveal}
                    />
                  )}
                  {scene.type === 'pick' && (
                    <PickLevel
                      key={scene.id}
                      level={scene}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                      showReveal={showReveal}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Success dialogue */}
          {phase === PHASE_SUCCESS && scene.successDialogue && (
            <div className="mb-4">
              <DialogueBox
                character={scene.character}
                expression={scene.successDialogue.expression}
                lines={[scene.successDialogue]}
                onComplete={() => setPhase(PHASE_REVEAL)}
              />
            </div>
          )}

          {/* Correct indicator + Next button */}
          {phase === PHASE_REVEAL && (
            <div className="mt-2 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="pixel-header"
                  style={{ color: '#4CAF50', fontSize: '10px' }}
                >
                  ✓ Correct
                </span>
              </div>
              <button
                onClick={handleNext}
                className="btn-primary w-full py-3.5"
              >
                {scene.isGameEnd
                  ? 'Finish'
                  : isLastSceneInChapter(currentScene)
                    ? 'Complete Chapter'
                    : 'Next'}
              </button>
            </div>
          )}

          {/* Hint */}
          {phase === PHASE_CHALLENGE && !showReveal && (
            <div className="mt-4">
              {hintVisible ? (
                showHintText ? (
                  <div
                    className="pixel-panel p-3 text-sm animate-fade-in"
                    style={{
                      borderColor: '#E8A946',
                      color: '#6D4C41',
                      background: '#FFF8E7',
                    }}
                  >
                    <span className="font-bold" style={{ color: '#E8A946' }}>HINT:</span> {scene.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHintText(true)}
                    className="pixel-btn text-sm px-3 py-2"
                    style={{ color: '#8D6E63' }}
                  >
                    Need a hint?
                  </button>
                )
              ) : null}
            </div>
          )}
        </main>
      </div>

      {/* Overlays */}
      {showChapterComplete !== null && (
        <ZoneComplete
          reward={CHAPTER_REWARDS[showChapterComplete]}
          chapterIndex={showChapterComplete}
          character={CHAPTER_CHARACTERS[showChapterComplete]}
          onContinue={handleChapterContinue}
        />
      )}

      {showGameComplete && (
        <GameComplete
          totalLevels={totalScenes}
          streak={bestStreak}
          onRestart={handleRestart}
        />
      )}

      {showChapterSelect && (
        <ChapterSelect
          completedScenes={completedScenes}
          onSelectScene={handleSelectScene}
          onClose={() => setShowChapterSelect(false)}
          onResetProgress={handleResetProgress}
          isLanding={!hasStarted}
        />
      )}
    </div>
  );
}
