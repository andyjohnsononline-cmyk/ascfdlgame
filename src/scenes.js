export const CHAPTER_NAMES = [
  'Robin — Post Supervisor',
  'Morgan — DIT',
  'Quinn — VFX Supervisor',
  'Sage — FDL Expert',
];

export const CHAPTER_CHARACTERS = ['robin', 'morgan', 'quinn', 'sage'];

export const CHAPTER_BACKGROUNDS = [
  'production_office',
  'on_set',
  'vfx_suite',
  'control_room',
];

export const CHAPTER_DESCRIPTIONS = [
  'When to use FDL, the Rule of Defaults, Camera Formats, and workflow coordination',
  'Building an FDL on set: sensor, framing, protection, multi-camera, and anamorphic',
  'Canvas Templates, fit methods, VFX pulls, and downstream framing',
  'FDL validation, the 8-phase pipeline, rounding, alignment, and troubleshooting',
];

export const CHAPTER_REWARDS = [
  { emoji: '📋', text: 'You know when and why to use FDL!' },
  { emoji: '🎬', text: 'You can build an FDL from set!' },
  { emoji: '🎞️', text: 'You understand FDL for VFX plates!' },
  { emoji: '🏆', text: 'FDL EXPERT — You can troubleshoot the entire pipeline!' },
];

