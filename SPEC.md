# FRAME IT — The ASC FDL Learning Game

## Spec for a Coding Agent

---

## PHILOSOPHY: DUOLINGO, NOT A TEXTBOOK

This game teaches the ASC Framing Decision List the way Duolingo teaches Spanish — tiny bites, instant feedback, one concept at a time, dopamine on every correct answer. The player should be able to pick it up with zero prior knowledge and understand the entire FDL spec within 20 minutes of play.

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

---

## GAME DESIGN

### One Screen, One Mechanic: The Framing Puzzle

The entire game is ONE repeating mechanic with escalating complexity. No mode switches, no separate "quiz" screens. Just this:

> **You see a dark rectangle (the canvas). A target frame is shown as a dashed outline. You drag a bright frame line to match it. When you nail it, the JSON that describes what you just did is revealed with a satisfying animation.**

That's it. That's the whole game. The complexity comes from what the level asks you to do BEFORE or AFTER the visual puzzle.

### The Loop (every level)

```
1. BRIEF ────── One sentence of context (max 15 words) + a tiny "NEW CONCEPT" chip if applicable
2. DO ─────────  Interact: drag frame, tap answer, fill in a value
3. REVEAL ───── Show/highlight the FDL JSON that maps to what you just did
4. REWARD ───── Stars + sound + streak counter + XP bar nudge
5. NEXT ─────── Tap to advance to the next level within the zone
                 (last level in zone → Zone Complete → return to Hub)
```

### Level Types (only three)

**TYPE A: "Frame It"** (visual → JSON)
Player drags/resizes a frame line on a canvas to hit a target. On success, the corresponding JSON property is highlighted. This is the primary mechanic — ~60% of levels.

**TYPE B: "Fix It"** (spot the error)
Player sees a canvas where the frame is WRONG (visually obvious — way off center, wrong ratio, etc.) plus 2-4 tappable options for what's broken. Tap the right one. Fast and satisfying. ~25% of levels.

**TYPE C: "Pick It"** (concept check)
A quick multiple-choice or match question. Never more than 4 options. Used sparingly to anchor vocabulary. ~15% of levels.

### NO OTHER MECHANICS. Three types. That's the constraint.

---

## PROGRESSION: 36 LEVELS, 6 ZONES — NON-LINEAR

The game uses a **zone picker overlay** accessible from the zone dots or zone name in the header. All 6 zones and all 36 levels are visible and tappable from the start — no gating, no prerequisites. Players can jump to any level in any zone at any time. The default "Next" flow advances sequentially within a zone, but the picker lets the player break out at will. Progress is tracked per-level independently.

Each zone introduces ONE big concept. Six levels per zone. Every level should be completable in under 45 seconds. Total game time: ~18-22 minutes for a focused player who completes all zones.

### ZONE 1: "THE CANVAS" (Levels 1-5)

**What you learn:** A canvas is a pixel grid. It has width and height. That's the container.

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 1 | A | "This is a camera sensor. It's 4448 pixels wide." | Drag the right edge of a rectangle to match a width marker | `"dimensions": { "width": 4448 }` |
| 2 | A | "The sensor is 3096 pixels tall." | Drag the bottom edge to match a height marker | `"dimensions": { "width": 4448, "height": 3096 }` |
| 3 | C | "Which of these is a real camera resolution?" | Pick "4448 × 3096" from 4 options | Full `canvas` object shown |
| 4 | A | "Different camera: Sony Venice." | Resize a canvas to 6054 × 3192 (shown as target outline) | Second canvas object |
| 5 | C | "A Canvas in FDL represents…" | Pick "The full pixel recording area" from 4 options | Canvas definition recap |

**Zone 1 reward:** "🎬 You know what a Canvas is!" — badge animation

### ZONE 2: "THE INTENT" (Levels 6-10)

**What you learn:** A Framing Intent is the DP's creative choice — an aspect ratio. It's abstract (no pixels).

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 6 | A | "The DP wants widescreen: 2.39:1" | Canvas is shown. Drag a horizontal frame line to make it look like a 2.39 letterbox (height adjusts, width stays full) | `"aspect_ratio": { "width": 2.39, "height": 1 }` |
| 7 | A | "Now try 1.78:1 — standard HD" | Same mechanic, different ratio. Frame is much taller. | aspect_ratio for 16:9 |
| 8 | C | "Which is wider: 2.39:1 or 1.85:1?" | Tap one of two visual frame previews | Brief ratio comparison |
| 9 | A | "Match all four ratios" | Four small canvases, four labeled frames. Drag each label to the right canvas: 1.33, 1.78, 1.85, 2.39 | All four aspect_ratio objects |
| 10 | C | "A Framing Intent is…" | Pick "The DP's creative framing goal, independent of camera" from 4 options | Full framing_intent object |

