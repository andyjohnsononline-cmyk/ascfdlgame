# FRAME IT — The FDL Adventure

## Spec for a Coding Agent

---

## PHILOSOPHY: VISUAL NOVEL ADVENTURE MEETS EDUCATION

This game teaches the ASC Framing Decision List through a narrative adventure where four production characters — Robin, Morgan, Quinn, and Sage — must work together to save a production from a broken FDL pipeline. Each character represents a production role, and their chapter teaches FDL from that specific perspective.

The visual aesthetic is inspired by Stardew Valley: pixel-art character portraits, warm earth-tone palettes, chunky RPG-style UI panels, and typewriter dialogue. The game is a visual novel with embedded interactive puzzles.

**Design Axioms:**
1. Every scene takes 15-45 seconds to complete
2. You learn by DOING, wrapped in story — not reading walls of text
3. One new idea per scene — never two
4. Characters explain concepts through dialogue, then challenge the player
5. If the player is stuck for more than 10 seconds, help them immediately
6. Celebrate every correct answer with character reactions

---

## WHAT IS ASC FDL (for the coding agent)

The ASC Framing Decision List is a JSON file used in film/TV production to communicate how a shot should be framed. It solves the problem of a cinematographer choosing a creative frame on set (e.g., "2.39:1 widescreen") and ensuring that every downstream department — dailies, editorial, VFX, finishing — reproduces that exact frame correctly, even across different cameras with different sensor sizes.

The core mental model has only four concepts:

```
CANVAS ──────────── The pixel grid (camera sensor or output resolution)
FRAMING INTENT ──── The creative goal (aspect ratio + optional safety margin)
FRAMING DECISION ── The math result (where exactly the frame sits inside the canvas)
CONTEXT ─────────── The glue (ties a canvas to its framing decisions)
```

An FDL file collects these into a single JSON document with a uuid, version, and references between objects by ID.

### Key Relationships

- A **Canvas** is concrete — it's a specific set of pixel dimensions (e.g., ARRI Alexa LF at 4448×3096)
- A **Framing Intent** is abstract — it's the DP's wish (e.g., "2.39:1 with 5% protection"), independent of any camera
- A **Framing Decision** is the calculation — given THIS canvas and THIS intent, the frame is THIS many pixels wide, THIS many pixels tall, positioned at THIS anchor point
- A **Context** groups a canvas with its framing decisions — "on this particular canvas, here's how the framing works"
- The same Framing Intent can produce different Framing Decisions on different Canvases (different cameras), but the audience sees the same composition

### The Four Frame Lines

1. **Canvas** — full sensor / full pixel container
2. **Effective Canvas** — usable area (excluding vignette, dead pixels, etc.)
3. **Protection** — safety buffer for stabilization/reframing
4. **Framing Decision** — what the audience actually sees

### Minimal Valid FDL Structure

```json
{
  "uuid": "urn:uuid:...",
  "version": { "major": 1, "minor": 0 },
  "fdl_creator": "App Name",
  "default_framing_intent": "intent_id",
  "framing_intents": [
    {
      "id": "intent_id",
      "label": "Human Name",
      "aspect_ratio": { "width": 2.39, "height": 1 },
      "protection": 0.05
    }
  ],
  "canvases": [
    {
      "id": "canvas_id",
      "label": "Camera Name",
      "dimensions": { "width": 4448, "height": 3096 },
      "anamorphic_squeeze": 1.0
    }
  ],
  "contexts": [
    {
      "id": "ctx_id",
      "label": "Context Label",
      "context_creator": "App Name",
      "canvas_id": "canvas_id",
      "framing_decisions": [
        {
          "id": "fd_id",
          "label": "Decision Label",
          "framing_intent_id": "intent_id",
          "dimensions": { "width": 4448, "height": 1862 },
          "anchor_point": { "x": 0, "y": 617 }
        }
      ]
    }
  ]
}
```

### Framing Math

- If the intent aspect ratio is wider than the canvas: use full width, calculate height = width / AR, center vertically
- If narrower: use full height, calculate width = height × AR, center horizontally
- Anchor point is measured from top-left: x = (canvas_w - frame_w) / 2, y = (canvas_h - frame_h) / 2
- Round dimensions to nearest even integer (industry convention)

