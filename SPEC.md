# FRAME IT — The ASC FDL Learning Game

## Spec for a Coding Agent

---

## PHILOSOPHY: DUOLINGO, NOT A TEXTBOOK

This game teaches the ASC Framing Decision List from four production perspectives — Post Supervisor, DIT, VFX Supervisor, and FDL Expert. Tiny bites, instant feedback, one concept at a time, dopamine on every correct answer. Every scenario is grounded in real production workflows, referencing Netflix MPS (Media Production Suite) specs and tools.

**Design Axioms:**
1. Every level takes 15-45 seconds to complete
2. You learn by DOING, never by reading walls of text
3. One new idea per level — never two
4. Show the visual FIRST, reveal the JSON AFTER (reward, not homework)
5. If the player is stuck for more than 10 seconds, help them immediately
6. Celebrate every correct answer like they just won an Oscar

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

The ASC recommends four nested rectangles, from outermost to innermost:
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

When fitting a Framing Intent into a Canvas (centered):
- If the intent aspect ratio is wider than the canvas: use full width, calculate height = width / AR, center vertically
- If narrower: use full height, calculate width = height × AR, center horizontally
- Anchor point is measured from top-left: x = (canvas_w - frame_w) / 2, y = (canvas_h - frame_h) / 2
- Round dimensions to nearest even integer (industry convention)

### Real Camera Data to Use

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

The game references Netflix MPS (Media Production Suite) workflow concepts:

- **Rule of Defaults:** If no FDL is provided, MPS delivers full source dimensions scaled to the delivery container
- **Camera Formats:** A unique combo of lens squeeze, resolution, codec, camera model, and camera letter
- **FDL in MPS:** The only way to attach framing decisions in the Netflix database
- **Workflow order:** Project Setup → Camera Format Config → FDL Creation → Footage Ingest