**Zone 2 reward:** "🎞️ You speak the DP's language!"

### ZONE 3: "THE DECISION" (Levels 11-17)

**What you learn:** When you combine a Canvas + Framing Intent, you get a Framing Decision — actual pixel dimensions and an anchor point. This is where the math happens.

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 11 | A | "2.39:1 on a 4448×3096 sensor. Where does the frame go?" | The correct frame outline is shown faintly. Player drags the bright frame to match. It only moves vertically (width is locked to full canvas). | `"dimensions": { "width": 4448, "height": 1862 }` |
| 12 | A | "The frame is centered. What's the anchor point?" | A crosshair appears at top-left (0,0). Player drags an anchor marker to the top-left corner of the frame. Y-coordinate updates live. | `"anchor_point": { "x": 0, "y": 617 }` |
| 13 | B | "Something's wrong with this frame." | Frame is shown shoved to the top of the canvas (anchor y=0). Options: "Anchor Y is wrong" / "Width is wrong" / "Aspect ratio is wrong" / "Canvas is wrong" | Corrected anchor_point |
| 14 | A | "Now add 5% protection." | Frame decision is shown (amber). Player drags a SECOND slightly larger frame (green) around it. Protection = frame × 1.05. | `"protection": 0.05` on the intent + `protection_dimensions` on the decision |
| 15 | B | "The protection area is SMALLER than the frame. That's wrong. Why?" | Options: "Protection should be larger than the frame" / "Protection should be 0" / "Canvas is too small" / "Aspect ratio is inverted" | Corrected protection |
| 16 | A | "Same intent, different camera: Sony Venice 6054×3192." | Player frames 2.39:1 on Venice. Different pixel values, same visual result. | New framing_decision for Venice |
| 17 | C | "Two cameras, same intent. The framing decisions have…" | Pick "Different pixel values but the same aspect ratio" from 4 options | Side-by-side comparison |

**Zone 3 reward:** "📐 You can calculate framing decisions!"

### ZONE 4: "THE CONTEXT" (Levels 18-22)

**What you learn:** Contexts tie canvases to framing decisions. They're the glue. IDs reference each other.

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 18 | A | "Connect the dots: canvas → framing decision." | Three floating cards: Canvas, Framing Intent, Framing Decision. Player drags lines to connect them (intent→decision, canvas+decision→context). | `"canvas_id": "...", "framing_intent_id": "..."` |
| 19 | B | "This FDL is broken. The context references a canvas that doesn't exist." | Show the JSON with `canvas_id: "VENICE_FF"` but the canvas is named `"VENICE_FF_6K"`. Options highlight the mismatched IDs. | Corrected canvas_id |
| 20 | A | "Two cameras, one intent. Build both contexts." | Two canvases shown side by side. Player already built one context (Zone 3). Now tap to assign the correct canvas_id for a second context. | Two context objects in the FDL |
| 21 | C | "A Context in FDL represents…" | Pick "How framing works on a specific canvas" from 4 options | Context definition |
| 22 | B | "The framing_intent_id in this decision is misspelled." | Spot the typo in the JSON. Tap the broken field. | Corrected reference |

**Zone 4 reward:** "🔗 You understand how FDL connects everything!"

### ZONE 5: "THE FILE" (Levels 23-27)

**What you learn:** The top-level FDL structure — uuid, version, default_framing_intent, and how all the pieces nest together.

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 23 | A | "Every FDL file needs a header." | Player fills in three fields: uuid (auto-generated, just tap to confirm), version (pick "1.0"), fdl_creator (type anything). | Top-level FDL fields |
| 24 | A | "Set the default framing intent." | Dropdown with the intents they've built. Pick one. | `"default_framing_intent": "scope_239"` |
| 25 | A | "Assemble the full file." | All the pieces they've built across the game are shown as cards. Drag them into the correct slots in a JSON skeleton: framing_intents[], canvases[], contexts[]. | Complete FDL JSON |
| 26 | B | "This FDL has 3 bugs. Find them." | A complete ~30 line FDL with three errors: wrong version format, missing canvas_id in a context, and framing decision dimensions that don't match the intent's ratio. Tap each error. | All three fixes |
| 27 | C | "What file format is an FDL?" | Pick "JSON" from 4 options (JSON, XML, CSV, YAML). | `.fdl` file extension note |