### Real Camera Data

```
ARRI Alexa LF Open Gate:  4448 × 3096
ARRI Alexa 35 Open Gate:  4608 × 3164
Sony Venice Full Frame:   6054 × 3192
RED Komodo 6K:            6144 × 3240
```

### Common Aspect Ratios

```
1.33:1  — Academy 4:3
1.78:1  — 16:9 (HD/UHD)
1.85:1  — Flat (theatrical)
2.00:1  — Univisium (Netflix 2:1)
2.39:1  — Scope (anamorphic theatrical)
```

### Netflix MPS Integration

- **Rule of Defaults:** If no FDL is provided, MPS delivers full source dimensions scaled to the delivery container
- **Camera Formats:** A unique combo of lens squeeze, resolution, codec, camera model, and camera letter
- **FDL in MPS:** The only way to attach framing decisions in the Netflix database
- **Workflow order:** Project Setup → Camera Format Config → FDL Creation → Footage Ingest

---

## GAME DESIGN

### Narrative Premise

A film production is in crisis. Footage is being delivered with wrong framing — the DP's creative intent is being lost. Four characters, each representing a different production role, must work together to fix the FDL pipeline and save the show.

The player visits each character in their location, learning FDL concepts through dialogue and interactive challenges. All four characters must "do their part" for the production to succeed.

### Characters

| Character | Role | Location | Personality | Teaches |
|-----------|------|----------|-------------|---------|
| **Robin** | Post Supervisor | Production Office | Organized, methodical | When/why to use FDL, MPS defaults, Camera Formats, workflow |
| **Morgan** | DIT | On Set | Hands-on, tech-savvy | Building FDL: sensor, framing, protection, multi-camera, anamorphic |
| **Quinn** | VFX Supervisor | VFX Suite | Detail-oriented, visual | Canvas Templates, fit methods, VFX pulls, scale factors |
| **Sage** | FDL Expert | Control Room | Wise, systematic | Validation, 8-phase pipeline, rounding, alignment |

### The Scene Loop (every scene)

```
1. DIALOGUE ───── Character explains the situation (typewriter text, 2-4 lines)
2. CHALLENGE ──── Interactive moment (pick/frame/fix) — same FDL content
3. RESPONSE ───── Character reacts (correct: celebrates; wrong: encourages retry)
4. REVEAL ─────── Character explains with JSON shown in pixel-art panel
5. NEXT ────────── Advance to next scene or complete chapter
```

### Scene Types (only three)

**TYPE A: "Frame It"** (visual → JSON)
Player drags/resizes a frame line on a canvas, connects cards to slots, fills in values, configures pipeline options, or sets anamorphic squeeze. On success, the character explains and JSON is revealed. ~60% of scenes.

Subtypes: default drag, connect, fillHeader, pickDefault, layerSelect, sideBySide, scaleFactor, roundingPick, alignment, anamorphic, pipelineConfig.

**TYPE B: "Fix It"** (spot the error)
Character presents broken JSON or a misconfigured canvas, plus 2-4 tappable options for what's wrong. ~20% of scenes.

**TYPE C: "Pick It"** (concept check)
Character asks a question through dialogue, options appear as choices. ~20% of scenes.

---

## PROGRESSION: 24 SCENES, 4 CHAPTERS — NON-LINEAR

The game opens to a **pixel-art chapter select** showing all 4 characters and their locations. The player's first action is choosing which character to visit. All chapters are accessible from the start — no gating.

Each chapter has 6 scenes. Every scene should be completable in under 45 seconds. Total game time: ~12-16 minutes.

### CHAPTER 1: ROBIN — THE POST SUPERVISOR (Scenes 1-6)

