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
  'MPS portal, Camera Format config, delivery specs, and coordinating the pipeline across departments',
  'Building FDL on the DIT cart: sensor setup, framing, protection, multi-camera rigs, and anamorphic',
  'Nuke templates, DaVinci Resolve, VFX plate pulls, fit methods, and downstream compositing',
  'pyfdl validation, the 8-phase pipeline, rounding rules, alignment, and pipeline debugging',
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
  // Production Office — MPS Portal, Delivery Specs
  // ═══════════════════════════════════════
  {
    id: 1,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "The showrunner just called. Our UHD deliveries from last night look wrong — the framing is stretched.", expression: 'concerned' },
      { text: "I pulled up the MPS portal and checked the delivery specs. There's no FDL attached to any of these Camera Formats.", expression: 'concerned' },
      { text: "Before I call Morgan on set, tell me: what does MPS do with footage when there's no FDL?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'No FDL was attached in the MPS portal. What framing does MPS deliver?',
    concept: 'rule_of_defaults',
    newConcept: 'Rule of Defaults',
    options: [
      { text: 'Full source dimensions, scaled to the delivery container', correct: true },
      { text: "A 2.39:1 extraction matching the DP's intended framing", correct: false },
      { text: 'An error — MPS requires an FDL to process footage', correct: false },
      { text: 'The footage is delivered unprocessed', correct: false },
    ],
    hint: "Without an FDL, MPS assumes the full source resolution IS the framing intent.",
    successDialogue: { text: "That's the Rule of Defaults. MPS scales the full sensor into the delivery container — the DP's creative frame is lost. I need to get Morgan on the phone.", expression: 'happy' },
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
      { text: "I just got the camera report from Morgan's Silverstack logs. Mid-day, B-cam switched from spherical to 1.3\u00d7 anamorphic.", expression: 'neutral' },
      { text: "I need to add a new Camera Format in the MPS portal before tomorrow's dailies go out. What triggers that change?", expression: 'concerned' },
    ],
    type: 'pick',
    brief: 'B-cam switches to anamorphic mid-shoot. What triggers a new Camera Format in MPS?',
    concept: 'camera_format_trigger',
    newConcept: 'Camera Format',
    options: [
      { text: 'Any change to lens squeeze, resolution, codec, camera model, or camera letter', correct: true },
      { text: 'Only a change to the camera model', correct: false },
      { text: 'Only a change to resolution or codec', correct: false },
      { text: 'Camera Formats are set once per project and never change', correct: false },
    ],
    hint: 'A Camera Format is a unique combination of 5 things: squeeze, resolution, codec, camera model, and camera letter.',
    successDialogue: { text: "Right. Five attributes define a Camera Format. The anamorphic swap changes the squeeze ratio — that's a new format I need to configure in MPS before ingest.", expression: 'happy' },
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
      { text: "Let me pull up the Resolve timeline from last night's conform. The DP shot 2.39:1 on the Alexa LF, but nobody created an FDL.", expression: 'concerned' },
      { text: "The colorist just called — the UHD delivery master looks completely wrong. What happened?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'DP shot 2.39:1 on Alexa LF (4448\u00d73096). No FDL created. What does the UHD delivery look like?',
    concept: 'missing_fdl_consequence',
    newConcept: null,
    options: [
      { text: 'The full 4448\u00d73096 sensor scaled into 3840\u00d72160 \u2014 no 2.39:1 extraction', correct: true },
      { text: '2.39:1 letterboxed correctly in the UHD container', correct: false },
      { text: 'A cropped 3840\u00d72160 center cut from the sensor', correct: false },
      { text: 'MPS automatically detects the intended aspect ratio', correct: false },
    ],
    hint: "Without an FDL, MPS doesn't know about the 2.39:1 intent. It delivers the full sensor.",
    successDialogue: { text: "The DP's 2.39:1 scope composition is squished into full-sensor scale. The colorist sees it, the showrunner sees it, everyone sees wrong framing. This is why FDL matters.", expression: 'concerned' },
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
      { text: "I'm building the workflow chart for our post team. I need everyone aligned — Morgan on set, me in the MPS portal, Quinn's VFX team pulling plates in Nuke.", expression: 'neutral' },
      { text: "Match each role to what they're responsible for in the FDL pipeline. This is how we stay coordinated.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Match each role to their FDL responsibility in the pipeline.',
    concept: 'fdl_responsibilities',
    newConcept: null,
    subtype: 'connect',
    cards: [
      { id: 'dit', label: 'DIT (Morgan)\nCreates FDL on set', slot: 'slot_creator' },
      { id: 'postsup', label: 'Post Sup (Robin)\nCamera Format in MPS', slot: 'slot_config' },
      { id: 'vfx', label: 'VFX Sup (Quinn)\nPulls plates in Nuke', slot: 'slot_consumer' },
    ],
    slots: [
      { id: 'slot_creator', label: 'Creates the FDL', accepts: 'dit' },
      { id: 'slot_config', label: 'Camera Format setup', accepts: 'postsup' },
      { id: 'slot_consumer', label: 'Uses FDL for plates/delivery', accepts: 'vfx' },
    ],
    hint: 'Morgan creates FDL on set with the Calculator. Robin configures Camera Formats in MPS. Quinn consumes the FDL for VFX plate pulls.',
    successDialogue: { text: "That's our pipeline. Morgan creates on set, I configure in MPS, Quinn pulls plates in Nuke. Everyone depends on everyone else.", expression: 'happy' },
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
      { text: "Before any footage hits the MPS portal, I need the pipeline configured in the right order. One step out of sequence and the dailies break.", expression: 'neutral' },
      { text: "Put these MPS workflow steps in the correct order. Get this wrong and we're re-processing everything.", expression: 'concerned' },
    ],
    type: 'frame',
    brief: 'Arrange the MPS workflow steps in the correct order.',
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
    successDialogue: { text: "That's the order. Project setup, Camera Format config, FDL creation on set, then ingest. I'll have the MPS portal ready before Morgan's drives arrive.", expression: 'happy' },
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
      { text: "I'm looking at the camera report for tomorrow. Three cameras, three different configurations.", expression: 'neutral' },
      { text: "A-cam: Alexa 35, spherical. B-cam: Alexa 35, 1.3\u00d7 anamorphic. C-cam: a DJI drone shooting ProRes.", expression: 'neutral' },
      { text: "How many Camera Formats do I need to configure in the MPS portal?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'A-cam Alexa 35 (spherical), B-cam Alexa 35 (1.3\u00d7 anamorphic), C-cam DJI drone. How many Camera Formats?',
    concept: 'camera_format_count',
    newConcept: null,
    options: [
      { text: '3 \u2014 each has a unique squeeze, camera letter, or codec combination', correct: true },
      { text: '1 \u2014 they all share the same framing intent', correct: false },
      { text: '2 \u2014 the two ARRI cameras share a format', correct: false },
      { text: '5 \u2014 each camera letter needs multiple formats', correct: false },
    ],
    hint: 'A-cam and B-cam differ by squeeze ratio AND camera letter. The drone differs by model, resolution, and codec.',
    successDialogue: { text: "Three formats. I'll configure all three in MPS tonight. Now head to set — Morgan needs help building the actual FDL on the DIT cart.", expression: 'happy' },
    reveal: {
      lines: '// Camera Format breakdown:\n// A: Alexa35, 1.0\u00d7, ARRIRAW, A\n// B: Alexa35, 1.3\u00d7, ARRIRAW, B\n// C: Drone,   1.0\u00d7, ProRes,  C\n// = 3 unique Camera Formats',
      highlightKeys: [],
    },
    docRef: { label: 'Netflix MPS Tech Specs', url: 'https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 2: MORGAN — THE DIT
  // On Set — Silverstack, LiveGrade, FDL Creator
  // ═══════════════════════════════════════
  {
    id: 7,
    chapter: 1,
    character: 'morgan',
    background: 'on_set',
    dialogue: [
      { text: "Robin sent you — good. I'm at my DIT cart and the AD just called first shot. I've got Silverstack running for backup verification and the Framing Calculator open.", expression: 'neutral' },
      { text: "First thing: I need to define our A-cam sensor as a Canvas in the FDL. The Alexa LF shoots 4448 \u00d7 3096.", expression: 'neutral' },
      { text: "Drag the frame to match the full sensor dimensions. This is the foundation of everything.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Define the ARRI Alexa LF sensor canvas in the Framing Calculator: 4448 \u00d7 3096.',
    concept: 'canvas_sensor_setup',
    newConcept: 'Canvas',
    canvas: { width: 4448, height: 3096 },
    draggable: 'both',
    target: { width: 4448, height: 3096, x: 0, y: 0 },
    startFrame: { width: 2200, height: 1500, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'The canvas represents the full sensor. Match both width (4448) and height (3096).',
    successDialogue: { text: "Canvas is set. That's every pixel the Alexa LF captures. Silverstack confirms the resolution matches the ARRIRAW files coming off the mags.", expression: 'happy' },
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
      { text: "The DP is at the monitor with LiveGrade running. She calls out: '2.39 scope.' That's our creative frame.", expression: 'neutral' },
      { text: "I need to set this in the Framing Calculator and make sure the LUT on my reference monitor matches. Frame the 2.39:1 inside the sensor.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "The DP calls '2.39 scope' at video village. Frame it within the Alexa LF sensor.",
    concept: 'framing_decision_239',
    newConcept: 'Framing Decision',
    canvas: { width: 4448, height: 3096 },
    draggable: 'height',
    target: { width: 4448, height: 1862, x: 0, y: 617 },
    startFrame: { width: 4448, height: 3096, x: 0, y: 0 },
    tolerance: 0.08,
    hint: 'Height = 4448 / 2.39 \u2248 1862. Center vertically: y = (3096 \u2212 1862) / 2 = 617.',
    successDialogue: { text: "That's the Framing Decision — 4448\u00d71862, centered. The audience will see exactly this rectangle. My reference monitor now shows the correct frame lines.", expression: 'happy' },
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
      { text: "The DP just told me she wants 5% protection for stabilization. The editor and finishing house in Resolve will need that extra headroom.", expression: 'neutral' },
      { text: "Drag outward to expand the protection boundary around the framing decision. This is critical for post.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'DP requests 5% protection for Resolve stabilization. Set the protection zone.',
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
    successDialogue: { text: "Protection locked. The finishing house can stabilize up to 5% in Resolve without cutting into the DP's frame. And remember: protection is never auto-filled by the pipeline.", expression: 'happy' },
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
      { text: "The gaffer just told me B-cam is set up. It's a Sony Venice 2 — different sensor, same 2.39:1 framing intent from the DP.", expression: 'neutral' },
      { text: "I need to wire both cameras to the same intent using FDL Contexts. Each camera gets its own context but they share the framing intent.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'B-cam Venice 2 (6054\u00d73192) joins A-cam. Same 2.39:1 intent. Build both contexts.',
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
    hint: "Each camera gets its own context referencing its canvas. Both contexts share the same framing intent (2.39:1).",
    successDialogue: { text: "Two contexts, one shared intent. Different sensors, same composition. My Silverstack checksum logs will track both cameras, and the FDL keeps them aligned.", expression: 'happy' },
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
      { text: "The 1st AC just radioed me — B-cam is swapping to 1.3\u00d7 anamorphic lenses for the next scene. I need to update the FDL before the next take.", expression: 'concerned' },
      { text: "Robin will need a new Camera Format in MPS for this. Set the anamorphic squeeze factor.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'B-cam swaps to 1.3\u00d7 anamorphic. Update the squeeze factor before the next take.',
    concept: 'anamorphic_squeeze',
    newConcept: 'Anamorphic',
    subtype: 'anamorphic',
    canvas: { width: 4448, height: 3096 },
    squeezeValue: 1.3,
    framingFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    hint: 'Set the squeeze to 1.3. The frame desqueezes horizontally to show the true field of view.',
    successDialogue: { text: "1.3\u00d7 squeeze set. I'll radio Robin that B-cam needs a new Camera Format in MPS. The desqueezed field of view is 5782 pixels wide — that's the magic of anamorphic.", expression: 'happy' },
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
      { text: "That's a wrap on set for today. Last thing — I'm exporting the FDL from the Framing Calculator. Every file needs a proper header.", expression: 'neutral' },
      { text: "Fill in the version and creator. The UUID is auto-generated. This metadata travels with the FDL to Robin, Quinn, and the finishing house.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Export the FDL from the Framing Calculator. Fill in the header metadata.',
    concept: 'fdl_header',
    newConcept: 'FDL File',
    subtype: 'fillHeader',
    fields: [
      { key: 'uuid', prefill: 'urn:uuid:a1b2c3d4-...', auto: true },
      { key: 'version', options: ['1.0', '2.0', '0.1'], correct: '1.0' },
      { key: 'fdl_creator', placeholder: 'DIT name or tool', freeText: true },
    ],
    hint: 'The current FDL version is 1.0. The UUID is auto-generated. Creator identifies who made the file.',
    successDialogue: { text: "FDL exported. I'm sending it to Robin for MPS configuration and copying Quinn's team for VFX plates. Head to the VFX suite — Quinn's waiting.", expression: 'happy' },
    reveal: {
      lines: '{\n  "uuid": "urn:uuid:...",\n  "version": { "major": 1, "minor": 0 },\n  "fdl_creator": "Netflix Calculator"\n}',
      highlightKeys: ['uuid', 'version', 'fdl_creator'],
    },
    docRef: { label: 'Netflix Framing Calculator', url: 'https://production-technology-tools.netflixstudios.com/calculators' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 3: QUINN — THE VFX SUPERVISOR
  // VFX Suite — Nuke, Resolve, VFX Pulls
  // ═══════════════════════════════════════
  {
    id: 13,
    chapter: 2,
    character: 'quinn',
    background: 'vfx_suite',
    dialogue: [
      { text: "Morgan's FDL just landed on our shared drive. I've got Nuke open and the comp team is waiting for plate specs.", expression: 'neutral' },
      { text: "We need 4K DCI VFX plates from the Alexa LF source. What FDL element do I use to define this output transform?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'The comp team needs 4K DCI plates. What FDL element defines the output transform for Nuke?',
    concept: 'canvas_template_intro',
    newConcept: 'Canvas Template',
    options: [
      { text: 'A Canvas Template \u2014 it transforms source geometry to a target canvas', correct: true },
      { text: 'A new framing intent from the DP', correct: false },
      { text: 'A separate VFX-specific FDL file', correct: false },
      { text: 'An ACES Input Device Transform (IDT)', correct: false },
    ],
    hint: 'Canvas Templates define how to map source framing geometry to a new output resolution.',
    successDialogue: { text: "Canvas Templates are how I tell the pipeline to transform Morgan's source into our Nuke-ready plates. They map source geometry to target resolution.", expression: 'happy' },
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
      { text: "I'm setting up the Nuke template for our VFX pull pipeline. Two settings in the Canvas Template are critical.", expression: 'neutral' },
      { text: "Which source layer do I fit into the target, and how much extra area do I preserve for compositing and paint work?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Configure the Nuke VFX pull: what source layer gets fitted, and what to preserve for comp?',
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
    hint: "Fit the framing decision (the DP's creative frame). Preserve the effective canvas so the comp team has extra pixels.",
    successDialogue: { text: "Fit the framing decision, preserve the effective canvas. My compositors get the DP's frame plus extra pixels for paint, roto, and sky work.", expression: 'happy' },
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
      { text: "My lead compositor in Nuke is asking about fit_all vs fill. If I get this wrong, we lose edge pixels on every sky replacement shot.", expression: 'concerned' },
      { text: "Tap each method to see what happens to the source frame in the target. This is the difference between usable plates and wasted renders.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'VFX plates for Nuke: fit_all vs fill. Tap each to see the result on the source frame.',
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
    successDialogue: { text: "For VFX plates: always fit_all. Cropped pixels are gone forever — you can't comp what you can't see. I'll set this in our Nuke template.", expression: 'happy' },
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
      { text: "The comp team needs extra pixels beyond the 2.39:1 frame for a sky replacement shot. In Nuke, they need to paint and extend beyond the visible frame.", expression: 'concerned' },
      { text: "There's an FDL Canvas Template setting that includes those extra pixels in the output. Which one?", expression: 'neutral' },
    ],
    type: 'pick',
    brief: 'Nuke compositors need extra pixels beyond the 2.39:1 frame for sky work. What FDL setting?',
    concept: 'preserve_from_source',
    newConcept: null,
    options: [
      { text: 'preserve_from_source_canvas: canvas.effective_dimensions', correct: true },
      { text: 'Increase the protection percentage to 50%', correct: false },
      { text: 'Switch the fit method from fit_all to fill', correct: false },
      { text: 'Create a separate FDL file for VFX', correct: false },
    ],
    hint: 'preserve_from_source_canvas includes additional pixel area from a larger source layer in the output.',
    successDialogue: { text: "preserve_from_source_canvas gives us pixels beyond the frame boundary. The Nuke compositors can paint, roto, and extend without running out of image.", expression: 'happy' },
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
      { text: "I'm configuring the Nuke Reformat node for our VFX pull. I need the scale factor to set up the transform correctly.", expression: 'neutral' },
      { text: "Source frame is 4448\u00d71862, target is 3840\u00d72160, using fit_all. Which ratio drives the scale?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "Nuke Reformat: source 4448\u00d71862, target 3840\u00d72160, fit_all. What's the scale factor?",
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
    successDialogue: { text: "0.8633 — the width ratio wins because fit_all takes the smaller of the two. I'll set this in the Nuke Reformat node and lock the template.", expression: 'happy' },
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
      { text: "The comp lead just messaged me — the EXR plates from last night's batch render are cropped. Pixels are missing from the edges.", expression: 'concerned' },
      { text: "Something is wrong with the Nuke template config. I need to diagnose it before we waste another night of render farm time.", expression: 'concerned' },
    ],
    type: 'fix',
    brief: 'Nuke EXR plates are cropped \u2014 pixels missing from edges. Diagnose the template config.',
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
    successDialogue: { text: "Found it — someone set fill instead of fit_all in the Nuke template. Fill crops to fill the target, destroying pixels. I'm fixing this and re-queuing the renders.", expression: 'happy' },
    reveal: {
      lines: '// "fill" caused cropping!\n// Fix: "fit_method": "fit_all"\n//\n// fit_all \u2192 source fits entirely\n// fill \u2192 source fills target (crops)',
      highlightKeys: ['fit_method'],
    },
    docRef: { label: 'FDL Implementer Guide', url: 'https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/' },
    isChapterEnd: true,
  },

  // ═══════════════════════════════════════
  // CHAPTER 4: SAGE — THE FDL EXPERT
  // Control Room — pyfdl, JSON Validators, Spec
  // ═══════════════════════════════════════
  {
    id: 19,
    chapter: 3,
    character: 'sage',
    background: 'control_room',
    dialogue: [
      { text: "I ran Morgan's FDL through pyfdl's validator and it threw a reference error. Robin, Morgan, and Quinn have all done their part — now I need to make sure the data holds together.", expression: 'neutral' },
      { text: "Look at this JSON output. The validator flagged a broken reference. Can you spot it?", expression: 'concerned' },
    ],
    type: 'fix',
    brief: 'pyfdl validator flagged a reference error. Find the broken reference in the JSON.',
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
    successDialogue: { text: "The context references 'VENICE_FF' but the canvas is 'VENICE_FF_6K'. pyfdl catches this because IDs must be exact string matches. No fuzzy matching.", expression: 'happy' },
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
      { text: "Another FDL from a different show. pyfdl's validator passed it, but when Quinn's Nuke template tried to resolve the framing_intent_id, it failed silently.", expression: 'neutral' },
      { text: "Look carefully at the IDs. Sometimes validators can't catch what a human eye can.", expression: 'neutral' },
    ],
    type: 'fix',
    brief: 'Nuke template failed to resolve framing_intent_id. Find the subtle ID error.',
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
    successDialogue: { text: "239 became 293 — transposed digits. This is why I always run pyfdl validation AND manually inspect the JSON. Typos like this break entire Nuke pipelines.", expression: 'happy' },
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
      { text: "Let me walk you through the 8-phase template pipeline. This is what pyfdl, the Framing Calculator, and every conforming implementation must follow.", expression: 'neutral' },
      { text: "The first five phases: Derive, Populate, Fill Gaps, Scale Factor, then Normalize/Scale/Round.", expression: 'neutral' },
      { text: "What comes next? Quinn's Nuke template depends on getting this right.", expression: 'neutral' },
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
    successDialogue: { text: "Output Size & Alignment, then Apply Offsets, then Crop to Visible. Eight phases, in order. pyfdl implements this exact sequence — and so must any tool that processes FDL.", expression: 'happy' },
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
      { text: "Phase 5 involves rounding. After scaling in pyfdl, we get fractional pixel values. Nuke and Resolve can't render half-pixels.", expression: 'neutral' },
      { text: "1862 \u00d7 0.8633 = 1607.7 pixels. The FDL spec says: round to even, round up. What's the answer?", expression: 'neutral' },
    ],
    type: 'frame',
    brief: "pyfdl scaling: 1862 \u00d7 0.8633 = 1607.7. Round to even, up. What's the result?",
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
    successDialogue: { text: "1608. Must be even (divisible by 2) and we round up. 1607 is odd, next even up is 1608. This matters for Nuke Reformat nodes and Resolve timeline resolution.", expression: 'happy' },
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
      { text: "Phase 6: alignment. The scaled frame is 3840\u00d71608 and needs to sit inside a 3840\u00d72160 delivery container for the finishing house.", expression: 'neutral' },
      { text: "In Resolve, this determines where the letterbox sits. Try center/center first, then right/bottom.", expression: 'neutral' },
    ],
    type: 'frame',
    brief: 'Resolve delivery: scaled frame 3840\u00d71608 in 3840\u00d72160 container. Align it.',
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
    successDialogue: { text: "Center/center is the standard for most deliveries. The finishing house in Resolve will match this alignment in their timeline. Sometimes specific placement is needed for VFX.", expression: 'happy' },
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
      { text: "One final puzzle. Quinn's Nuke output shows a protection area in the rendered EXRs, but the source FDL from Morgan never defined one.", expression: 'concerned' },
      { text: "This should never happen. Something in the pipeline is auto-generating data that doesn't exist. What went wrong?", expression: 'concerned' },
    ],
    type: 'fix',
    brief: "Nuke output shows protection, but Morgan's FDL never defined it. What's wrong?",
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
    successDialogue: { text: "Protection is sacred — NEVER auto-filled. If Morgan's FDL didn't define it, the output must show zero. This is a pipeline bug in the Nuke template that needs fixing immediately.", expression: 'happy' },
    reveal: {
      lines: '// Protection is NEVER auto-filled.\n// If not defined in the source FDL,\n// it stays ZERO in the output.\n//\n// This is a pipeline bug \u2014 protection\n// must come from the original FDL.',
      highlightKeys: ['protection'],
    },
    docRef: { label: 'ASC FDL Spec', url: 'https://github.com/ascmitc/fdl' },
    isChapterEnd: true,
    isGameEnd: true,
  },
];