**Zone 5 reward:** "📄 You can read and write FDL files!"

### ZONE 6: "THE PIPELINE" (Levels 28-30)

**What you learn:** Why all of this matters — the real workflow from set to screen.

| # | Type | Brief | Player Does | JSON Revealed |
|---|------|-------|-------------|---------------|
| 28 | A | "The show delivers in UHD 3840×2160. Add a delivery canvas." | Player adds a new canvas with UHD dimensions, then sees the framing decision automatically calculated for it. | Delivery canvas + context |
| 29 | A | "Final challenge: 2 cameras, 1 intent, 1 delivery. Build the whole FDL." | A mini assembly challenge. The building blocks are pre-made — player just wires them together correctly by assigning IDs. ~60 seconds. | Complete multi-camera FDL |
| 30 | C | "You get an FDL from the camera department. What does it tell you?" | Pick "Exactly how to frame the image in your application" — which is the actual purpose of the spec. | 🎬 GAME COMPLETE |

**Zone 6 reward:** Full-screen celebration. "🏆 FDL CERTIFIED — You understand the ASC Framing Decision List!" Show total stats.

---

## VISUAL DESIGN

### Aesthetic: "Dark Cinema Monitor"

This should feel like a sleek, professional film tool — not a toy, not a textbook.

- **Background:** Near-black with a very subtle blue undertone (`#0D1117`)
- **Canvas areas:** Dark charcoal (`#1C2333`) with a 1px border (`#2D3748`)
- **Frame lines:**
  - Target/guide: dashed, dim (`#4A5568` at 40% opacity)
  - Player's frame: solid, bright amber (`#F6AD55`)
  - Protection: solid, cyan (`#4FD1C5`)
  - Correct/success: bright green (`#68D391`)
  - Error: warm red (`#FC8181`)
- **Text:** Off-white (`#E2E8F0`), secondary (`#A0AEC0`)
- **Accent / buttons:** Amber (`#F6AD55`)
- **JSON syntax highlighting:** Keys in cyan, strings in green, numbers in amber, brackets in gray

### Typography

Load from Google Fonts CDN:
- **UI / body:** `"IBM Plex Sans"` — clean, professional, legible
- **JSON / code / numbers:** `"JetBrains Mono"` — distinctive monospace
- **Level brief text:** IBM Plex Sans at slightly larger size, medium weight

### Layout: Phone-First, One Column

The ENTIRE game fits in a single scrollable column. No side panels, no split views.

**Zone Picker Overlay (opened by tapping zone dots or zone name):**

```
┌─────────────────────────┐
│  Choose a Level       ✕ │
│                         │
│  🎬 The Geometry  4/6   │  ← Zone header + progress
│  [1✓][2✓][3✓][4✓][5][6]│  ← Level buttons (all tappable)
│                         │
│  🎞️ Intents      0/6   │
│  [1] [2] [3] [4] [5][6]│  ← Green=done, amber=current
│                         │
│  (... 4 more zones ...) │
│                         │
└─────────────────────────┘
```

**In-Zone Play (when playing a level):**

```
┌─────────────────────────┐
│  ●●●●○○  Zone Name 🔥5 │  ← Zone dots (tappable → picker), streak
│  ████████░░░░░░ 3/6     │  ← Per-zone progress bar
│                         │
│  Level 3 of 36          │  ← Level number, zone name (tappable)
│  "Which of these is..." │  ← Brief (big, readable)
│                         │
│  ┌───────────────────┐  │
│  │                   │  │  ← Canvas (aspect-ratio correct)
│  │   ┌───────────┐   │  │  ← Target frame (dashed)
│  │   │           │   │  │
│  │   │  ═══════  │   │  │  ← Player's frame (bright, draggable)
│  │   │           │   │  │
│  │   └───────────┘   │  │
│  │                   │  │
│  └───────────────────┘  │
│                         │
│  ↕ y: 617  w: 4448      │  ← Live coordinate readout
│         h: 1862         │
│                         │
│  [ CHECK ◉ ]            │  ← Big tappable button
│                         │
└─────────────────────────┘
```

On success, the bottom half smoothly expands to reveal:

```
│  ✓ CORRECT              │  ← Green flash
│                         │
│  ┌─ JSON ─────────────┐ │
│  │ "dimensions": {    │ │  ← Highlighted JSON
│  │   "width": 4448,   │ │
│  │   "height": 1862   │ │
│  │ },                 │ │
│  │ "anchor_point": {  │ │
│  │   "x": 0, "y": 617│ │
│  │ }                  │ │
│  └────────────────────┘ │
│                         │
│  [ NEXT → ]             │  ← Advance button
│                         │
```