Reference: [Netflix MPS Technical Specifications](https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115)
Tool: [Netflix Framing & Resolution Calculator](https://production-technology-tools.netflixstudios.com/calculators)

---

## GAME DESIGN

### Role-Based Learning

The game is organized around four production roles. Each zone teaches FDL from a specific perspective, with scenarios grounded in real workflow decisions.

### The Loop (every level)

```
1. BRIEF ────── One sentence of production context + a "NEW CONCEPT" chip if applicable
2. DO ─────────  Interact: drag frame, tap answer, fill in a value, connect cards to slots
3. REVEAL ───── Show/highlight the FDL JSON or workflow insight
4. REWARD ───── Streak counter + progress bar nudge
5. NEXT ─────── Advance to next level or complete zone
```

### Level Types (only three)

**TYPE A: "Frame It"** (visual → JSON)
Player drags/resizes a frame line on a canvas, connects cards to slots, fills in values, configures pipeline options, or sets anamorphic squeeze. On success, the corresponding JSON is revealed. ~60% of levels.

Subtypes: default drag, connect, fillHeader, pickDefault, layerSelect, sideBySide, scaleFactor, roundingPick, alignment, anamorphic, pipelineConfig.

**TYPE B: "Fix It"** (spot the error)
Player sees broken JSON or a misconfigured canvas, plus 2-4 tappable options for what's wrong. ~20% of levels.

**TYPE C: "Pick It"** (concept check)
A quick multiple-choice question. Never more than 4 options. Used to anchor concepts. ~20% of levels.

---

## PROGRESSION: 24 LEVELS, 4 ZONES — NON-LINEAR

The game opens to a **constellation-style zone picker** showing all 4 zones and 24 levels. The player's first action is choosing where to begin. All zones and levels are visible and tappable from the start — no gating.

Each zone represents a production role. Six levels per zone. Every level should be completable in under 45 seconds. Total game time: ~12-16 minutes.

### ZONE 1: "THE POST SUPERVISOR" (Levels 1-6)

**What you learn:** When and why to use FDL, the MPS Rule of Defaults, Camera Format setup, and workflow coordination.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 1 | C | No FDL was provided to MPS. What does it deliver? | Rule of Defaults: full source scaled to container |
| 2 | C | Mid-shoot, B-cam switches to anamorphic. What triggers a new Camera Format? | Camera Format = unique combo of 5 attributes |
| 3 | C | DP shot 2.39:1 but no FDL. What does UHD delivery look like? | Visual consequence of missing FDL |
| 4 | A | Match each role to their FDL responsibility | DIT creates, Post Sup configures, VFX consumes |
| 5 | A | Put the MPS workflow in correct order | Project Setup → Camera Format → FDL → Ingest |
| 6 | C | 3 cameras with different setups. How many Camera Formats? | Counting distinct format combos |

**Zone 1 reward:** "📋 You know when and why to use FDL!"

### ZONE 2: "THE DIT" (Levels 7-12)

**What you learn:** Building an FDL on set — sensor setup, framing decisions, protection, multi-camera contexts, anamorphic squeeze, and FDL file metadata.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 7 | A | Define Camera Format: set the Alexa LF sensor 4448×3096 | Canvas = physical sensor |
| 8 | A | DP says "2.39 scope." Frame it within the sensor | Framing Decision from DP intent |
| 9 | A | DP wants 5% protection for stabilization | Protection zone calculation |
| 10 | A | B-cam Sony Venice 2, same intent. Build both contexts | Multi-camera FDL with shared intent |
| 11 | A | B-cam switches to anamorphic 1.3× squeeze | Anamorphic desqueeze |
| 12 | A | Fill in the FDL header: version, creator | FDL file metadata |

**Zone 2 reward:** "🎬 You can build an FDL from set!"

### ZONE 3: "THE VFX SUPERVISOR" (Levels 13-18)

**What you learn:** Canvas Templates, fit methods, VFX pull configuration, preserve_from_source_canvas, scale factors, and diagnosing downstream issues.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 13 | C | VFX needs 4K DCI plates. What FDL element defines the output? | Canvas Template introduction |
| 14 | A | Configure the VFX pull: fit_source and preserve | Pipeline configuration |
| 15 | A | fit_all vs fill: tap each to see the result | Fit methods for VFX |
| 16 | C | VFX needs extra pixels for sky replacements. What setting? | preserve_from_source_canvas |
| 17 | A | Calculate the scale factor for a VFX pull | Scale factor math |
| 18 | B | VFX plates arrived cropped. Diagnose the config error | fill vs fit_all diagnosis |

**Zone 3 reward:** "🎞️ You understand FDL for VFX plates!"

### ZONE 4: "THE FDL EXPERT" (Levels 19-24)

**What you learn:** FDL validation, the 8-phase template pipeline, rounding rules, alignment, and troubleshooting sacred rules.

| # | Type | Scenario | Key Concept |
|---|------|----------|-------------|
| 19 | B | This FDL has a broken canvas_id reference | ID reference mismatch |
| 20 | B | The framing_intent_id has a subtle typo | Reference integrity |
| 21 | C | 8-phase pipeline: what comes after Scale and Round? | Pipeline phase ordering |
| 22 | A | 1862 × 0.8633 = 1607.7. Round to even, up | Rounding rules |
| 23 | A | Scaled frame 3840×1608 in 3840×2160 container. Align it | Alignment methods |
| 24 | B | Protection appears in output but was never defined. Why? | Protection is never auto-filled |

**Zone 4 reward:** "🏆 FDL EXPERT — You can troubleshoot the entire pipeline!"

---

## VISUAL DESIGN

### Aesthetic: "Elevated Cinema Monitor"

This should feel like a sleek, premium cinema tool — not a toy, not a textbook. The design uses glassmorphism (frosted glass panels with `backdrop-filter: blur`), rich gradients, and subtle depth cues to create a refined, immersive atmosphere.

- **Background:** Radial gradient from dark blue-black center to deeper edges (`#131922` → `#0D1117` → `#080B10`), with a very subtle SVG noise texture overlay at 3% opacity for film-grain character
- **Glass cards:** All content panels, option pills, and overlays use frosted glass treatment (`rgba(22, 30, 44, 0.65)` background, `backdrop-filter: blur(20px)`, subtle `rgba(255,255,255,0.06)` borders, 16px border-radius)
- **Canvas areas:** Dark charcoal (`#1C2333`) with gradient borders (top edge subtler than bottom), inner shadow (`inset 0 2px 8px rgba(0,0,0,0.3)`), 8px border-radius
- **Frame lines:**
  - Target/guide: dashed, dim (`#4A5568` at 40% opacity)
  - Player's frame: solid, warm amber (`#EDAB68`)
  - Protection: solid, cyan (`#4FD1C5`)
  - Correct/success: bright green (`#68D391`)
  - Error: warm red (`#FC8181`)
- **Text:** Off-white (`#E2E8F0`), secondary (`#A0AEC0`), with subtle text-shadow on active elements
- **Accent / buttons:** Warm amber gradient (`#EDAB68` → `#D4944E`) with inner highlight and box-shadow glow
- **JSON syntax highlighting:** Keys in cyan, strings in green, numbers in amber, brackets in gray — rendered in glass card panels
- **Progress bar:** Amber gradient fill with a glow effect on the leading edge
- **Zone dots:** Active dot has drop-shadow glow; completed dots have subtle green glow

### Typography

Load from Google Fonts CDN:
- **UI / body:** `"IBM Plex Sans"` — clean, professional, legible
- **JSON / code / numbers:** `"JetBrains Mono"` — distinctive monospace
- **Level brief text:** IBM Plex Sans at slightly larger size, medium weight

### Layout: Phone-First, One Column

The ENTIRE game fits in a single scrollable column. No side panels, no split views.

**Zone Picker Landing Screen (first launch — no close button):**

```
┌─────────────────────────┐
│  Frame It               │  ← Title with amber text-glow
│  The ASC FDL Game       │  ← Subtitle
│                         │
│   📋 Post Sup   🎬 DIT  │
│    ╭─╮ ╭─╮    ╭─╮ ╭─╮  │  ← 4 role-based zone clusters
│    ╰─╯ ╰─╯    ╰─╯ ╰─╯  │     with production workflow
│    ╭─╮ ╭─╮    ╭─╮ ╭─╮  │     connectors between them
│    ╰─╯ ╰─╯    ╰─╯ ╰─╯  │
│                         │
│   🎞️ VFX Sup  🏆 Expert │
│    ╭─╮ ╭─╮    ╭─╮ ╭─╮  │
│    ╰─╯ ╰─╯    ╰─╯ ╰─╯  │
│    ╭─╮ ╭─╮    ╭─╮ ╭─╮  │
│    ╰─╯ ╰─╯    ╰─╯ ╰─╯  │
│                         │
│    Tap any level        │  ← Bottom prompt
│    to begin             │
└─────────────────────────┘
```

**In-Zone Play (when playing a level):**

```
┌─────────────────────────┐
│  ●●●●  Zone Name   🔥5 │  ← 4 zone dots, streak
│  ████████░░░░░░         │  ← Gradient progress bar
│                         │
│ ┌─── glass card ──────┐ │
│ │ Level 3 of 24       │ │  ← Level number, zone name
│ │ NEW: Rule of Defaults│ │  ← Concept chip
│ │ "No FDL was..."     │ │  ← Brief (production scenario)
│ │                     │ │
│ │ [Option pills or    │ │
│ │  canvas or connect  │ │  ← Interaction area
│ │  interface]         │ │
│ └─────────────────────┘ │
│                         │
│  [ NEXT → ]             │
└─────────────────────────┘
```

### Micro-Animations (CSS only, keep it fast)

- **Frame snapping:** When within 8% tolerance of correct position, the frame magnetically snaps with a `0.25s ease-out` transition
- **Correct answer:** Canvas border flashes green. ✓ fades in with text-shadow glow. JSON reveal slides up.
- **Wrong answer:** Brief red shake on the canvas or option pill.
- **Zone completion:** Glass card with bounce-in animation.
- **Streak counter:** Numbers tick up with a slight scale bounce and amber text-shadow glow.
- **Progress bar:** Smooth width transition between levels with glow on the leading edge.

### Key UI Elements

**Zone Dots (always visible at top):**
Four dots in a row. Filled green = completed zone. Amber = partially completed or current. Dark gray = untouched. Tapping opens the zone picker overlay.

**Zone Picker (Landing Screen / Overlay):**
A full-screen constellation-style map with 4 zone clusters (one per role), connected by dashed "PRODUCTION WORKFLOW" lines. Each zone has 6 level nodes in organic cluster patterns connected by curved Bezier paths. Completed nodes glow green; current node pulses amber.

**Streak Counter (top right):**
"🔥 7" — counts consecutive correct answers. Resets on wrong answer.

**Hint Button:**
"💡 Need a hint?" — appears after 10 seconds on a level. No penalty.

**JSON Reveal Panel:**
After every correct answer, shows ONLY the relevant JSON or workflow insight. Keep it bite-sized.

---

## INTERACTION DETAILS

### "Frame It" (Type A) Interactions

**Dragging a frame:**
- Absolutely positioned div with colored border inside a canvas container
- Touch/mouse drag via `onPointerDown` / `onPointerMove` / `onPointerUp`
- Snap threshold: 8% of canvas dimension on each edge
- Live pixel value readout below the canvas

**Connecting / wiring:**
- Cards with labels. Player taps a card, then taps the slot it goes into.
- Tap-to-place (not drag lines). Correct placement: card slides into slot. Wrong: card bounces back.

**Pipeline configuration:**
- Two groups of options (fit_source and preserve_from_source_canvas)
- Player selects one from each group
- Both must be correct to complete

**Anamorphic:**
- Slider from 1.0× to 2.0× with live desqueeze visualization
- Snap to correct value

**Scale factor, rounding, alignment:**
- Specialized picker UIs for each calculation step

### "Fix It" (Type B) Interactions

- Shows broken JSON or misconfigured canvas
- 2-4 tappable option pills
- Tap correct → green highlight, advance
- Tap wrong → red flash, pill disabled

### "Pick It" (Type C) Interactions

- Question + 4 option pills (no canvas visual)
- Same interaction as Fix It options

---

## STATE MANAGEMENT

Use React `useState`. Keep it dead simple.

```javascript
const [currentLevel, setCurrentLevel] = useState(1);          // 1-24
const [streak, setStreak] = useState(0);                      // consecutive correct
const [completedLevels, setCompletedLevels] = useState(new Set());
const [showReveal, setShowReveal] = useState(false);          // JSON reveal visible
const [hintVisible, setHintVisible] = useState(false);
const [showZonePicker, setShowZonePicker] = useState(true);   // zone picker open on launch
const [hasStarted, setHasStarted] = useState(false);          // true after first level selected
```

All 4 zones and 24 levels are always accessible via the zone picker overlay. Per-zone progress is derived from `completedLevels`. Game completion triggers when all 24 levels are in `completedLevels`, regardless of order.

**No localStorage, no sessionStorage.** State lives in React memory only.

---

## LEVEL DATA STRUCTURE

Every level is a compact object. All 24 are defined in a `LEVELS` array in `src/levels.js`.

```javascript
const LEVELS = [
  {
    id: 1,
    zone: 1,
    type: "pick",
    brief: "No FDL was provided to MPS. What framing does it deliver?",
    concept: "rule_of_defaults",
    newConcept: "Rule of Defaults",
    options: [
      { text: "Full source dimensions, scaled to the delivery container", correct: true },
      { text: "A 2.39:1 extraction matching the DP's intended framing", correct: false },
      // ...
    ],
    hint: "Without an FDL, MPS assumes the full source resolution IS the framing intent.",
    reveal: {
      lines: "// MPS Rule of Defaults:\n// No FDL → full source dimensions\n// scaled into delivery container.",
      highlightKeys: []
    }
  },
  // ... etc for all 24 levels
];
```

---

## IMPLEMENTATION NOTES

### Tech

- **React** with component-per-level-type architecture
- **Vite** for build
- **Tailwind CSS** for styling
- Load `IBM Plex Sans` and `JetBrains Mono` from Google Fonts CDN
- Level data in `src/levels.js`, components in `src/components/`

### Component Structure

```
src/
  App.jsx              — Main game state and routing
  levels.js            — All 24 levels + zone metadata + utility functions
  components/
    Canvas.jsx         — Canvas/geometry visualization
    FrameLevel.jsx     — All frame subtypes (drag, connect, fillHeader, etc.)
    FixLevel.jsx       — Fix/bug-finding levels
    PickLevel.jsx      — Multiple-choice levels
    ZonePicker.jsx     — Constellation-style zone/level selector
    ZoneComplete.jsx   — Zone completion overlay
    GameComplete.jsx   — Game completion overlay
    AboutOverlay.jsx   — About + resource links
    JsonReveal.jsx     — JSON reveal after correct answer
```

### Canvas Rendering

Use HTML `<div>` elements, NOT `<canvas>`:
- Outer div with `aspect-ratio` CSS matching the camera's ratio
- Inner divs as absolutely positioned frame lines with colored borders
- Pointer events for drag interactions
- Pixel value readout below the canvas

### Responsive

- Works on phone (360px+), tablet, desktop
- Canvas visualization scales to fit container width
- Touch targets minimum 44×44px

---

## WHAT SUCCESS LOOKS LIKE

A filmmaker picks up the game and selects the zone that matches their role:

- **Post Supervisor** plays Zone 1 and understands when to request an FDL, what happens without one (MPS Rule of Defaults), how Camera Formats work, and who's responsible for each part of the workflow.

- **DIT** plays Zone 2 and can set up a canvas from real camera specs, create framing decisions from the DP's intent, add protection, build multi-camera FDLs, handle anamorphic lenses, and fill in FDL metadata.

- **VFX Supervisor** plays Zone 3 and understands Canvas Templates, fit_source configuration, fit_all vs fill for VFX plates, preserve_from_source_canvas for extra compositing pixels, scale factor calculation, and how to diagnose cropped plate issues.

- **FDL Expert** plays Zone 4 and can validate FDL reference integrity, understands the 8-phase template pipeline, knows the rounding and alignment rules, and can troubleshoot sacred rules like protection never being auto-filled.

They didn't read a spec. They played a game for 15 minutes, and now they GET IT — from their specific perspective.

---

## RESOURCE LINKS

Include these in an "About" overlay accessible from a small "ℹ️" button:

- **ASC FDL Spec & Docs:** https://github.com/ascmitc/fdl
- **FDL Template Implementer Guide:** https://ascmitc.github.io/fdl/dev/FDL_Template_Implementer_Guide/
- **ASC FDL Official Page:** https://theasc.com/society/ascmitc/asc-framing-decision-list
- **Netflix MPS Technical Specifications:** https://partnerhelp.netflixstudios.com/hc/en-us/articles/48547314676115
- **Netflix Framing & Resolution Calculator:** https://production-technology-tools.netflixstudios.com/calculators
- **pyfdl Python Toolkit:** https://apetrynet.github.io/pyfdl/

---

*Build it simple. Build it fast. Make every tap feel good.*
