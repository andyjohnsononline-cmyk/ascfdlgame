export const ZONE_NAMES = [
  'The Geometry Hierarchy',
  'Intents & Decisions',
  'Contexts & Wiring',
  'Canvas Templates',
  'Scale, Round & Align',
  'The Full Pipeline',
];

export const ZONE_REWARDS = [
  { emoji: '🎬', text: 'You know the geometry hierarchy!' },
  { emoji: '🎞️', text: 'You speak the DP\'s language!' },
  { emoji: '🔗', text: 'You can read and write FDL files!' },
  { emoji: '📐', text: 'You understand Canvas Templates!' },
  { emoji: '🔧', text: 'You can configure any template!' },
  { emoji: '🏆', text: 'FDL CERTIFIED — You understand the ASC Framing Decision List and the Template Application Pipeline!' },
];

export const ZONE_LEVEL_RANGES = [
  [1, 6],
  [7, 12],
  [13, 18],
  [19, 24],
  [25, 30],
  [31, 36],
];

export const ZONE_DESCRIPTIONS = [
  'Canvas, effective canvas, protection, and framing decision',
  'Abstract intents vs concrete pixel decisions',
  'Contexts, IDs, and the full FDL file structure',
  'Templates that transform geometry to new targets',
  'Scale factors, rounding, alignment, crop, and pad',
  'Anamorphic squeeze, the 8-phase pipeline, and real-world scenarios',
];

export const ZONE_EMOJIS = ['🎬', '🎞️', '🔗', '📐', '🔧', '🏆'];

export function getZoneForLevel(levelId) {
  for (let i = 0; i < ZONE_LEVEL_RANGES.length; i++) {
    const [start, end] = ZONE_LEVEL_RANGES[i];
    if (levelId >= start && levelId <= end) return i;
  }
  return 0;
}

export function isLastLevelInZone(levelId) {
  return ZONE_LEVEL_RANGES.some(([, end]) => end === levelId);
}

export function getLevelsForZone(zoneIndex) {
  const [start, end] = ZONE_LEVEL_RANGES[zoneIndex];
  return LEVELS.filter((l) => l.id >= start && l.id <= end);
}

export function getZoneLevelCount(zoneIndex) {
  const [start, end] = ZONE_LEVEL_RANGES[zoneIndex];
  return end - start + 1;
}

export function getZoneCompletedCount(zoneIndex, completedLevels) {
  const [start, end] = ZONE_LEVEL_RANGES[zoneIndex];
  let count = 0;
  for (let id = start; id <= end; id++) {
    if (completedLevels.has(id)) count++;
  }
  return count;
}

export function getFirstIncompleteLevelInZone(zoneIndex, completedLevels) {
  const [start, end] = ZONE_LEVEL_RANGES[zoneIndex];
  for (let id = start; id <= end; id++) {
    if (!completedLevels.has(id)) return id;
  }
  return start;
}

export function isZoneComplete(zoneIndex, completedLevels) {
  const [start, end] = ZONE_LEVEL_RANGES[zoneIndex];
  for (let id = start; id <= end; id++) {
    if (!completedLevels.has(id)) return false;
  }
  return true;
}

export function getLevelIndexInZone(levelId) {
  const zi = getZoneForLevel(levelId);
  const [start] = ZONE_LEVEL_RANGES[zi];
  return levelId - start;
}

// ═══════════════════════════════════════════════════════
// ALL 36 LEVELS — 6 zones × 6 levels each
// ═══════════════════════════════════════════════════════