### Micro-Animations (CSS only, keep it fast)

- **Frame snapping:** When within 8% tolerance of correct position, the frame magnetically snaps with a `0.25s ease-out` transition and a brief scale pulse (1.0 → 1.02 → 1.0)
- **Correct answer:** The canvas border flashes green once. A single ✓ fades in. The JSON reveal slides up with a `0.3s ease-out`.
- **Wrong answer:** Brief red shake on the canvas (CSS `translateX` keyframe, 3 cycles, 0.3s total). No harsh penalties — just a gentle "try again" nudge.
- **Zone completion:** Zone card progress bar fills to 100% and the "Complete" badge appears. Badge text fades in.
- **Streak counter:** Numbers tick up with a slight scale bounce.
- **Progress bar:** Smooth width transition between levels.

### Key UI Elements

**Zone Dots (always visible at top):**
Six dots in a row. Filled green = completed zone. Amber = partially completed or current zone. Dark gray = untouched. Tapping the dots opens the Zone Picker overlay. The zone name in the header is also tappable to open the picker.

**Zone Picker Overlay:**
A scrollable overlay showing all 6 zones with their 6 level buttons. Each level is always tappable regardless of completion state. Completed levels show a green checkmark. The current level is highlighted amber. Tapping any level jumps directly to it.

**Streak Counter (top right):**
"🔥 7" — counts consecutive correct answers. Resets on wrong answer. Purely motivational.

**Hint Button (bottom left, small):**
"💡" — Tapping shows a one-line hint below the brief. Available after 10 seconds on a level. No penalty.

**JSON Reveal Panel:**
After every correct answer, shows ONLY the 2-6 lines of JSON relevant to what the player just learned. NOT the full FDL file. Keep it bite-sized. Newly introduced properties are highlighted with a subtle amber background. Previously seen properties are normal.

---

## INTERACTION DETAILS

### "Frame It" (Type A) Interactions

**Dragging a frame:**
- The frame line is a `<div>` with a colored border, absolutely positioned inside the canvas container
- Touch/mouse drag moves or resizes it
- For levels where only one axis matters (e.g., "set the height"), lock the other axis
- Show live pixel values updating as the player drags (positioned below the canvas)
- Snap threshold: 8% of canvas dimension on each edge
- On snap: transition to exact correct position, play success state

**Filling in a value:**
- A single input field, styled to look like it's part of the JSON
- Numeric keyboard hint on mobile (`inputMode="numeric"`)
- Accept values within ±2 pixels of correct (rounding tolerance)

**Connecting / wiring (Level 18, 25, 29):**
- Cards with labels. Player taps a card, then taps the slot it goes into.
- NOT drag lines — just tap-to-place. Much simpler on mobile.
- Correct placement: card slides into slot with a satisfying click animation
- Wrong placement: card bounces back

### "Fix It" (Type B) Interactions

- 2-4 tappable option pills below the canvas
- Only ONE is correct
- Tap correct → green highlight, brief explanation, advance
- Tap wrong → red flash on that pill, try again (pill becomes disabled)

### "Pick It" (Type C) Interactions

- Same as Fix It but without a canvas visual. Just the question + 4 option pills.
- Can also be a simple true/false (2 pills)

---

## STATE MANAGEMENT

Use React `useState`. Keep it dead simple.

```javascript
const [currentLevel, setCurrentLevel] = useState(1);          // 1-36
const [streak, setStreak] = useState(0);                      // consecutive correct
const [completedLevels, setCompletedLevels] = useState(new Set());
const [showReveal, setShowReveal] = useState(false);          // JSON reveal visible
const [hintVisible, setHintVisible] = useState(false);
const [showZonePicker, setShowZonePicker] = useState(false);  // zone picker overlay
```

All 6 zones and 36 levels are always accessible via the zone picker overlay. Per-zone progress is derived from `completedLevels`. No stars, no scores, no XP systems. Just: which levels are done, and what's your current streak. Streaks are the only dopamine number. Game completion triggers when all 36 levels are in `completedLevels`, regardless of order.

**No localStorage, no sessionStorage.** State lives in React memory only.

---

## LEVEL DATA STRUCTURE

Every level is a compact object. The coding agent should define all 36 in a single `LEVELS` array.

