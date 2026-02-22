export const ZONE_NAMES = [
  'The Canvas',
  'The Intent',
  'The Decision',
  'The Context',
  'The File',
  'The Pipeline',
];

export const ZONE_REWARDS = [
  { emoji: '🎬', text: 'You know what a Canvas is!' },
  { emoji: '🎞️', text: 'You speak the DP\'s language!' },
  { emoji: '📐', text: 'You can calculate framing decisions!' },
  { emoji: '🔗', text: 'You understand how FDL connects everything!' },
  { emoji: '📄', text: 'You can read and write FDL files!' },
  { emoji: '🏆', text: 'FDL CERTIFIED — You understand the ASC Framing Decision List!' },
];

export const ZONE_LEVEL_RANGES = [
  [1, 5],
  [6, 10],
  [11, 17],
  [18, 22],
  [23, 27],
  [28, 30],
];

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

export const LEVELS = [
  // ═══════════════════════════════════════
  // ZONE 1: THE CANVAS (Levels 1-5)
  // ═══════════════════════════════════════
  {
    id: 1,
    zone: 1,
    type: 'frame',
    brief: 'This is a camera sensor. It\'s 4448 pixels wide.',
    concept: 'canvas_width',
    newConcept: 'Canvas',
    canvas: { width: 4448, height: 3096 },
    draggable: 'width',
    target: { width: 4448, height: 3096, x: 0, y: 0 },
    startFrame: { width: 2200, height: 3096, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Drag the right edge to match the full sensor width.',
    reveal: {
      lines: '"dimensions": {\n  "width": 4448\n}',
      highlightKeys: ['width'],
    },
  },
  {
    id: 2,
    zone: 1,
    type: 'frame',
    brief: 'The sensor is 3096 pixels tall.',
    concept: 'canvas_height',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    draggable: 'height',
    target: { width: 4448, height: 3096, x: 0, y: 0 },
    startFrame: { width: 4448, height: 1500, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Drag the bottom edge to match the full sensor height.',
    reveal: {
      lines: '"dimensions": {\n  "width": 4448,\n  "height": 3096\n}',
      highlightKeys: ['height'],
    },
  },
  {
    id: 3,
    zone: 1,
    type: 'pick',
    brief: 'Which of these is a real camera resolution?',
    concept: 'camera_resolution',
    newConcept: null,
    options: [
      { text: '4448 × 3096', correct: true },
      { text: '4000 × 3000', correct: false },
      { text: '3840 × 2160', correct: false },
      { text: '5000 × 4000', correct: false },
    ],
    hint: 'Think about the ARRI Alexa LF sensor.',
    reveal: {
      lines: '{\n  "id": "alexa_lf",\n  "label": "ARRI Alexa LF Open Gate",\n  "dimensions": { "width": 4448, "height": 3096 }\n}',
      highlightKeys: ['id', 'label', 'dimensions'],
    },
  },
  {
    id: 4,
    zone: 1,
    type: 'frame',
    brief: 'Different camera: Sony Venice.',
    concept: 'second_canvas',
    newConcept: null,
    canvas: { width: 6054, height: 3192 },
    draggable: 'both',
    target: { width: 6054, height: 3192, x: 0, y: 0 },
    startFrame: { width: 3000, height: 1600, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'The Sony Venice is 6054 × 3192.',
    reveal: {
      lines: '{\n  "id": "venice_ff",\n  "label": "Sony Venice Full Frame",\n  "dimensions": { "width": 6054, "height": 3192 }\n}',
      highlightKeys: ['venice_ff'],
    },
  },
  {
    id: 5,
    zone: 1,
    type: 'pick',
    brief: 'A Canvas in FDL represents…',
    concept: 'canvas_definition',
    newConcept: null,
    options: [
      { text: 'The full pixel recording area', correct: true },
      { text: 'The final delivery resolution', correct: false },
      { text: 'The aspect ratio the DP wants', correct: false },
      { text: 'A color calibration target', correct: false },
    ],
    hint: 'It\'s the container — the whole sensor.',
    reveal: {
      lines: '"canvases": [\n  {\n    "id": "...",\n    "label": "Camera Name",\n    "dimensions": { "width": ..., "height": ... }\n  }\n]',
      highlightKeys: ['canvases'],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 2: THE INTENT (Levels 6-10)
  // ═══════════════════════════════════════
  {
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
    zone: 2,
    type: 'frame',
    brief: 'Match each ratio to its frame.',
    concept: 'ratio_matching',
    newConcept: null,
    subtype: 'match',
    canvas: { width: 4448, height: 3096 },
    matchItems: [
      { label: '1.33:1', ratio: 1.33 },
      { label: '1.78:1', ratio: 1.78 },
      { label: '1.85:1', ratio: 1.85 },
      { label: '2.39:1', ratio: 2.39 },
    ],
    hint: 'Wider ratios make thinner letterboxes.',
    reveal: {
      lines: '1.33:1 — Academy 4:3\n1.78:1 — 16:9 (HD/UHD)\n1.85:1 — Flat (theatrical)\n2.39:1 — Scope (anamorphic)',
      highlightKeys: [],
    },
  },
  {
    id: 10,
    zone: 2,
    type: 'pick',
    brief: 'A Framing Intent is…',
    concept: 'intent_definition',
    newConcept: null,
    options: [
      { text: "The DP's creative framing goal, independent of camera", correct: true },
      { text: 'The exact pixel dimensions of the frame', correct: false },
      { text: 'A camera preset for recording', correct: false },
      { text: 'The delivery resolution for streaming', correct: false },
    ],
    hint: 'It\'s abstract — no pixel values, just a ratio and creative intent.',
    reveal: {
      lines: '{\n  "id": "scope_239",\n  "label": "2.39 Scope",\n  "aspect_ratio": { "width": 2.39, "height": 1 }\n}',
      highlightKeys: ['framing_intents'],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 3: THE DECISION (Levels 11-17)
  // ═══════════════════════════════════════
  {
    id: 11,
    zone: 3,
    type: 'frame',
    brief: '2.39:1 on a 4448×3096 sensor. Where does the frame go?',
    concept: 'framing_decision_basic',
    newConcept: 'Framing Decision',
    canvas: { width: 4448, height: 3096 },
    draggable: 'position',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 1862, x: 0, y: 200 },
    tolerance: 0.08,
    hint: 'Center the frame vertically. y = (3096 - 1862) / 2.',
    reveal: {
      lines: '"dimensions": {\n  "width": 4448,\n  "height": 1862\n}',
      highlightKeys: ['dimensions'],
    },
  },
  {
    id: 12,
    zone: 3,
    type: 'frame',
    brief: 'The frame is centered. What\'s the anchor point?',
    concept: 'anchor_point',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    draggable: 'anchor',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    anchorTarget: { x: 0, y: 617 },
    tolerance: 0.08,
    hint: 'The anchor is at the top-left corner of the frame. y = (3096 - 1862) / 2 = 617.',
    reveal: {
      lines: '"anchor_point": {\n  "x": 0,\n  "y": 617\n}',
      highlightKeys: ['anchor_point', 'x', 'y'],
    },
  },
  {
    id: 13,
    zone: 3,
    type: 'fix',
    brief: "Something's wrong with this frame.",
    concept: 'fix_anchor',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    shownFrame: { width: 4448, height: 1862, x: 0, y: 0 },
    correctFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    options: [
      { text: 'Anchor Y is wrong', correct: true },
      { text: 'Width is wrong', correct: false },
      { text: 'Aspect ratio is wrong', correct: false },
      { text: 'Canvas is too small', correct: false },
    ],
    hint: 'The frame should be vertically centered.',
    reveal: {
      lines: '"anchor_point": {\n  "x": 0,\n  "y": 617  \u2190 fixed!\n}',
      highlightKeys: ['y'],
    },
  },
  {
    id: 14,
    zone: 3,
    type: 'frame',
    brief: 'Now add 5% protection.',
    concept: 'protection',
    newConcept: 'Protection',
    canvas: { width: 4448, height: 3096 },
    draggable: 'protection',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    protectionTarget: {
      width: Math.round(4448 * 1.05 / 2) * 2,
      height: Math.round(1862 * 1.05 / 2) * 2,
    },
    startProtection: {
      width: 4448,
      height: 1862,
    },
    tolerance: 0.08,
    hint: 'Protection = frame dimensions × 1.05. Drag it slightly larger than the amber frame.',
    reveal: {
      lines: '"protection": 0.05\n\n// on the framing intent\n// protection area is 5% larger\n// than the framing decision',
      highlightKeys: ['protection'],
    },
  },
  {
    id: 15,
    zone: 3,
    type: 'fix',
    brief: 'The protection area is SMALLER than the frame. That\'s wrong. Why?',
    concept: 'fix_protection',
    newConcept: null,
    canvas: { width: 4448, height: 3096 },
    shownFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    shownProtection: { width: 4000, height: 1672, x: 224, y: 712 },
    correctFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    options: [
      { text: 'Protection should be larger than the frame', correct: true },
      { text: 'Protection should be 0', correct: false },
      { text: 'Canvas is too small', correct: false },
      { text: 'Aspect ratio is inverted', correct: false },
    ],
    hint: 'Protection is a safety buffer — it must be OUTSIDE the frame.',
    reveal: {
      lines: '// Protection = frame × (1 + protection%)\n// It wraps AROUND the framing decision\n"protection": 0.05  // 5% larger',
      highlightKeys: ['protection'],
    },
  },
  {
    id: 16,
    zone: 3,
    type: 'frame',
    brief: 'Same intent, different camera: Sony Venice 6054×3192.',
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
    tolerance: 0.08,
    hint: 'Height = 6054 / 2.39 ≈ 2534. Center it vertically.',
    reveal: {
      lines: '// Sony Venice — same 2.39:1 intent\n"dimensions": {\n  "width": 6054,\n  "height": 2534\n},\n"anchor_point": { "x": 0, "y": 329 }',
      highlightKeys: ['dimensions', 'anchor_point'],
    },
  },
  {
    id: 17,
    zone: 3,
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
  // ZONE 4: THE CONTEXT (Levels 18-22)
  // ═══════════════════════════════════════
  {
    id: 18,
    zone: 4,
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
    id: 19,
    zone: 4,
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
      lines: '// Canvas id:  "VENICE_FF_6K"\n// Context refs: "VENICE_FF"  \u2190 mismatch!\n// Fix: "canvas_id": "VENICE_FF_6K"',
      highlightKeys: ['canvas_id'],
    },
  },
  {
    id: 20,
    zone: 4,
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
    id: 21,
    zone: 4,
    type: 'pick',
    brief: 'A Context in FDL represents…',
    concept: 'context_definition',
    newConcept: null,
    options: [
      { text: 'How framing works on a specific canvas', correct: true },
      { text: 'The entire FDL file', correct: false },
      { text: 'A single camera setting', correct: false },
      { text: 'The delivery specification', correct: false },
    ],
    hint: 'It connects a canvas to its framing decisions.',
    reveal: {
      lines: '// A Context = "on THIS canvas,\n//   here\'s how the framing works"\n"contexts": [{ "canvas_id": "...", ... }]',
      highlightKeys: ['contexts'],
    },
  },
  {
    id: 22,
    zone: 4,
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
      lines: '// Intent id:    "scope_239"\n// Decision refs: "scope_293"  \u2190 typo!\n// Fix: "framing_intent_id": "scope_239"',
      highlightKeys: ['framing_intent_id'],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 5: THE FILE (Levels 23-27)
  // ═══════════════════════════════════════
  {
    id: 23,
    zone: 5,
    type: 'frame',
    brief: 'Every FDL file needs a header.',
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
    id: 24,
    zone: 5,
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
    id: 25,
    zone: 5,
    type: 'frame',
    brief: 'Assemble the full FDL file.',
    concept: 'assembly',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'intents', label: 'framing_intents\n[2.39:1 Scope]', slot: 'slot_intents' },
      { id: 'canvases', label: 'canvases\n[ARRI, Sony]', slot: 'slot_canvases' },
      { id: 'contexts', label: 'contexts\n[ARRI ctx, Sony ctx]', slot: 'slot_contexts' },
    ],
    slots: [
      { id: 'slot_intents', label: 'framing_intents: [ ]', accepts: 'intents' },
      { id: 'slot_canvases', label: 'canvases: [ ]', accepts: 'canvases' },
      { id: 'slot_contexts', label: 'contexts: [ ]', accepts: 'contexts' },
    ],
    hint: 'Drag each section into its matching slot in the FDL skeleton.',
    reveal: {
      lines: '{\n  "uuid": "...",\n  "version": { "major": 1, "minor": 0 },\n  "framing_intents": [...],\n  "canvases": [...],\n  "contexts": [...]\n}',
      highlightKeys: ['framing_intents', 'canvases', 'contexts'],
    },
  },
  {
    id: 26,
    zone: 5,
    type: 'fix',
    brief: 'This FDL has 3 bugs. Find them all.',
    concept: 'multi_fix',
    newConcept: null,
    canvas: null,
    multiFix: true,
    bugs: [
      {
        shownJson: '"version": "1.0"',
        fixedJson: '"version": { "major": 1, "minor": 0 }',
        label: 'Version should be an object, not a string',
      },
      {
        shownJson: '"canvas_id": ???',
        fixedJson: '"canvas_id": "alexa_lf"',
        label: 'Missing canvas_id in context',
      },
      {
        shownJson: '"dimensions": { "width": 4448, "height": 2000 }',
        fixedJson: '"dimensions": { "width": 4448, "height": 1862 }',
        label: 'Height doesn\'t match 2.39:1 ratio',
      },
    ],
    options: [
      { text: 'Version format is wrong (should be an object)', correct: true, bugIndex: 0 },
      { text: 'Missing canvas_id in context', correct: true, bugIndex: 1 },
      { text: 'Frame height doesn\'t match 2.39:1 (should be 1862)', correct: true, bugIndex: 2 },
      { text: 'UUID is in wrong format', correct: false },
    ],
    hint: 'Look at version format, canvas references, and the framing math.',
    reveal: {
      lines: '// Bug 1: version must be { major, minor }\n// Bug 2: context needs canvas_id\n// Bug 3: 4448/2.39 = 1862, not 2000',
      highlightKeys: [],
    },
  },
  {
    id: 27,
    zone: 5,
    type: 'pick',
    brief: 'What file format is an FDL?',
    concept: 'file_format',
    newConcept: null,
    options: [
      { text: 'JSON', correct: true },
      { text: 'XML', correct: false },
      { text: 'CSV', correct: false },
      { text: 'YAML', correct: false },
    ],
    hint: 'You\'ve been looking at it this whole game!',
    reveal: {
      lines: '// FDL files use JSON format\n// File extension: .fdl\n// Content-Type: application/json',
      highlightKeys: [],
    },
  },

  // ═══════════════════════════════════════
  // ZONE 6: THE PIPELINE (Levels 28-30)
  // ═══════════════════════════════════════
  {
    id: 28,
    zone: 6,
    type: 'frame',
    brief: 'The show delivers in UHD 3840×2160. Add a delivery canvas.',
    concept: 'delivery_canvas',
    newConcept: 'Pipeline',
    canvas: { width: 3840, height: 2160 },
    draggable: 'both',
    target: { width: 3840, height: 2160, x: 0, y: 0 },
    startFrame: { width: 2000, height: 1200, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'UHD delivery is 3840 × 2160 pixels.',
    reveal: {
      lines: '{\n  "id": "uhd_delivery",\n  "label": "UHD Delivery",\n  "dimensions": { "width": 3840, "height": 2160 }\n}',
      highlightKeys: ['uhd_delivery'],
    },
  },
  {
    id: 29,
    zone: 6,
    type: 'frame',
    brief: '2 cameras, 1 intent, 1 delivery. Wire the FDL.',
    concept: 'final_assembly',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'alexa', label: 'ARRI Alexa LF\n4448×3096', slot: 'slot_ctx1' },
      { id: 'venice', label: 'Sony Venice\n6054×3192', slot: 'slot_ctx2' },
      { id: 'delivery', label: 'UHD Delivery\n3840×2160', slot: 'slot_ctx3' },
    ],
    slots: [
      { id: 'slot_ctx1', label: 'Context 1: canvas_id', accepts: 'alexa' },
      { id: 'slot_ctx2', label: 'Context 2: canvas_id', accepts: 'venice' },
      { id: 'slot_ctx3', label: 'Context 3: canvas_id', accepts: 'delivery' },
    ],
    hint: 'Each canvas gets its own context with its own framing decisions.',
    reveal: {
      lines: '// Complete multi-camera FDL:\n// 1 intent (2.39:1)\n// 3 canvases (ARRI, Sony, UHD)\n// 3 contexts, each with framing decisions',
      highlightKeys: [],
    },
  },
  {
    id: 30,
    zone: 6,
    type: 'pick',
    brief: 'You get an FDL from the camera department. What does it tell you?',
    concept: 'fdl_purpose',
    newConcept: null,
    options: [
      { text: 'Exactly how to frame the image in your application', correct: true },
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