export const LEVELS = [
  // ═══════════════════════════════════════
  // ZONE 1: THE GEOMETRY HIERARCHY (1-6)
  // ═══════════════════════════════════════
  {
    id: 1,
    zone: 1,
    type: 'frame',
    brief: 'This is a camera sensor: 4448 × 3096 pixels.',
    concept: 'canvas_dimensions',
    newConcept: 'Canvas',
    canvas: { width: 4448, height: 3096 },
    draggable: 'both',
    target: { width: 4448, height: 3096, x: 0, y: 0 },
    startFrame: { width: 2200, height: 1500, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Match both the width and height of the sensor.',
    reveal: {
      lines: '"dimensions": {\n  "width": 4448,\n  "height": 3096\n}',
      highlightKeys: ['width', 'height'],
    },
  },
  {
    id: 2,
    zone: 1,
    type: 'frame',
    brief: 'Not all pixels are usable. This is the effective area.',
    concept: 'effective_canvas',
    newConcept: 'Effective Canvas',
    canvas: { width: 4448, height: 3096 },
    draggable: 'both',
    target: { width: 4320, height: 2880, x: 64, y: 108 },
    startFrame: { width: 3400, height: 2200, x: 64, y: 108 },
    showCanvasOutline: true,
    tolerance: 0.08,
    hint: 'The effective area is 4320 × 2880, inset from the full sensor.',
    reveal: {
      lines: '"effective_dimensions": {\n  "width": 4320,\n  "height": 2880\n}',
      highlightKeys: ['effective_dimensions'],
    },
  },
  {
    id: 3,
    zone: 1,
    type: 'frame',
    brief: 'Where does the effective area sit? Set its anchor.',
    concept: 'effective_anchor',
    newConcept: 'Anchor Point',
    canvas: { width: 4448, height: 3096 },
    draggable: 'anchorMarker',
    target: { width: 4320, height: 2880, x: 64, y: 108 },
    startFrame: { width: 4320, height: 2880, x: 64, y: 108 },
    anchorStart: { x: 0, y: 0 },
    anchorTarget: { x: 64, y: 108 },
    showCanvasOutline: true,
    effectiveFrame: { width: 4320, height: 2880, x: 64, y: 108 },
    labels: { canvas: 'CANVAS', effective: 'EFFECTIVE' },
    tolerance: 0.08,
    hint: 'Drag the crosshair to the top-left corner of the effective area (64, 108).',
    reveal: {
      lines: '"effective_anchor_point": {\n  "x": 64,\n  "y": 108\n}',
      highlightKeys: ['effective_anchor_point', 'x', 'y'],
    },
  },
  {
    id: 4,
    zone: 1,
    type: 'frame',
    brief: 'The DP wants 2.39:1. Drag the frame into the canvas.',
    concept: 'framing_decision_intro',
    newConcept: 'Framing Decision',
    canvas: { width: 4448, height: 3096 },
    effectiveFrame: { width: 4320, height: 2880, x: 64, y: 108 },
    draggable: 'height',
    target: {
      width: 4320,
      height: 1808,
      x: 64,
      y: Math.round(108 + (2880 - 1808) / 2),
    },
    startFrame: {
      width: 4320,
      height: 2880,
      x: 64,
      y: 108,
    },
    labels: { canvas: 'CANVAS', effective: 'EFFECTIVE', frame: 'FRAMING' },
    tolerance: 0.08,
    hint: 'Height = 4320 / 2.39 ≈ 1808. Center the frame vertically in the effective area.',
    reveal: {
      lines: '"dimensions": {\n  "width": 4320,\n  "height": 1808\n}',
      highlightKeys: ['dimensions'],
    },
  },
  {
    id: 5,
    zone: 1,
    type: 'frame',
    brief: 'Add a 5% protection zone around the frame.',
    concept: 'protection_zone',
    newConcept: 'Protection',
    canvas: { width: 4448, height: 3096 },
    effectiveFrame: { width: 4320, height: 2880, x: 64, y: 108 },
    draggable: 'protection',
    target: { width: 4320, height: 1808, x: 64, y: 644 },
    startFrame: { width: 4320, height: 1808, x: 64, y: 644 },
    protectionTarget: {
      width: Math.round((4320 * 1.05) / 2) * 2,
      height: Math.round((1808 * 1.05) / 2) * 2,
    },
    startProtection: {
      width: 4320,
      height: 1808,
    },
    labels: { canvas: 'CANVAS', frame: 'FRAMING', protection: 'PROTECTION' },
    tolerance: 0.08,
    hint: 'Protection = frame dimensions × 1.05. Drag outward to grow the cyan rectangle.',
    reveal: {
      lines: '"protection_dimensions": {\n  "width": 4536,\n  "height": 1898\n}\n"protection_anchor_point": { ... }',
      highlightKeys: ['protection_dimensions', 'protection_anchor_point'],
    },
  },
  {
    id: 6,
    zone: 1,
    type: 'pick',
    brief: 'Which is the correct nesting order, outermost to innermost?',
    concept: 'hierarchy_order',
    newConcept: null,
    options: [
      { text: 'Canvas → Effective → Protection → Framing', correct: true },
      { text: 'Framing → Protection → Effective → Canvas', correct: false },
      { text: 'Canvas → Framing → Protection → Effective', correct: false },
      { text: 'Effective → Canvas → Framing → Protection', correct: false },
    ],
    hint: 'The canvas is the outermost container. The framing decision is what the audience sees.',
    reveal: {
      lines: 'CANVAS ─── outermost\n  EFFECTIVE CANVAS\n    PROTECTION\n      FRAMING DECISION ─── innermost',
      highlightKeys: [],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 2: INTENTS & DECISIONS (7-12)
  // ═══════════════════════════════════════
  {
    id: 7,
    zone: 2,
    type: 'frame',
    brief: 'The DP wants widescreen: 2.39:1',
    concept: 'aspect_ratio_wide',
    newConcept: 'Framing Intent',
    canvas: { width: 4448, height: 3096 },
    draggable: 'height',
    target: {
      width: 4448,
      height: 1862,
      x: 0,
      y: 617,
    },
    startFrame: { width: 4448, height: 3096, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Height = width / 2.39. The frame is centered vertically.',
    reveal: {
      lines: '"aspect_ratio": {\n  "width": 2.39,\n  "height": 1\n}',
      highlightKeys: ['aspect_ratio'],
    },
  },
  {
    id: 8,
    zone: 2,
    type: 'frame',
    brief: 'Now try 1.78:1 — standard HD.',
    concept: 'aspect_ratio_hd',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    draggable: 'height',
    target: {
      width: 4448,
      height: 2500,
      x: 0,
      y: 298,
    },
    startFrame: { width: 4448, height: 1500, x: 0, y: 798 },
    tolerance: 0.08,
    hint: 'Height = width / 1.78. A taller frame than 2.39.',
    reveal: {
      lines: '"aspect_ratio": {\n  "width": 1.78,\n  "height": 1\n}',
      highlightKeys: ['width', 'height'],
    },
  },
  {
    id: 9,
    zone: 2,
    type: 'pick',
    brief: 'Which is wider: 2.39:1 or 1.85:1?',
    concept: 'ratio_comparison',
    newConcept: null,
    options: [
      { text: '2.39:1 is wider', correct: true },
      { text: '1.85:1 is wider', correct: false },
      { text: 'They are the same width', correct: false },
      { text: 'It depends on the camera', correct: false },
    ],
    hint: 'A bigger first number means a wider rectangle.',
    reveal: {
      lines: '2.39:1 — "Scope" (anamorphic theatrical)\n1.85:1 — "Flat" (theatrical)\n\nHigher ratio = wider frame',
      highlightKeys: [],
    },
  },
  {
    id: 10,
    zone: 2,
    type: 'frame',
    brief: '2.39:1 on Alexa LF. Center the frame. What\'s the anchor?',
    concept: 'anchor_from_frame',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    draggable: 'anchorMarker',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    anchorStart: { x: 0, y: 0 },
    anchorTarget: { x: 0, y: 617 },
    labels: { canvas: 'CANVAS', frame: 'FRAMING DECISION' },
    tolerance: 0.08,
    hint: 'The anchor is at the top-left corner of the frame. y = (3096 - 1862) / 2 = 617.',
    reveal: {
      lines: '"anchor_point": {\n  "x": 0,\n  "y": 617\n}',
      highlightKeys: ['anchor_point', 'x', 'y'],
    },
  },
  {
    id: 11,
    zone: 2,
    type: 'frame',
    brief: 'Same intent, different camera: Sony Venice 6054 × 3192.',
    concept: 'cross_camera',
    newConcept: null,
    canvas: { width: 6054, height: 3192 },
    draggable: 'height',
    target: {
      width: 6054,
      height: 2534,
      x: 0,
      y: 329,
    },
    startFrame: { width: 6054, height: 3192, x: 0, y: 0 },
    labels: { canvas: 'CANVAS', frame: 'FRAMING DECISION' },
    tolerance: 0.08,
    hint: 'Height = 6054 / 2.39 ≈ 2534. Center vertically.',
    reveal: {
      lines: '// Sony Venice — same 2.39:1 intent\n"dimensions": {\n  "width": 6054,\n  "height": 2534\n}\n"anchor_point": { "x": 0, "y": 329 }',
      highlightKeys: ['dimensions', 'anchor_point'],
    },
  },
  {
    id: 12,
    zone: 2,
    type: 'pick',
    brief: 'Two cameras, same intent. The framing decisions have…',
    concept: 'decision_comparison',
    newConcept: null,
    options: [
      { text: 'Different pixel values but the same aspect ratio', correct: true },
      { text: 'Identical pixel values', correct: false },
      { text: 'Different aspect ratios', correct: false },
      { text: 'No relationship to each other', correct: false },
    ],
    hint: 'The intent (2.39:1) stays the same, but pixel counts change per camera.',
    reveal: {
      lines: '// ARRI: 4448×1862  anchor (0, 617)\n// Sony: 6054×2534  anchor (0, 329)\n// Both are 2.39:1 — same composition!',
      highlightKeys: [],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 3: CONTEXTS & WIRING (13-18)
  // ═══════════════════════════════════════
  {
    id: 13,
    zone: 3,
    type: 'frame',
    brief: 'Connect the dots: canvas → framing decision.',
    concept: 'context_wiring',
    newConcept: 'Context',
    subtype: 'connect',
    cards: [
      { id: 'canvas', label: 'Canvas\nARRI Alexa LF', slot: 'canvas_id' },
      { id: 'intent', label: 'Framing Intent\n2.39:1 Scope', slot: 'framing_intent_id' },
      { id: 'decision', label: 'Framing Decision\n4448×1862', slot: 'framing_decision' },
    ],
    slots: [
      { id: 'canvas_id', label: 'canvas_id', accepts: 'canvas' },
      { id: 'framing_intent_id', label: 'framing_intent_id', accepts: 'intent' },
      { id: 'framing_decision', label: 'framing_decisions[]', accepts: 'decision' },
    ],
    hint: 'A context ties a canvas to its framing decisions. The intent is referenced inside each decision.',
    reveal: {
      lines: '"contexts": [{\n  "canvas_id": "alexa_lf",\n  "framing_decisions": [{\n    "framing_intent_id": "scope_239"\n  }]\n}]',
      highlightKeys: ['canvas_id', 'framing_intent_id'],
    },
  },
  {
    id: 14,
    zone: 3,
    type: 'fix',
    brief: 'This FDL is broken. The context references a canvas that doesn\'t exist.',
    concept: 'fix_canvas_ref',
    newConcept: null,
    canvas: null,
    shownJson: '{\n  "canvases": [{ "id": "VENICE_FF_6K" }],\n  "contexts": [{\n    "canvas_id": "VENICE_FF"\n  }]\n}',
    options: [
      { text: 'canvas_id doesn\'t match the canvas id', correct: true },
      { text: 'The canvas dimensions are missing', correct: false },
      { text: 'The context needs a framing intent', correct: false },
      { text: 'The version number is wrong', correct: false },
    ],
    hint: 'Compare the canvas id to the canvas_id in the context — they must match exactly.',
    reveal: {
      lines: '// Canvas id:  "VENICE_FF_6K"\n// Context refs: "VENICE_FF"  ← mismatch!\n// Fix: "canvas_id": "VENICE_FF_6K"',
      highlightKeys: ['canvas_id'],
    },
  },
  {
    id: 15,
    zone: 3,
    type: 'frame',
    brief: 'Two cameras, one intent. Build both contexts.',
    concept: 'dual_context',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'alexa', label: 'Canvas\nARRI Alexa LF', slot: 'ctx1_canvas' },
      { id: 'venice', label: 'Canvas\nSony Venice', slot: 'ctx2_canvas' },
    ],
    slots: [
      { id: 'ctx1_canvas', label: 'Context 1: canvas_id', accepts: 'alexa' },
      { id: 'ctx2_canvas', label: 'Context 2: canvas_id', accepts: 'venice' },
    ],
    hint: 'Each context gets its own canvas. Match the camera to the right context.',
    reveal: {
      lines: '"contexts": [\n  { "canvas_id": "alexa_lf", ... },\n  { "canvas_id": "venice_ff", ... }\n]',
      highlightKeys: ['canvas_id'],
    },
  },
  {
    id: 16,
    zone: 3,
    type: 'frame',
    brief: 'Every FDL needs a header.',
    concept: 'fdl_header',
    newConcept: 'FDL File',
    subtype: 'fillHeader',
    fields: [
      { key: 'uuid', prefill: 'urn:uuid:a1b2c3d4-...', auto: true },
      { key: 'version', options: ['1.0', '2.0', '0.1'], correct: '1.0' },
      { key: 'fdl_creator', placeholder: 'Your name or app', freeText: true },
    ],
    hint: 'The current FDL version is 1.0. The UUID is auto-generated.',
    reveal: {
      lines: '{\n  "uuid": "urn:uuid:...",\n  "version": { "major": 1, "minor": 0 },\n  "fdl_creator": "Frame It Game"\n}',
      highlightKeys: ['uuid', 'version', 'fdl_creator'],
    },
  },
  {
    id: 17,
    zone: 3,
    type: 'frame',
    brief: 'Set the default framing intent.',
    concept: 'default_intent',
    newConcept: null,
    subtype: 'pickDefault',
    intentOptions: [
      { id: 'scope_239', label: '2.39:1 Scope' },
      { id: 'flat_185', label: '1.85:1 Flat' },
      { id: 'hd_178', label: '1.78:1 HD' },
    ],
    correctIntent: 'scope_239',
    hint: 'The DP chose 2.39:1 Scope as the primary look.',
    reveal: {
      lines: '"default_framing_intent": "scope_239"',
      highlightKeys: ['default_framing_intent'],
    },
  },
  {
    id: 18,
    zone: 3,
    type: 'fix',
    brief: 'The framing_intent_id in this decision is misspelled.',
    concept: 'fix_intent_ref',
    newConcept: null,
    canvas: null,
    shownJson: '{\n  "framing_intents": [{ "id": "scope_239" }],\n  "framing_decisions": [{\n    "framing_intent_id": "scope_293"\n  }]\n}',
    options: [
      { text: 'framing_intent_id has a typo (293 vs 239)', correct: true },
      { text: 'The aspect ratio is missing', correct: false },
      { text: 'The canvas_id is wrong', correct: false },
      { text: 'The dimensions are incorrect', correct: false },
    ],
    hint: 'Look carefully at the numbers in the ID — 239 vs 293.',
    reveal: {
      lines: '// Intent id:    "scope_239"\n// Decision refs: "scope_293"  ← typo!\n// Fix: "framing_intent_id": "scope_239"',
      highlightKeys: ['framing_intent_id'],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 4: CANVAS TEMPLATES (19-24)
  // ═══════════════════════════════════════
  {
    id: 19,
    zone: 4,
    type: 'pick',
    brief: 'You shot on Alexa LF. VFX needs a 4K DCI plate. What do you need?',
    concept: 'template_intro',
    newConcept: 'Canvas Template',
    options: [
      { text: 'A Canvas Template — it transforms geometry to a new target', correct: true },
      { text: 'A new camera with different resolution', correct: false },
      { text: 'A color management LUT', correct: false },
      { text: 'A new framing intent from the DP', correct: false },
    ],
    hint: 'Canvas Templates transform source framing geometry to a new target canvas.',
    reveal: {
      lines: '"canvas_templates": [\n  {\n    "id": "vfx_pull",\n    "label": "VFX Pull"\n  }\n]',
      highlightKeys: ['canvas_templates'],
    },
  },
  {
    id: 20,
    zone: 4,
    type: 'frame',
    brief: 'Set the target: 3840 × 2160 UHD.',
    concept: 'target_dimensions',
    newConcept: null,
    canvas: { width: 3840, height: 2160 },
    draggable: 'both',
    target: { width: 3840, height: 2160, x: 0, y: 0 },
    startFrame: { width: 2000, height: 1200, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'UHD is 3840 × 2160 pixels.',
    reveal: {
      lines: '"target_dimensions": {\n  "width": 3840,\n  "height": 2160\n}',
      highlightKeys: ['target_dimensions'],
    },
  },
  {
    id: 21,
    zone: 4,
    type: 'frame',
    brief: 'What gets fitted? Pick the source layer.',
    concept: 'fit_source',
    newConcept: 'fit_source',
    subtype: 'layerSelect',
    canvas: { width: 4448, height: 3096 },
    effectiveFrame: { width: 4320, height: 2880, x: 64, y: 108 },
    protectionFrame: { width: 4320, height: 1956, x: 64, y: 570 },
    framingFrame: { width: 4320, height: 1808, x: 64, y: 644 },
    correctLayer: 'framing',
    correctLabel: 'framing_decision.dimensions',
    hint: 'The framing decision is the creative frame — that\'s what gets fitted to the target.',
    reveal: {
      lines: '"fit_source":\n  "framing_decision.dimensions"',
      highlightKeys: ['fit_source'],
    },
  },
  {
    id: 22,
    zone: 4,
    type: 'frame',
    brief: 'Fit the frame into the target: fit_all vs fill.',
    concept: 'fit_methods',
    newConcept: 'Fit Method',
    subtype: 'sideBySide',
    sourceFrame: { width: 4448, height: 1862 },
    targets: [
      {
        label: 'fit_all',
        dims: { width: 3840, height: 2160 },
        fitMethod: 'fit_all',
        resultFrame: {
          width: 3840,
          height: Math.round((1862 * (3840 / 4448)) / 2) * 2,
        },
      },
      {
        label: 'fill',
        dims: { width: 3840, height: 2160 },
        fitMethod: 'fill',
        resultFrame: {
          width: Math.round((4448 * (2160 / 1862)) / 2) * 2,
          height: 2160,
        },
      },
    ],
    hint: 'fit_all letterboxes to fit entirely inside. fill crops to fill the target completely.',
    reveal: {
      lines: '"fit_method": "fit_all"\n// Fits entirely — may letterbox\n\n"fit_method": "fill"\n// Fills target — may crop',
      highlightKeys: ['fit_method'],
    },
  },
  {
    id: 23,
    zone: 4,
    type: 'fix',
    brief: 'This VFX pull used fill but the frame got cropped. What should it be?',
    concept: 'fix_fit_method',
    newConcept: null,
    canvas: { width: 3840, height: 2160 },
    shownFrame: { width: 4460, height: 2160, x: -310, y: 0 },
    correctFrame: { width: 3840, height: 1606, x: 0, y: 277 },
    labels: { canvas: 'TARGET', frame: 'SOURCE FRAME' },
    options: [
      { text: 'fit_all', correct: true },
      { text: 'fill', correct: false },
      { text: 'width', correct: false },
      { text: 'height', correct: false },
    ],
    hint: 'fit_all ensures nothing is cropped — the entire source fits within the target.',
    reveal: {
      lines: '// "fill" caused cropping\n// Fix: "fit_method": "fit_all"\n// Source fits entirely within target',
      highlightKeys: ['fit_method'],
    },
  },
  {
    id: 24,
    zone: 4,
    type: 'pick',
    brief: 'If fit_source is framing_decision.dimensions, which layers overflow the target?',
    concept: 'overflow_layers',
    newConcept: null,
    options: [
      { text: 'Protection, effective, and canvas', correct: true },
      { text: 'Only the canvas', correct: false },
      { text: 'Nothing overflows', correct: false },
      { text: 'The framing decision overflows', correct: false },
    ],
    hint: 'The framing decision fits exactly. Everything outside it (larger layers) overflows.',
    reveal: {
      lines: '// fit_source = framing → fits exactly\n// protection > framing → overflows\n// effective > protection → overflows\n// canvas > effective → overflows',
      highlightKeys: [],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 5: SCALE, ROUND & ALIGN (25-30)
  // ═══════════════════════════════════════
  {
    id: 25,
    zone: 5,
    type: 'frame',
    brief: 'Calculate the scale factor. Framing is 4448 × 1862, target is 3840 × 2160. Fit all.',
    concept: 'scale_factor',
    newConcept: 'Scale Factor',
    subtype: 'scaleFactor',
    sourceFrame: { width: 4448, height: 1862 },
    targetDims: { width: 3840, height: 2160 },
    fitMethod: 'fit_all',
    scaleOptions: [
      { label: 'Width ratio: 0.8633', value: 0.8633, correct: true },
      { label: 'Height ratio: 1.1600', value: 1.16, correct: false },
    ],
    hint: 'fit_all uses the SMALLER ratio so the source fits entirely. min(0.8633, 1.16) = 0.8633.',
    reveal: {
      lines: '// scale = min(target_w/source_w,\n//             target_h/source_h)\n// scale = min(3840/4448, 2160/1862)\n// scale = min(0.8633, 1.1600)\n// scale = 0.8633',
      highlightKeys: ['scale'],
    },
  },
  {
    id: 26,
    zone: 5,
    type: 'frame',
    brief: 'Scale and round. 1862 × 0.8633 = 1607.7. Round to even, up.',
    concept: 'rounding',
    newConcept: 'Rounding',
    subtype: 'roundingPick',
    calculation: '1862 × 0.8633 = 1607.7',
    roundOptions: [
      { value: 1606, label: '1606' },
      { value: 1608, label: '1608', correct: true },
      { value: 1607, label: '1607' },
      { value: 1610, label: '1610' },
    ],
    hint: 'Round to even means the result must be divisible by 2. Up means round up. 1608 is even and ≥ 1607.7.',
    reveal: {
      lines: '"round": {\n  "even": "even",\n  "mode": "up"\n}\n// 1607.7 → round up to even → 1608',
      highlightKeys: ['round', 'even', 'mode'],
    },
  },
  {
    id: 27,
    zone: 5,
    type: 'frame',
    brief: 'Align the content: center/center vs right/bottom.',
    concept: 'alignment',
    newConcept: 'Alignment',
    subtype: 'alignment',
    targetDims: { width: 3840, height: 2160 },
    scaledFrame: { width: 3840, height: 1608 },
    alignmentModes: [
      { h: 'center', v: 'center', label: 'center / center' },
      { h: 'right', v: 'bottom', label: 'right / bottom' },
    ],
    hint: 'Center alignment places the frame equally between the edges. Right/bottom pushes to the corner.',
    reveal: {
      lines: '"alignment_method_horizontal": "center"\n"alignment_method_vertical": "center"',
      highlightKeys: ['alignment_method_horizontal', 'alignment_method_vertical'],
    },
  },
  {
    id: 28,
    zone: 5,
    type: 'pick',
    brief: 'The scaled canvas is 4096 × 2284 but the max is 3840 × 2160. What happens?',
    concept: 'crop_behavior',
    newConcept: null,
    options: [
      { text: 'It gets cropped to 3840 × 2160', correct: true },
      { text: 'It gets padded to 4096 × 2284', correct: false },
      { text: 'An error is thrown', correct: false },
      { text: 'The maximum is ignored', correct: false },
    ],
    hint: 'When the canvas exceeds maximum_dimensions, it gets cropped.',
    reveal: {
      lines: '"maximum_dimensions": {\n  "width": 3840,\n  "height": 2160\n}\n// Canvas overflows max → CROP',
      highlightKeys: ['maximum_dimensions'],
    },
  },
  {
    id: 29,
    zone: 5,
    type: 'frame',
    brief: 'PAD mode: pad_to_maximum is on, max is 4096 × 2160.',
    concept: 'pad_mode',
    newConcept: null,
    subtype: 'alignment',
    targetDims: { width: 4096, height: 2160 },
    scaledFrame: { width: 3840, height: 2160 },
    padMode: true,
    alignmentModes: [
      { h: 'center', v: 'center', label: 'center / center' },
    ],
    hint: 'The content is centered within the padded output. Black bars fill the empty space.',
    reveal: {
      lines: '"pad_to_maximum": true\n"maximum_dimensions": {\n  "width": 4096,\n  "height": 2160\n}',
      highlightKeys: ['pad_to_maximum', 'maximum_dimensions'],
    },
  },
  {
    id: 30,
    zone: 5,
    type: 'fix',
    brief: 'The protection is auto-filled but the source never defined it. That\'s wrong. Why?',
    concept: 'protection_sacred',
    newConcept: null,
    canvas: { width: 3840, height: 2160 },
    shownFrame: { width: 3840, height: 1608, x: 0, y: 276 },
    shownProtection: { width: 3840, height: 1688, x: 0, y: 236 },
    labels: { frame: 'FRAMING', protection: 'PROTECTION (auto-filled!)' },
    options: [
      { text: 'Protection is never auto-filled', correct: true },
      { text: 'Protection should match framing', correct: false },
      { text: 'Protection should match effective', correct: false },
      { text: 'The template is wrong', correct: false },
    ],
    hint: 'Protection dimensions are sacred — they must be explicitly defined in the source.',
    reveal: {
      lines: '// Protection stays ZERO if not\n// explicitly provided in source FDL.\n// It is NEVER auto-filled.',
      highlightKeys: ['protection'],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 6: THE FULL PIPELINE (31-36)
  // ═══════════════════════════════════════
  {
    id: 31,
    zone: 6,
    type: 'frame',
    brief: 'Anamorphic lens: squeeze is 1.3×. Normalize before scaling.',
    concept: 'anamorphic_squeeze',
    newConcept: 'Anamorphic',
    subtype: 'anamorphic',
    canvas: { width: 4448, height: 3096 },
    squeezeValue: 1.3,
    framingFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    hint: 'Set the squeeze to 1.3. The frame visually desqueezes — wider than it looked on the sensor.',
    reveal: {
      lines: '"anamorphic_squeeze": 1.3\n\n// normalized_width = width × squeeze\n// 4448 × 1.3 = 5782',
      highlightKeys: ['anamorphic_squeeze'],
    },
  },
  {
    id: 32,
    zone: 6,
    type: 'frame',
    brief: 'VFX pull: fit framing to 3840 × 2160, preserve effective canvas.',
    concept: 'pipeline_config',
    newConcept: null,
    subtype: 'pipelineConfig',
    fitSourceOptions: [
      { id: 'canvas.dimensions', label: 'Canvas' },
      { id: 'canvas.effective_dimensions', label: 'Effective Canvas' },
      { id: 'framing_decision.dimensions', label: 'Framing Decision', correct: true },
    ],
    preserveOptions: [
      { id: 'none', label: 'None' },
      { id: 'canvas.dimensions', label: 'Canvas' },
      { id: 'canvas.effective_dimensions', label: 'Effective Canvas', correct: true },
    ],
    hint: 'Fit the framing decision (creative frame) and preserve the effective canvas (active image area).',
    reveal: {
      lines: '"fit_source":\n  "framing_decision.dimensions"\n"preserve_from_source_canvas":\n  "canvas.effective_dimensions"',
      highlightKeys: ['fit_source', 'preserve_from_source_canvas'],
    },
  },
  {
    id: 33,
    zone: 6,
    type: 'pick',
    brief: 'Phase order check: what comes after scaling and rounding?',
    concept: 'pipeline_phases',
    newConcept: null,
    options: [
      { text: 'Output size and alignment', correct: true },
      { text: 'Populate source geometry', correct: false },
      { text: 'Crop to visible', correct: false },
      { text: 'Derive configuration', correct: false },
    ],
    hint: 'The pipeline goes: derive → populate → fill gaps → scale → round → output size → offsets → crop.',
    reveal: {
      lines: 'Phase 1: Derive Configuration\nPhase 2: Populate Source Geometry\nPhase 3: Fill Hierarchy Gaps\nPhase 4: Calculate Scale Factor\nPhase 5: Normalize, Scale, Round\nPhase 6: Output Size & Alignment  ← HERE\nPhase 7: Apply Offsets to Anchors\nPhase 8: Crop to Visible',
      highlightKeys: [],
    },
  },
  {
    id: 34,
    zone: 6,
    type: 'frame',
    brief: 'Delivery canvas: UHD 3840 × 2160. Add it to the FDL.',
    concept: 'delivery_canvas',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'canvas', label: 'UHD Canvas\n3840 × 2160', slot: 'slot_canvas' },
      { id: 'template', label: 'Canvas Template\nfit_all to UHD', slot: 'slot_template' },
      { id: 'context', label: 'Delivery Context', slot: 'slot_context' },
    ],
    slots: [
      { id: 'slot_canvas', label: 'canvases[]', accepts: 'canvas' },
      { id: 'slot_template', label: 'canvas_templates[]', accepts: 'template' },
      { id: 'slot_context', label: 'contexts[]', accepts: 'context' },
    ],
    hint: 'A delivery setup needs a canvas, a template to transform to it, and a context to hold the decisions.',
    reveal: {
      lines: '// Delivery requires:\n// 1. Canvas (3840×2160)\n// 2. Canvas Template (fit_all)\n// 3. Context (canvas + decisions)',
      highlightKeys: ['canvases', 'canvas_templates', 'contexts'],
    },
  },
  {
    id: 35,
    zone: 6,
    type: 'frame',
    brief: 'Final build: 2 cameras, 1 intent, 1 delivery template.',
    concept: 'final_assembly',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'alexa', label: 'ARRI Alexa LF\n4448×3096', slot: 'slot_ctx1' },
      { id: 'venice', label: 'Sony Venice\n6054×3192', slot: 'slot_ctx2' },
      { id: 'template', label: 'UHD Template\nfit_all 3840×2160', slot: 'slot_tmpl' },
    ],
    slots: [
      { id: 'slot_ctx1', label: 'Context 1: canvas_id', accepts: 'alexa' },
      { id: 'slot_ctx2', label: 'Context 2: canvas_id', accepts: 'venice' },
      { id: 'slot_tmpl', label: 'canvas_templates[]', accepts: 'template' },
    ],
    hint: 'Each camera gets its own context. The template transforms any source to UHD delivery.',
    reveal: {
      lines: '// Complete FDL:\n// 1 intent (2.39:1)\n// 2 canvases (ARRI, Sony)\n// 2 contexts + delivery template\n// → One file for the whole pipeline',
      highlightKeys: [],
    },
  },
  {
    id: 36,
    zone: 6,
    type: 'pick',
    brief: 'You get an FDL with a canvas template. What does it tell you?',
    concept: 'fdl_purpose',
    newConcept: null,
    options: [
      { text: 'Exactly how to transform the framing to your target canvas', correct: true },
      { text: 'What camera settings to use', correct: false },
      { text: 'The color grading instructions', correct: false },
      { text: 'The audio sync timecode', correct: false },
    ],
    hint: 'It\'s a Framing Decision List — it tells you about framing.',
    reveal: {
      lines: '// The ASC Framing Decision List:\n// One file that ensures every department\n// reproduces the DP\'s creative frame\n// from set to final delivery.',
      highlightKeys: [],
    },
    isGameEnd: true,
  },
];