```javascript
const LEVELS = [
  {
    id: 1,
    zone: 1,
    type: "frame",            // "frame" | "fix" | "pick"
    brief: "This is a camera sensor. It's 4448 pixels wide.",
    concept: "canvas_width",  // tag for what's being taught
    newConcept: "Canvas",     // shown as a chip if it's new, or null
    
    // Type-specific:
    canvas: { width: 4448, height: 3096 },
    draggable: "width",       // "width" | "height" | "position" | "both" | "frame"
    target: { width: 4448 },  // what the player needs to match
    tolerance: 0.08,          // 8% snap tolerance
    
    hint: "The width matches the sensor's horizontal pixel count.",
    
    reveal: {                 // JSON to show on success
      lines: `"dimensions": {\n  "width": 4448\n}`,
      highlightKeys: ["width"]
    }
  },
  {
    id: 13,
    zone: 3,
    type: "fix",
    brief: "Something's wrong with this frame.",
    canvas: { width: 4448, height: 3096 },
    shownFrame: { width: 4448, height: 1862, x: 0, y: 0 },  // the broken state
    correctFrame: { width: 4448, height: 1862, x: 0, y: 617 },
    options: [
      { text: "Anchor Y is wrong", correct: true },
      { text: "Width is wrong", correct: false },
      { text: "Aspect ratio is wrong", correct: false },
      { text: "Canvas is too small", correct: false },
    ],
    hint: "The frame should be vertically centered.",
    reveal: {
      lines: `"anchor_point": {\n  "x": 0,\n  "y": 617  ← fixed!\n}`,
      highlightKeys: ["y"]
    }
  },
  // ... etc for all 36 levels
];
```

---

## IMPLEMENTATION NOTES

### Tech

- **Single React .jsx file** using Tailwind CSS utility classes
- Load `IBM Plex Sans` and `JetBrains Mono` from Google Fonts CDN
- All 36 levels defined as data in a constant array
- Total file should be manageable — the game logic is simple because there are only 3 level types
- Default export a single component

### Canvas Rendering

Use HTML `<div>` elements, NOT `<canvas>`:
- Outer div: the canvas, with `aspect-ratio` CSS matching the camera's ratio and a dark background
- Inner div(s): frame lines as absolutely positioned elements with colored borders
- The draggable frame uses `onPointerDown` / `onPointerMove` / `onPointerUp` (works for both mouse and touch)
- Convert pointer position to percentage of canvas, then to pixel values based on the level's canvas dimensions
- Display pixel values in a readout below the canvas using JetBrains Mono

### Snapping

When the player's frame edge is within `tolerance` (default 8%) of the target edge on ALL active axes:
1. Set frame to exact target position via state update
2. CSS `transition: all 0.25s ease-out` handles the visual snap
3. Trigger success state

### JSON Reveal

- Pre-formatted string with syntax highlighting via `<span>` elements with color classes
- Newly learned keys get a subtle amber background highlight
- The reveal panel slides in from below using CSS transform + opacity transition
- Keep it SHORT — never more than 8 lines of JSON per reveal

### Responsive

- Works on phone (360px+), tablet, desktop
- Canvas visualization scales to fit container width with correct aspect ratio
- Touch targets minimum 44×44px
- JSON reveal text at minimum 14px

---

## WHAT SUCCESS LOOKS LIKE

A DIT or post supervisor picks up the game on their phone during a coffee break. They pick whichever zone interests them first via the zone picker, jump around between zones, and in 18-22 minutes they've completed all 36 levels. They now understand:

- What a Canvas is and how it maps to a camera sensor
- What a Framing Intent is and how aspect ratios work
- How Framing Decisions are calculated (the actual math)
- What protection percentages do
- How Contexts wire it all together
- How the same intent works across different cameras
- What a complete FDL JSON file looks like
- How to spot and fix common FDL errors
- How delivery canvases extend the pipeline

They didn't read a spec. They didn't watch a presentation. They played a game for 20 minutes, and now they GET IT.

---

## RESOURCE LINKS

Include these in an "About" overlay accessible from a small "ℹ️" button:

- **ASC FDL Spec & Docs:** https://github.com/ascmitc/fdl
- **ASC FDL Official Page:** https://theasc.com/society/ascmitc/asc-framing-decision-list
- **pyfdl Python Toolkit:** https://apetrynet.github.io/pyfdl/
- **Netflix Framing Calculator:** Search "Netflix Framing Working Resolution Calculator"

---

*Build it simple. Build it fast. Make every tap feel good.*