export const RESOURCE_LINKS = [
  { id: 'fdl_spec', label: 'ASC FDL Spec & Docs', url: 'https://github.com/ascmitc/fdl' },
  { id: 'impl_guide', label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  { id: 'asc_page', label: 'ASC FDL Official Page', url: 'https://theasc.com/society/ascmitc/asc-framing-decision-list' },
  { id: 'mps_specs', label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  { id: 'calculator', label: 'Netflix Framing Calculator', url: 'https://production-technology-tools.netflixstudios.com/calculators' },
  { id: 'pyfdl', label: 'pyfdl Python Toolkit', url: 'https://apetrynet.github.io/pyfdl/' },
];

export const CHAPTER_RESOURCES = [
  {
    primary: ['mps_specs', 'asc_page'],
    why: 'Robin manages Camera Format config in MPS',
  },
  {
    primary: ['fdl_spec', 'calculator'],
    why: 'Morgan builds FDL files on set',
  },
  {
    primary: ['impl_guide', 'pyfdl'],
    why: 'Quinn configures Canvas Templates for VFX',
  },
  {
    primary: ['fdl_spec', 'impl_guide'],
    why: 'Sage validates the entire FDL pipeline',
  },
];

export function getResourceById(id) {
  return RESOURCE_LINKS.find((r) => r.id === id);
}

export const CHAPTER_RANGES = [
  [1, 6],
  [7, 12],
  [13, 18],
  [19, 24],
];

export function getChapterForScene(sceneId) {
  for (let i = 0; i < CHAPTER_RANGES.length; i++) {
    const [start, end] = CHAPTER_RANGES[i];
    if (sceneId >= start && sceneId <= end) return i;
  }
  return 0;
}

export function isLastSceneInChapter(sceneId) {
  return CHAPTER_RANGES.some(([, end]) => end === sceneId);
}

export function getChapterSceneCount(chapterIndex) {
  const [start, end] = CHAPTER_RANGES[chapterIndex];
  return end - start + 1;
}

export function getChapterCompletedCount(chapterIndex, completedScenes) {
  const [start, end] = CHAPTER_RANGES[chapterIndex];
  let count = 0;
  for (let id = start; id <= end; id++) {
    if (completedScenes.has(id)) count++;
  }
  return count;
}

export function getFirstIncompleteSceneInChapter(chapterIndex, completedScenes) {
  const [start, end] = CHAPTER_RANGES[chapterIndex];
  for (let id = start; id <= end; id++) {
    if (!completedScenes.has(id)) return id;
  }
  return start;
}

export function isChapterComplete(chapterIndex, completedScenes) {
  const [start, end] = CHAPTER_RANGES[chapterIndex];
  for (let id = start; id <= end; id++) {
    if (!completedScenes.has(id)) return false;
  }
  return true;
}

export function getSceneIndexInChapter(sceneId) {
  const ci = getChapterForScene(sceneId);
  const [start] = CHAPTER_RANGES[ci];
  return sceneId - start;
}

// ═══════════════════════════════════════════════════════
// ALL 24 SCENES — 4 chapters × 6 scenes each
// Each scene wraps the original level with narrative
// ═══════════════════════════════════════════════════════

export const SCENES = [
  // ═══════════════════════════════════════
  // CHAPTER 1: ROBIN — THE POST SUPERVISOR
  // Production Office
  // ═══════════════════════════════════════
  {
    id: 1,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Welcome to the production office. I'm Robin, Post Supervisor on this show.", expression: 'neutral' },
      { text: "We've got a big problem. Footage is coming in from set, but the framing is all wrong in our deliveries.", expression: 'concerned' },
      { text: "Let me ask you something about how MPS handles footage when there's no FDL...", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'No FDL was provided to MPS. What framing does it deliver?',
    concept: 'rule_of_defaults',
    newConcept: 'Rule of Defaults',
    options: [
      { text: 'Full source dimensions, scaled to the delivery container', correct: true },
      { text: "A 2.39:1 extraction matching the DP's intended framing", correct: false },
      { text: 'An error — MPS requires an FDL to process footage', correct: false },
      { text: 'The footage is delivered unprocessed', correct: false },
    ],
    hint: "Without an FDL, MPS assumes the full source resolution IS the framing intent.",
    successDialogue: { text: "Exactly! That's the Rule of Defaults. Without an FDL, MPS just scales the full sensor into the delivery container. The DP's creative frame is completely lost.", expression: 'happy' },
    reveal: {
      lines: '// MPS Rule of Defaults:\n// No FDL → full source dimensions\n// scaled into delivery container.\n// The DP\'s creative frame is lost.',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  },
  {
    id: 2,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Here's another situation. Mid-shoot, our B-cam switched to anamorphic lenses.", expression: 'neutral' },
      { text: "I need to know what triggers a new Camera Format in MPS. This affects everything downstream.", expression: 'concerned' },
    ],
    type: 'pick',
    brief: 'Mid-shoot, B-cam switches to anamorphic lenses. What triggers a new Camera Format in MPS?',
    concept: 'camera_format_trigger',
    newConcept: 'Camera Format',
    options: [
      { text: 'Any change to lens squeeze, resolution, codec, camera model, or camera letter', correct: true },
      { text: 'Only a change to the camera model', correct: false },
      { text: 'Only a change to resolution or codec', correct: false },
      { text: 'Camera Formats are set once per project and never change', correct: false },
    ],
    hint: 'A Camera Format is a unique combination of 5 things: squeeze, resolution, codec, camera model, and camera letter.',
    successDialogue: { text: "Right! A Camera Format is a unique combination of five attributes. Change any one of them and you need a new Camera Format entry.", expression: 'happy' },
    reveal: {
      lines: '// Camera Format = unique combo of:\n// \u2022 Lens Squeeze Ratio\n// \u2022 Resolution\n// \u2022 Video Codec\n// \u2022 Source Camera (Model)\n// \u2022 Camera Letter',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  },
  {
    id: 3,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Let me show you what happened on our last delivery. The DP shot 2.39:1 on the Alexa LF, but nobody created an FDL.", expression: 'concerned' },
      { text: "Take a look at what the UHD delivery looks like without one...", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'The DP shot 2.39:1 on Alexa LF (4448\u00d73096). No FDL was created. What does the UHD delivery look like?',
    concept: 'missing_fdl_consequence',
    newConcept: null,
    options: [
      { text: 'The full 4448\u00d73096 sensor scaled into 3840\u00d72160 \u2014 no 2.39:1 extraction', correct: true },
      { text: '2.39:1 letterboxed correctly in the UHD container', correct: false },
      { text: 'A cropped 3840\u00d72160 center cut from the sensor', correct: false },
      { text: 'MPS automatically detects the intended aspect ratio', correct: false },
    ],
    hint: "Without an FDL, MPS doesn't know about the 2.39:1 intent. It delivers the full sensor.",
    successDialogue: { text: "That's the harsh reality. Without an FDL, the DP's beautiful 2.39:1 composition gets squished into a full-sensor scale. We need to fix this.", expression: 'concerned' },
    reveal: {
      lines: '// Without FDL:\n// Source: 4448\u00d73096 (full sensor)\n// \u2192 Scaled to fit 3840\u00d72160\n// \u2192 DP\'s 2.39:1 intent is LOST\n//\n// With FDL:\n// Source frame: 4448\u00d71862 (2.39:1)\n// \u2192 Correctly extracted and scaled',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  },
  {
    id: 4,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "To fix this, we need everyone doing their part. Let me explain who's responsible for what.", expression: 'neutral' },
      { text: "Match each role to their FDL responsibility. This is how our team is organized.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Match each role to their FDL responsibility.',
    concept: 'fdl_responsibilities',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'dit', label: 'DIT\nCreates FDL on set', slot: 'slot_creator' },
      { id: 'postsup', label: 'Post Supervisor\nCamera Format config', slot: 'slot_config' },
      { id: 'vfx', label: 'VFX / Finishing\nConsumes FDL', slot: 'slot_consumer' },
    ],
    slots: [
      { id: 'slot_creator', label: 'Creates the FDL', accepts: 'dit' },
      { id: 'slot_config', label: 'Camera Format setup', accepts: 'postsup' },
      { id: 'slot_consumer', label: 'Uses FDL for plates/delivery', accepts: 'vfx' },
    ],
    hint: 'The DIT creates FDL on set. Post Sup or their vendor configures Camera Formats. VFX/finishing consumes the FDL.',
    successDialogue: { text: "Perfect! Now everyone knows their role. Morgan creates the FDL on set, I handle Camera Format configuration, and Quinn's VFX team consumes it downstream.", expression: 'happy' },
    reveal: {
      lines: '// FDL Workflow Roles:\n// DIT \u2192 Creates FDL (on set)\n// Post Sup \u2192 Camera Format config\n// VFX/Finishing \u2192 Consumes FDL',
      highlightKeys: [],
    },
    docRef: { label: 'ASC FDL Official Page', url: 'https://theasc.com/society/ascmitc/asc-framing-decision-list' },
  },
  {
    id: 5,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Now let's get the workflow order straight. In MPS, the sequence matters.", expression: 'neutral' },
      { text: "Put these steps in the correct order. Get this wrong and the whole pipeline breaks.", expression: 'concerned' },
    ],
    type: 'frame',
    brief: 'Put the MPS workflow in the correct order.',
    concept: 'mps_workflow_order',
    newConcept: 'MPS Workflow',
    subtype: 'connect',
    cards: [
      { id: 'project', label: 'Project Setup\nFrame rate, color science', slot: 'step1' },
      { id: 'camformat', label: 'Camera Format Config\nIDT, framing, color', slot: 'step2' },
      { id: 'fdl', label: 'FDL Creation\nFraming decisions on set', slot: 'step3' },
      { id: 'ingest', label: 'Footage Ingest\nUpload to MPS', slot: 'step4' },
    ],
    slots: [
      { id: 'step1', label: 'Step 1', accepts: 'project' },
      { id: 'step2', label: 'Step 2', accepts: 'camformat' },
      { id: 'step3', label: 'Step 3', accepts: 'fdl' },
      { id: 'step4', label: 'Step 4', accepts: 'ingest' },
    ],
    hint: 'Project Settings come first. Camera Formats must be configured before footage can be processed.',
    successDialogue: { text: "That's the right order! Setup first, then Camera Formats, then FDL creation on set, and finally ingest. Now let me quiz you on one more thing...", expression: 'happy' },
    reveal: {
      lines: '// MPS Pipeline:\n// 1. Project Setup (settings)\n// 2. Camera Format Config\n// 3. FDL Creation (on set)\n// 4. Footage Ingest \u2192 processing',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
  },
  {
    id: 6,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Last question for my chapter. Our show has three cameras, each with different setups.", expression: 'neutral' },
      { text: "A-cam is an Alexa 35 with spherical lenses. B-cam is also Alexa 35 but with 1.3x anamorphic. C-cam is a drone.", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'A show has: A-cam Alexa 35 (spherical), B-cam Alexa 35 (1.3\u00d7 anamorphic), C-cam drone. How many Camera Formats minimum?',
    concept: 'camera_format_count',
    newConcept: null,
    options: [
      { text: '3 \u2014 each has a unique squeeze, camera letter, or codec combination', correct: true },
      { text: '1 \u2014 they all share the same framing intent', correct: false },
      { text: '2 \u2014 the two ARRI cameras share a format', correct: false },
      { text: '5 \u2014 each camera letter needs multiple formats', correct: false },
    ],
    hint: 'A-cam and B-cam differ by squeeze ratio AND camera letter. The drone differs by model, resolution, and codec.',
    successDialogue: { text: "Three formats, exactly right! Now you understand my world. Time to visit Morgan on set — they need to build the actual FDL.", expression: 'happy' },
    reveal: {
      lines: '// Camera Format breakdown:\n// A: Alexa35, 1.0\u00d7, ARRIRAW, A\n// B: Alexa35, 1.3\u00d7, ARRIRAW, B\n// C: Drone,   1.0\u00d7, ProRes,  C\n// = 3 unique Camera Formats',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 2: MORGAN — THE DIT
  // On Set
  // ═══════════════════════════════════════
  {
    id: 7,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "Hey! I'm Morgan, the DIT. Robin sent you my way — good, I could use the help.", expression: 'neutral' },
      { text: "We need to build an FDL from scratch. Step one: define the camera sensor as a Canvas.", expression: 'neutral' },
      { text: "Our A-cam is the ARRI Alexa LF. Drag the frame to match the full sensor: 4448 \u00d7 3096.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Step 1: Define Camera Format. Set the ARRI Alexa LF sensor: 4448 \u00d7 3096.',
    concept: 'canvas_sensor_setup',
    newConcept: 'Canvas',
    canvas: { width: 4448, height: 3096 },
    draggable: 'both',
    target: { width: 4448, height: 3096, x: 0, y: 0 },
    startFrame: { width: 2200, height: 1500, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'The canvas represents the full sensor. Match both width (4448) and height (3096).',
    successDialogue: { text: "The canvas is set. That's our full sensor — every pixel the Alexa LF captures. Now let's frame the DP's creative intent inside it.", expression: 'happy' },
    reveal: {
      lines: '"canvas": {\n  "id": "alexa_lf",\n  "dimensions": {\n    "width": 4448,\n    "height": 3096\n  }\n}',
      highlightKeys: ['dimensions', 'width', 'height'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 8,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "The DP just called for '2.39 scope.' That's our creative frame.", expression: 'neutral' },
      { text: "I need you to frame the 2.39:1 aspect ratio inside the sensor. Drag the frame to match.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "The DP says \"2.39 scope.\" Frame it within the sensor.",
    concept: 'framing_decision_239',
    newConcept: 'Framing Decision',
    canvas: { width: 4448, height: 3096 },
    draggable: 'height',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 3096, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Height = 4448 / 2.39 \u2248 1862. Center vertically: y = (3096 \u2212 1862) / 2 = 617.',
    successDialogue: { text: "That's the Framing Decision — the exact pixel rectangle the audience will see. 4448 wide, 1862 tall, centered in the sensor.", expression: 'happy' },
    reveal: {
      lines: '"framing_decision": {\n  "dimensions": {\n    "width": 4448, "height": 1862\n  },\n  "anchor_point": { "x": 0, "y": 617 }\n}',
      highlightKeys: ['dimensions', 'anchor_point'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 9,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "The DP also wants a 5% protection zone for stabilization in post.", expression: 'neutral' },
      { text: "Drag outward to expand the protection boundary around the framing decision.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'The DP wants 5% protection for stabilization in post. Add the protection zone.',
    concept: 'protection_zone',
    newConcept: 'Protection',
    canvas: { width: 4448, height: 3096 },
    draggable: 'protection',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    protectionTarget: {
      width: Math.round((4448 * 1.05) / 2) * 2,
      height: Math.round((1862 * 1.05) / 2) * 2,
    },
    startProtection: { width: 4448, height: 1862 },
    labels: { canvas: 'SENSOR', frame: 'FRAMING 2.39:1', protection: 'PROTECTION' },
    tolerance: 0.08,
    hint: 'Protection = frame dimensions \u00d7 1.05. Drag outward to expand the cyan protection zone.',
    successDialogue: { text: "Protection zone is locked. Post can now stabilize up to 5% without losing any of the DP's frame. Important: protection is never auto-filled!", expression: 'happy' },
    reveal: {
      lines: '"framing_intent": {\n  "aspect_ratio": {\n    "width": 2.39, "height": 1\n  },\n  "protection": 0.05\n}',
      highlightKeys: ['protection', 'aspect_ratio'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 10,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "We've got a second camera now — B-cam Sony Venice 2. Same 2.39:1 framing intent.", expression: 'neutral' },
      { text: "I need to wire both cameras to the same intent using Contexts. Help me connect them.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'B-cam is Sony Venice 2 (6054\u00d73192). Same 2.39:1 intent. Build both contexts.',
    concept: 'multi_camera_fdl',
    newConcept: 'Context',
    subtype: 'connect',
    cards: [
      { id: 'alexa', label: 'ARRI Alexa LF\n4448\u00d73096', slot: 'ctx1_canvas' },
      { id: 'venice', label: 'Sony Venice 2\n6054\u00d73192', slot: 'ctx2_canvas' },
      { id: 'intent', label: 'Framing Intent\n2.39:1 Scope', slot: 'shared_intent' },
    ],
    slots: [
      { id: 'ctx1_canvas', label: 'Context 1: canvas_id', accepts: 'alexa' },
      { id: 'ctx2_canvas', label: 'Context 2: canvas_id', accepts: 'venice' },
      { id: 'shared_intent', label: 'Shared: framing_intent_id', accepts: 'intent' },
    ],
    hint: "Each camera gets its own context. Both reference the same framing intent (2.39:1).",
    successDialogue: { text: "Two contexts, one shared intent. The audience sees the same 2.39:1 composition from both cameras, even though the sensors are completely different sizes.", expression: 'happy' },
    reveal: {
      lines: '"contexts": [\n  { "canvas_id": "alexa_lf", ... },\n  { "canvas_id": "venice_2", ... }\n]\n// Both reference "scope_239"',
      highlightKeys: ['canvas_id', 'framing_intent_id'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 11,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "Plot twist — B-cam is switching to anamorphic 1.3\u00d7 squeeze lenses for the next scene.", expression: 'concerned' },
      { text: "I need you to set the anamorphic squeeze factor. Use the slider.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'B-cam switches to anamorphic 1.3\u00d7 squeeze lenses. Set the squeeze factor.',
    concept: 'anamorphic_squeeze',
    newConcept: 'Anamorphic',
    subtype: 'anamorphic',
    canvas: { width: 4448, height: 3096 },
    squeezeValue: 1.3,
    framingFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    hint: 'Set the squeeze to 1.3. The frame desqueezes horizontally to show the true field of view.',
    successDialogue: { text: "1.3\u00d7 squeeze locked in. The horizontal field of view is wider than what the sensor captures — that's the magic of anamorphic.", expression: 'happy' },
    reveal: {
      lines: '"anamorphic_squeeze": 1.3\n\n// Normalized width = 4448 \u00d7 1.3\n// = 5782 (true horizontal FoV)',
      highlightKeys: ['anamorphic_squeeze'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 12,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "Last step on my end — every FDL file needs a proper header with metadata.", expression: 'neutral' },
      { text: "Fill in the version and creator. The UUID is auto-generated.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Every FDL needs a header. Fill in the metadata.',
    concept: 'fdl_header',
    newConcept: 'FDL File',
    subtype: 'fillHeader',
    fields: [
      { key: 'uuid', prefill: 'urn:uuid:a1b2c3d4-...', auto: true },
      { key: 'version', options: ['1.0', '2.0', '0.1'], correct: '1.0' },
      { key: 'fdl_creator', placeholder: 'DIT name or tool', freeText: true },
    ],
    hint: 'The current FDL version is 1.0. The UUID is auto-generated. Creator identifies who made the file.',
    successDialogue: { text: "FDL is complete! I'll send this to Robin for Camera Format configuration. Now Quinn needs it for VFX plates — head to the VFX suite!", expression: 'happy' },
    reveal: {
      lines: '{\n  "uuid": "urn:uuid:...",\n  "version": { "major": 1, "minor": 0 },\n  "fdl_creator": "Netflix Calculator"\n}',
      highlightKeys: ['uuid', 'version', 'fdl_creator'],
    },
    docRef: { label: 'Netflix Framing Calculator', url: 'https://production-technology-tools.netflixstudios.com/calculators' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 3: QUINN — THE VFX SUPERVISOR
  // VFX Suite
  // ═══════════════════════════════════════
  {
    id: 13,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "I'm Quinn, VFX Supervisor. Morgan's FDL just came through, and I need to set up our plate pipeline.", expression: 'neutral' },
      { text: "We need 4K DCI plates from the Alexa LF source. What FDL element defines this output transform?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'VFX needs 4K DCI plates from Alexa LF source. What FDL element defines the output transform?',
    concept: 'canvas_template_intro',
    newConcept: 'Canvas Template',
    options: [
      { text: 'A Canvas Template \u2014 it transforms source geometry to a target canvas', correct: true },
      { text: 'A new framing intent from the DP', correct: false },
      { text: 'A separate VFX-specific FDL file', correct: false },
      { text: 'An ACES Input Device Transform (IDT)', correct: false },
    ],
    hint: 'Canvas Templates define how to map source framing geometry to a new output resolution.',
    successDialogue: { text: "Canvas Templates are how we define output formats. They take the source geometry and map it to our target resolution.", expression: 'happy' },
    reveal: {
      lines: '"canvas_templates": [{\n  "id": "vfx_pull_4k",\n  "label": "VFX Pull 4K DCI",\n  "target_dimensions": {\n    "width": 4096, "height": 2160\n  }\n}]',
      highlightKeys: ['canvas_templates', 'target_dimensions'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 14,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "Now I need to configure the VFX pull pipeline. Two critical settings.", expression: 'neutral' },
      { text: "What source layer do we fit, and how much extra area do we preserve for compositing?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Configure the VFX pull: what source layer gets fitted, and what extra area to preserve?',
    concept: 'vfx_pipeline_config',
    newConcept: 'fit_source',
    subtype: 'pipelineConfig',
    fitSourceOptions: [
      { id: 'canvas.dimensions', label: 'Canvas (full sensor)' },
      { id: 'canvas.effective_dimensions', label: 'Effective Canvas' },
      { id: 'framing_decision.dimensions', label: 'Framing Decision', correct: true },
    ],
    preserveOptions: [
      { id: 'none', label: 'None' },
      { id: 'canvas.dimensions', label: 'Canvas (full sensor)' },
      { id: 'canvas.effective_dimensions', label: 'Effective Canvas', correct: true },
    ],
    hint: "Fit the framing decision (the DP's creative frame). Preserve the effective canvas so VFX has extra pixels for compositing.",
    successDialogue: { text: "Fit the framing decision, preserve the effective canvas. That gives us the DP's frame plus extra pixels for paint and compositing.", expression: 'happy' },
    reveal: {
      lines: '"fit_source":\n  "framing_decision.dimensions"\n"preserve_from_source_canvas":\n  "canvas.effective_dimensions"',
      highlightKeys: ['fit_source', 'preserve_from_source_canvas'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 15,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "There are two fit methods we use for VFX: fit_all and fill. They behave very differently.", expression: 'neutral' },
      { text: "Tap each one to see what happens to the source frame. This is critical to understand.", expression: 'concerned' },
    ],
    type: 'frame',
    brief: 'Two fit methods for VFX plates: fit_all vs fill. Tap each to see the result.',
    concept: 'fit_methods_vfx',
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
    hint: 'fit_all ensures nothing is cropped (may letterbox). fill crops to fill the target completely.',
    successDialogue: { text: "For VFX plates, always use fit_all. We can't lose a single pixel — cropped pixels are gone forever.", expression: 'happy' },
    reveal: {
      lines: '// For VFX plates, use fit_all:\n// \u2192 Preserves ALL framing pixels\n// \u2192 May letterbox in the container\n//\n// fill would CROP the source\n// \u2192 Lost pixels can\'t be recovered',
      highlightKeys: ['fit_method'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 16,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "My team needs extra pixels beyond the 2.39:1 frame for a sky replacement shot.", expression: 'concerned' },
      { text: "There's an FDL setting that gives us those extra pixels. Do you know which one?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'VFX needs extra pixels beyond the 2.39:1 frame for sky replacements. What FDL setting provides this?',
    concept: 'preserve_from_source',
    newConcept: null,
    options: [
      { text: 'preserve_from_source_canvas: canvas.effective_dimensions', correct: true },
      { text: 'Increase the protection percentage to 50%', correct: false },
      { text: 'Switch the fit method from fit_all to fill', correct: false },
      { text: 'Create a separate FDL file for VFX', correct: false },
    ],
    hint: 'preserve_from_source_canvas includes additional pixel area from a larger source layer in the output.',
    successDialogue: { text: "That's it! preserve_from_source_canvas gives us the pixels beyond the frame boundary for compositing work.", expression: 'happy' },
    reveal: {
      lines: '"preserve_from_source_canvas":\n  "canvas.effective_dimensions"\n\n// Includes pixels beyond the frame\n// for compositing and paint work',
      highlightKeys: ['preserve_from_source_canvas'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 17,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "Time for some math. I need the scale factor for our VFX pull.", expression: 'neutral' },
      { text: "Source frame is 4448\u00d71862, target is 3840\u00d72160, using fit_all. Which ratio do we use?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "VFX pull: source frame 4448\u00d71862, target 3840\u00d72160, fit_all. What's the scale factor?",
    concept: 'scale_factor_vfx',
    newConcept: 'Scale Factor',
    subtype: 'scaleFactor',
    sourceFrame: { width: 4448, height: 1862 },
    targetDims: { width: 3840, height: 2160 },
    fitMethod: 'fit_all',
    scaleOptions: [
      { label: 'Width ratio: 3840 \u00f7 4448 = 0.8633', value: 0.8633, correct: true },
      { label: 'Height ratio: 2160 \u00f7 1862 = 1.1600', value: 1.16, correct: false },
    ],
    hint: 'fit_all uses the SMALLER ratio so the source fits entirely. min(0.8633, 1.16) = 0.8633.',
    successDialogue: { text: "0.8633 — the smaller ratio, because fit_all means everything must fit. We scale by width, and the height naturally follows.", expression: 'happy' },
    reveal: {
      lines: '// scale = min(target_w/source_w,\n//             target_h/source_h)\n// = min(3840/4448, 2160/1862)\n// = min(0.8633, 1.1600)\n// = 0.8633',
      highlightKeys: ['scale'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 18,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "We have a problem! The VFX plates arrived cropped — pixels are missing from the edges.", expression: 'concerned' },
      { text: "Something is wrong with the pipeline config. Can you diagnose it?", expression: 'concerned' },
    ],
    type: 'fix',
    brief: 'The VFX plates arrived cropped \u2014 pixels are missing from the edges. Diagnose the config.',
    concept: 'fix_vfx_crop',
    newConcept: null,
    canvas: { width: 3840, height: 2160 },
    shownFrame: { width: 4460, height: 2160, x: -310, y: 0 },
    correctFrame: { width: 3840, height: 1608, x: 0, y: 276 },
    labels: { canvas: 'TARGET 3840\u00d72160', frame: 'SOURCE (cropped!)' },
    options: [
      { text: 'fit_method is "fill" \u2014 should be "fit_all"', correct: true },
      { text: 'The target dimensions are wrong', correct: false },
      { text: 'The source canvas is too large', correct: false },
      { text: 'preserve_from_source_canvas is missing', correct: false },
    ],
    hint: '"fill" crops to fill the target completely. "fit_all" preserves all source pixels.',
    successDialogue: { text: "Found it! Someone set fill instead of fit_all. Fill crops to fill the target, destroying pixels. I'll get this fixed immediately.", expression: 'happy' },
    reveal: {
      lines: '// "fill" caused cropping!\n// Fix: "fit_method": "fit_all"\n//\n// fit_all \u2192 source fits entirely\n// fill \u2192 source fills target (crops)',
      highlightKeys: ['fit_method'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 4: SAGE — THE FDL EXPERT
  // Control Room
  // ═══════════════════════════════════════
  {
    id: 19,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "I'm Sage. I've been validating FDL files for years. The others have done their part — now I need to make sure everything holds together.", expression: 'neutral' },
      { text: "This FDL just came through and something is broken. Can you spot the error?", expression: 'concerned' },
    ],
    type: 'fix',
    brief: 'This FDL is broken. Find the error.',
    concept: 'fix_canvas_ref',
    newConcept: 'Reference Integrity',
    canvas: null,
    shownJson: '{\n  "canvases": [\n    { "id": "VENICE_FF_6K" }\n  ],\n  "contexts": [{\n    "canvas_id": "VENICE_FF"\n  }]\n}',
    options: [
      { text: 'canvas_id doesn\'t match \u2014 "VENICE_FF" vs "VENICE_FF_6K"', correct: true },
      { text: 'The canvas dimensions are missing', correct: false },
      { text: 'The context needs a framing_intent_id', correct: false },
      { text: 'The UUID is missing from the header', correct: false },
    ],
    hint: 'Compare the canvas id to the canvas_id in the context \u2014 they must match exactly.',
    successDialogue: { text: "Sharp eyes. The context references 'VENICE_FF' but the canvas is 'VENICE_FF_6K'. IDs must be exact string matches — no partial matching.", expression: 'happy' },
    reveal: {
      lines: '// Canvas id:   "VENICE_FF_6K"\n// Context refs: "VENICE_FF"  \u2190 MISMATCH\n//\n// Fix: "canvas_id": "VENICE_FF_6K"\n// IDs must be exact string matches.',
      highlightKeys: ['canvas_id'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 20,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "Another broken FDL. This one has a subtle error in the framing_intent_id.", expression: 'neutral' },
      { text: "Look carefully at the IDs. The devil is in the details.", expression: 'neutral' },
    ],
    type: 'fix',
    brief: 'Another broken FDL. The framing_intent_id has a subtle error.',
    concept: 'fix_intent_ref',
    newConcept: null,
    canvas: null,
    shownJson: '{\n  "framing_intents": [\n    { "id": "scope_239" }\n  ],\n  "framing_decisions": [{\n    "framing_intent_id": "scope_293"\n  }]\n}',
    options: [
      { text: 'framing_intent_id has a typo \u2014 "scope_293" should be "scope_239"', correct: true },
      { text: 'The aspect ratio is missing from the intent', correct: false },
      { text: 'The canvas_id is not defined', correct: false },
      { text: 'The decision dimensions are missing', correct: false },
    ],
    hint: 'Look carefully at the numbers: 239 vs 293. Transposed digits.',
    successDialogue: { text: "239 became 293 — transposed digits. This kind of typo can break an entire pipeline. Always validate your ID references.", expression: 'happy' },
    reveal: {
      lines: '// Intent id:    "scope_239"\n// Decision refs: "scope_293"  \u2190 TYPO\n//\n// Fix: "framing_intent_id": "scope_239"\n// Always validate ID references!',
      highlightKeys: ['framing_intent_id'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
  },
  {
    id: 21,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "Now let me teach you the 8-phase template pipeline. This is how Canvas Templates are applied.", expression: 'neutral' },
      { text: "The first five phases are: Derive, Populate, Fill Gaps, Scale Factor, then Normalize/Scale/Round.", expression: 'neutral' },
      { text: "What comes next?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'The 8-phase template pipeline: what comes after "Normalize, Scale, Round"?',
    concept: 'pipeline_phases',
    newConcept: 'Template Pipeline',
    options: [
      { text: 'Output Size & Alignment', correct: true },
      { text: 'Populate Source Geometry', correct: false },
      { text: 'Crop to Visible', correct: false },
      { text: 'Derive Configuration', correct: false },
    ],
    hint: 'The pipeline: Derive \u2192 Populate \u2192 Fill Gaps \u2192 Scale Factor \u2192 Normalize/Scale/Round \u2192 Output Size \u2192 Offsets \u2192 Crop.',
    successDialogue: { text: "Output Size & Alignment, then Apply Offsets, then Crop to Visible. Eight phases, in that exact order.", expression: 'happy' },
    reveal: {
      lines: 'Phase 1: Derive Configuration\nPhase 2: Populate Source Geometry\nPhase 3: Fill Hierarchy Gaps\nPhase 4: Calculate Scale Factor\nPhase 5: Normalize, Scale, Round\nPhase 6: Output Size & Alignment  \u2190\nPhase 7: Apply Offsets to Anchors\nPhase 8: Crop to Visible',
      highlightKeys: [],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 22,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "Phase 5 involves rounding. After scaling, we get fractional pixel values.", expression: 'neutral' },
      { text: "1862 \u00d7 0.8633 = 1607.7 pixels. The spec says: round to even, round up. What's the answer?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "After scaling: 1862 \u00d7 0.8633 = 1607.7. Round to even, up. What's the result?",
    concept: 'rounding_rules',
    newConcept: 'Rounding',
    subtype: 'roundingPick',
    calculation: '1862 \u00d7 0.8633 = 1607.7',
    roundOptions: [
      { value: 1606, label: '1606' },
      { value: 1608, label: '1608', correct: true },
      { value: 1607, label: '1607' },
      { value: 1610, label: '1610' },
    ],
    hint: 'Round to even means the result must be divisible by 2. "Up" means round up. 1608 is even and \u2265 1607.7.',
    successDialogue: { text: "1608. It must be even (divisible by 2) and we round up. 1607 is odd, so the next even number up is 1608.", expression: 'happy' },
    reveal: {
      lines: '"round": {\n  "even": "even",\n  "mode": "up"\n}\n// 1607.7 \u2192 round up to even \u2192 1608\n// (1607 is odd, next even up = 1608)',
      highlightKeys: ['round', 'even', 'mode'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 23,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "Phase 6: alignment. Our scaled frame is 3840\u00d71608 and needs to sit inside a 3840\u00d72160 container.", expression: 'neutral' },
      { text: "Let's align it. Try center/center first, then right/bottom.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Delivery: the scaled frame is 3840\u00d71608 in a 3840\u00d72160 container. Align it.',
    concept: 'alignment_methods',
    newConcept: 'Alignment',
    subtype: 'alignment',
    targetDims: { width: 3840, height: 2160 },
    scaledFrame: { width: 3840, height: 1608 },
    alignmentModes: [
      { h: 'center', v: 'center', label: 'center / center' },
      { h: 'right', v: 'bottom', label: 'right / bottom' },
    ],
    hint: 'Center alignment places the frame equally between edges. Right/bottom pushes it to the corner.',
    successDialogue: { text: "You've got the alignment down. Center/center is the most common, but sometimes finishing requires specific placement.", expression: 'happy' },
    reveal: {
      lines: '"alignment_method_horizontal": "center"\n"alignment_method_vertical": "center"\n\n// center/center: y = (2160\u22121608)/2 = 276\n// right/bottom: x = 0, y = 552',
      highlightKeys: ['alignment_method_horizontal', 'alignment_method_vertical'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
  },
  {
    id: 24,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "One final puzzle. The output shows a protection area, but the source FDL never defined one.", expression: 'concerned' },
      { text: "This should never happen. What went wrong?", expression: 'concerned' },
    ],
    type: 'fix',
    brief: "The output shows a protection area, but the source FDL never defined one. What's wrong?",
    concept: 'protection_sacred',
    newConcept: null,
    canvas: { width: 3840, height: 2160 },
    shownFrame: { width: 3840, height: 1608, x: 0, y: 276 },
    shownProtection: { width: 3840, height: 1688, x: 0, y: 236 },
    labels: { frame: 'FRAMING', protection: 'PROTECTION (auto-filled?!)' },
    options: [
      { text: 'Protection is never auto-filled \u2014 this is a pipeline bug', correct: true },
      { text: 'Protection should always match the framing dimensions', correct: false },
      { text: 'Protection is automatically 5% larger than framing', correct: false },
      { text: 'The template is generating protection correctly', correct: false },
    ],
    hint: 'Protection dimensions are sacred \u2014 they must be explicitly defined in the source FDL, never auto-generated.',
    successDialogue: { text: "Protection is sacred — it is NEVER auto-filled. If it wasn't in the source FDL, it should be zero in the output. This is a pipeline bug that needs fixing.", expression: 'happy' },
    reveal: {
      lines: '// Protection is NEVER auto-filled.\n// If not defined in the source FDL,\n// it stays ZERO in the output.\n//\n// This is a pipeline bug \u2014 protection\n// must come from the original FDL.',
      highlightKeys: ['protection'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
    isChapterEnd: true,
    isGameEnd: true,
  },
];