**Location:** The Production Office
**What you learn:** When and why to use FDL, the MPS Rule of Defaults, Camera Format setup, and workflow coordination.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 1 | C | No FDL was provided to MPS. What does it deliver? | Rule of Defaults |
| 2 | C | Mid-shoot, B-cam switches to anamorphic. What triggers a new Camera Format? | Camera Format |
| 3 | C | DP shot 2.39:1 but no FDL. What does UHD delivery look like? | Missing FDL consequence |
| 4 | A | Match each role to their FDL responsibility | FDL roles: DIT creates, Post Sup configures, VFX consumes |
| 5 | A | Put the MPS workflow in correct order | MPS Workflow |
| 6 | C | 3 cameras with different setups. How many Camera Formats? | Camera Format counting |

**Chapter reward:** Robin: "You understand the foundation now. Go help the others!"

### CHAPTER 2: MORGAN — THE DIT (Scenes 7-12)

**Location:** On Set
**What you learn:** Building an FDL on set — sensor setup, framing decisions, protection, multi-camera contexts, anamorphic squeeze, and FDL file metadata.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 7 | A | Define Camera Format: set the Alexa LF sensor 4448×3096 | Canvas = physical sensor |
| 8 | A | DP says "2.39 scope." Frame it within the sensor | Framing Decision |
| 9 | A | DP wants 5% protection for stabilization | Protection zone |
| 10 | A | B-cam Sony Venice 2, same intent. Build both contexts | Multi-camera Context |
| 11 | A | B-cam switches to anamorphic 1.3× squeeze | Anamorphic desqueeze |
| 12 | A | Fill in the FDL header: version, creator | FDL file metadata |

**Chapter reward:** Morgan: "You can build an FDL from scratch! The DP will be impressed."

### CHAPTER 3: QUINN — THE VFX SUPERVISOR (Scenes 13-18)

**Location:** The VFX Suite
**What you learn:** Canvas Templates, fit methods, VFX pull configuration, preserve_from_source_canvas, scale factors, and diagnosing downstream issues.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 13 | C | VFX needs 4K DCI plates. What FDL element defines the output? | Canvas Template |
| 14 | A | Configure the VFX pull: fit_source and preserve | Pipeline configuration |
| 15 | A | fit_all vs fill: tap each to see the result | Fit methods |
| 16 | C | VFX needs extra pixels for sky replacements. What setting? | preserve_from_source_canvas |
| 17 | A | Calculate the scale factor for a VFX pull | Scale factor math |
| 18 | B | VFX plates arrived cropped. Diagnose the config error | fill vs fit_all diagnosis |

**Chapter reward:** Quinn: "Finally, someone who gets VFX plates right."

### CHAPTER 4: SAGE — THE FDL EXPERT (Scenes 19-24)

**Location:** The Control Room
**What you learn:** FDL validation, the 8-phase template pipeline, rounding rules, alignment, and troubleshooting sacred rules.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 19 | B | This FDL has a broken canvas_id reference | Reference integrity |
| 20 | B | The framing_intent_id has a subtle typo | ID validation |
| 21 | C | 8-phase pipeline: what comes after Scale and Round? | Pipeline phases |
| 22 | A | 1862 × 0.8633 = 1607.7. Round to even, up | Rounding rules |
| 23 | A | Scaled frame 3840×1608 in 3840×2160 container. Align it | Alignment methods |
| 24 | B | Protection appears in output but was never defined. Why? | Protection is never auto-filled |

**Chapter reward:** Sage: "You've mastered the pipeline. The production is saved."

---

## VISUAL DESIGN

### Aesthetic: Stardew Valley-Inspired Pixel Art

The game should feel like a cozy, warm RPG — inviting and approachable, not clinical. Pixel-art characters, earthy color palette, chunky UI borders, and RPG-style dialogue boxes create an adventure game atmosphere while teaching technical content.

- **Background:** Green meadow gradient (`#2a4a1e` → `#1a3012`) with subtle pixel-grid overlay
- **UI panels:** Warm parchment (`#f0d9b5`) with 4px solid wood borders (`#8b5e3c`), inset highlights, drop shadows
- **Dark panels:** Dark earth (`#3d3225`) with brown borders for scene briefs, JSON reveals
- **Dialogue box:** Dark wood panel at bottom of screen, character portrait on left, typewriter text
- **Character portraits:** SVG pixel-art (10×12 grid, scaled up) with expression variants (neutral, happy, concerned)
- **Scene backgrounds:** CSS gradient + positioned elements representing 4 locations (office, set, VFX suite, control room)
- **Frame lines:**
  - Target/guide: dashed, muted brown (`#6b5a4e` at 40% opacity)
  - Player's frame: solid, golden amber (`#e8a94f`)
  - Protection: solid, sky blue (`#5ba3c9`)
  - Correct/success: leaf green (`#5b8c3e`)
  - Error: berry red (`#c85a5a`)
- **Text:** Dark brown (`#3d2b1f`) on light panels, cream (`#f5f0e1`) on dark panels
- **Buttons:** Golden amber gradient with wood border, pixel-style hover/press states
- **JSON syntax:** Keys green, strings amber, numbers blue, brackets brown

### Typography

Load from Google Fonts CDN:
- **Pixel / headers / UI chrome:** `"Press Start 2P"` — authentic pixel-art feel
- **Body / dialogue text:** `"IBM Plex Sans"` — clean, readable for longer text
- **JSON / code / numbers:** `"JetBrains Mono"` — distinctive monospace

### Layout: Phone-First, One Column

The entire game fits in a single column. No side panels, no split views.

**Chapter Select (first launch):**

```
┌─────────────────────────┐
│     FRAME IT            │  ← Pixel font, golden text
│   THE FDL ADVENTURE     │
│                         │
│  ┌──────┐  ┌──────┐    │
│  │Robin │  │Morgan│    │  ← 4 character cards with
│  │Office│  │Set   │    │     pixel-art portraits,
│  │ 0/6  │  │ 0/6  │    │     location names,
│  └──────┘  └──────┘    │     progress bars
│  ┌──────┐  ┌──────┐    │
│  │Quinn │  │ Sage │    │
│  │VFX   │  │Ctrl  │    │
│  │ 0/6  │  │ 0/6  │    │
│  └──────┘  └──────┘    │
│                         │
│  Choose a character...  │
└─────────────────────────┘
```

**In-Scene Play:**

```
┌─────────────────────────┐
│ [Robin's Ch]     3x 2/6 │  ← Chapter button, streak, progress
│ ████████░░░░░░          │  ← Chapter progress bar
│                         │
│  (scene background)     │
│                         │
│ ┌─── dark panel ──────┐ │
│ │ NEW: Canvas          │ │  ← Concept chip + brief
│ │ "Set the ARRI..."   │ │
│ │                     │ │
│ │ [Interaction area]  │ │  ← Canvas/options/connect UI
│ └─────────────────────┘ │
│                         │
│ ┌─── dialogue box ────┐ │
│ │[Port] MORGAN         │ │  ← Character portrait + name
│ │ "The canvas is set.  │ │  ← Typewriter text
│ │  Now let's frame..." │ │
│ └──────────────── [▼]──┘ │  ← Advance indicator
└─────────────────────────┘
```

### Micro-Animations (CSS only)

- **Typewriter text:** Characters appear one at a time in dialogue box
- **Portrait slide-in:** Character portrait slides in from left when dialogue opens
- **Dialogue box slide-up:** Box animates up from bottom of screen
- **Correct answer:** Panel border flashes green, character switches to happy expression
- **Wrong answer:** Brief red shake on the option pill
- **Chapter completion:** Pixel-panel bounce-in with character portrait
- **Streak counter:** Scale bump on increment
- **Advance indicator:** Bouncing ▼ arrow in dialogue box
- **Scene transition:** Fade between scenes

---

## STATE MANAGEMENT

Use React `useState`. Keep it dead simple.

```javascript
const [currentScene, setCurrentScene] = useState(1);          // 1-24
const [phase, setPhase] = useState('chapter-select');         // chapter-select | dialogue | challenge | response | reveal
const [dialogueIndex, setDialogueIndex] = useState(0);       // current line in dialogue array
const [streak, setStreak] = useState(0);                      // consecutive correct
const [completedScenes, setCompletedScenes] = useState(new Set());
const [showReveal, setShowReveal] = useState(false);
const [hintVisible, setHintVisible] = useState(false);
```

All 4 chapters and 24 scenes are always accessible via the chapter select. Per-chapter progress is derived from `completedScenes`. Game completion triggers when all 24 scenes are in `completedScenes`.

**No localStorage, no sessionStorage.** State lives in React memory only.

---

## SCENE DATA STRUCTURE

Every scene wraps the original level data with narrative dialogue. All 24 are defined in a `SCENES` array in `src/scenes.js`.

```javascript
const SCENES = [
  {
    id: 1,
    chapter: 0,
    character: 'robin',
    background: 'production_office',
    dialogue: [
      { text: "Welcome to the production office...", expression: 'neutral' },
      { text: "We've got a big problem...", expression: 'concerned' },
    ],
    type: 'pick',
    brief: 'No FDL was provided to MPS. What framing does it deliver?',
    concept: 'rule_of_defaults',
    newConcept: 'Rule of Defaults',
    options: [
      { text: 'Full source dimensions, scaled to the delivery container', correct: true },
      // ...
    ],
    hint: 'Without an FDL, MPS assumes the full source resolution IS the framing intent.',
    successDialogue: { text: "Exactly! That's the Rule of Defaults...", expression: 'happy' },
    reveal: {
      lines: '// MPS Rule of Defaults:\n// No FDL → full source dimensions...',
      highlightKeys: [],
    },
  },
  // ... all 24 scenes
];
```

---

## IMPLEMENTATION NOTES

### Tech

- **React 19** with component-per-scene-type architecture
- **Vite 7** for build
- **Tailwind CSS 4** for styling
- Load `IBM Plex Sans`, `JetBrains Mono`, and `Press Start 2P` from Google Fonts CDN
- Scene data in `src/scenes.js`, components in `src/components/`

### Component Structure

```
src/
  App.jsx                — Narrative scene engine: phase state machine, dialogue flow
  scenes.js              — All 24 scenes + chapter metadata + utility functions
  index.css              — Tailwind + pixel-art theme + animations
  components/
    CharacterPortrait.jsx — SVG pixel-art portraits (4 characters × 3 expressions)
    SceneBackground.jsx   — CSS-based scene backgrounds (4 locations)
    DialogueBox.jsx       — RPG-style dialogue: portrait, nameplate, typewriter text
    ChapterSelect.jsx     — Pixel-art chapter/character selection screen
    Canvas.jsx            — Canvas/geometry visualization (pixel-art styled)
    FrameLevel.jsx        — All frame subtypes (drag, connect, fillHeader, etc.)
    FixLevel.jsx          — Fix/bug-finding levels
    PickLevel.jsx         — Multiple-choice as dialogue choices
    ZoneComplete.jsx      — Chapter completion with character dialogue
    GameComplete.jsx      — Game completion: all 4 characters together
    JsonReveal.jsx        — JSON reveal in pixel-art panel
```

### Narrative Phase Flow

```
chapter-select → dialogue → challenge → response → reveal → next scene (or chapter complete)
                    ↑                                              ↓
                    └──────────────────────────────────────────────┘
```

- **chapter-select:** Full-screen character/chapter picker
- **dialogue:** Character delivers intro lines via DialogueBox, player taps to advance
- **challenge:** Scene brief + interactive puzzle (frame/fix/pick)
- **response:** Character reacts to correct answer via DialogueBox
- **reveal:** JSON panel shown, "NEXT" button appears

### Canvas Rendering

Use HTML `<div>` elements, NOT `<canvas>`:
- Outer div with `aspect-ratio` CSS matching the camera's ratio
- Inner divs as absolutely positioned frame lines with colored borders
- Pointer events for drag interactions
- Pixel-art styled borders and earth-tone colors

### Responsive

- Works on phone (360px+), tablet, desktop
- Canvas visualization scales to fit container width
- Touch targets minimum 44×44px

---

## WHAT SUCCESS LOOKS LIKE

A filmmaker picks up the game and selects the character that matches their role:

- **Robin** (Post Supervisor) — Learns when to request an FDL, what happens without one, how Camera Formats work, and who's responsible for each part of the workflow.

- **Morgan** (DIT) — Can set up a canvas from real camera specs, create framing decisions from the DP's intent, add protection, build multi-camera FDLs, handle anamorphic lenses, and fill in FDL metadata.

- **Quinn** (VFX Supervisor) — Understands Canvas Templates, fit_source configuration, fit_all vs fill for VFX plates, preserve_from_source_canvas, scale factor calculation, and how to diagnose cropped plate issues.

- **Sage** (FDL Expert) — Can validate FDL reference integrity, understands the 8-phase template pipeline, knows the rounding and alignment rules, and can troubleshoot sacred rules like protection never being auto-filled.

They played an adventure game for 15 minutes, felt like they were helping real production characters solve real problems, and now they GET the ASC FDL — from their specific perspective.

---

## RESOURCE LINKS

Include these in the game (accessible from chapter select or end screen):

- **ASC FDL Spec & Docs:** https://github.com/ascmitc/fdl
- **FDL Template Implementer Guide:** https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/
- **ASC FDL Official Page:** https://theasc.com/society/ascmitc/asc-framing-decision-list
- **Netflix MPS Technical Specifications:** https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115
- **Netflix Framing & Resolution Calculator:** https://production-technology-tools.netflixstudios.com/calculators
- **pyfdl Python Toolkit:** https://apetrynet.github.io/pyfdl/

---

## QUALITY OF LIFE

### Progress Persistence

Progress is saved to `localStorage` automatically after each completed scene. Saved data includes `completedScenes`, `bestStreak`, and `currentScene`. On return visits, the game restores the player's progress seamlessly. A "Reset Progress" button is available at the bottom of the chapter select screen (with confirmation). This departs from the original "no localStorage" constraint — losing all progress on a page refresh was the worst QoL issue for a web game.

### Mobile Viewport & Safe Areas

- **Viewport:** `viewport-fit=cover` enables edge-to-edge rendering on notched devices
- **Safe area insets:** Body padding uses `env(safe-area-inset-*)` for iPhone notch/Dynamic Island
- **Overscroll:** `overscroll-behavior: none` prevents pull-to-refresh and rubber-banding
- **PWA-ready:** `apple-mobile-web-app-capable` and `theme-color` meta tags included

### Touch Targets

All interactive elements enforce a 44×44px minimum touch target per Apple HIG:
- Range slider thumbs: 44×44px
- Chapter dots button: wrapped with 44px minimum height hit area
- Close button: 44×44px minimum size
- All `pixel-pill` and `btn-primary` buttons already meet the minimum via padding

### Font Loading

- `Press Start 2P` (the pixel font critical to the visual identity) is preloaded via `<link rel="preload">`
- All Google Fonts load with `display=swap` to prevent invisible text (FOIT)

### Keyboard Navigation

- **Dialogue:** Enter or Space advances dialogue / completes typewriter
- **Escape:** Returns to chapter select from any scene
- **Focus rings:** Visible `focus-visible` outlines on all interactive elements (`.pixel-pill`, `.pixel-btn`, `.btn-primary`) for keyboard and assistive technology users
- All option buttons are native `<button>` elements with proper focus management

### Scene Transitions

A brief fade transition (`scene-transition` animation, 0.4s) plays between scenes when the player advances via the Next button. This replaces the previous instant cut and gives the player a sense of progression.

### Hint Timer

The 12-second hint timer starts when the player enters the **challenge** phase, not when the scene loads. This ensures the timer doesn't tick down while the player is reading dialogue.

### Resource Links

The six ASC FDL resource links from the spec are accessible in two locations:
- **Chapter select screen:** "Resources" section at the bottom
- **Game complete screen:** "Learn More" section before the Play Again button

All links open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`).

### Scrollable Overlays

The `GameComplete` and `ZoneComplete` overlay modals use `overflow-y: auto` with a flex-centered inner container, ensuring they scroll properly on small screens (e.g., iPhone SE) where the content exceeds the viewport height.

### JSON Reveal Overflow

The `JsonReveal` component uses `overflow-x: auto` to handle long JSON lines on narrow screens, preventing horizontal layout overflow.

---

*Build it warm. Build it cozy. Make every tap feel like an adventure.*
