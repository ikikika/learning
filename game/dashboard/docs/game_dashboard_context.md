# Game Dashboard — Current Context

Living snapshot of what is implemented in `/Users/user1/projects/learning/game/dashboard`.  
Design north-star (goals, phases, principles): [`avatar_gamification_dashboard_decisions.md`](./avatar_gamification_dashboard_decisions.md).

---

## Stack

| Item | Choice |
|------|--------|
| App | React 19 + TypeScript, Vite 8 |
| Deps | `react`, `react-dom` only (no router, no Phaser) |
| Scripts | `dev`, `build` (`tsc -b && vite build`), `lint`, `preview` |
| Entry | `index.html` → `src/main.tsx` → `App.tsx` → `World` |

---

## Layout

```
dashboard/
├── docs/
│   ├── avatar_gamification_dashboard_decisions.md   # product/design decisions
│   └── game_dashboard_context.md                    # this file (implementation truth)
├── scripts/
│   └── split_emote_layers.py                        # wave/celebrate → paper-doll layers
├── src/
│   ├── App.tsx, main.tsx, App.css, index.css
│   ├── assets/avatars/                              # sprites + JSON meta
│   └── game/
│       ├── World.tsx / World.css                    # room UI, controls, SVG grid
│       ├── useAvatarMovement.ts                     # path + facing + walk RAF
│       ├── avatar/
│       │   ├── Avatar.tsx                           # canvas paper-doll + emotes
│       │   └── spritesheet.ts                       # chroma, frames, anchors, hair overhang
│       ├── grid/isometric.ts                        # project / hit-test / depth scale
│       └── movement/path.ts                         # 8-connected grid path
└── .tmp-venv/                                       # local Pillow tooling (not app runtime)
```

---

## World (isometric room)

- **Grid:** 10×10 core, tile 96×48, origin (0,0). Stage fills the viewport; viewBox aspect tracks the stage via `ResizeObserver` + `expandRectToAspect` so diamonds stay undistorted while extra lattice cells fill the visible area.
- **Projection:** `x = (gx-gy)*halfW`, `y = (gx+gy)*halfH`.
- **Depth:** `gx+gy`. **Scale:** ~0.6 (back) → 1.0 (front).
- **Input:** click tile → `walkTo` (emotes block clicks).
- **Avatar:** HTML `<canvas>` overlay (not SVG), feet-anchored, depth-scaled.
- **Grid visibility:** currently **on** (`showGrid`); decisions doc prefers invisible grid later.
- **No furniture / interaction points yet.** Soft room gradient only.

**Movement:** 8-connected path (diagonal when both axes change); segment time from screen distance; facing from screen-dominant axis → `walk_n|s|e|w`. Idle is always `idle_s`.

---

## Avatar (paper-doll)

### Draw order

- Walk / idle: `feet → body → hands → head`
- Wave / celebrate: `feet → body → head → hands` (hand in front of head/helmet)

### Helmet (MVP)

- **Not** a separate overlay layer at runtime.
- `helmetEquipped` swaps head sheet:
  - walk/idle off → `avatar_head_spritesheet`
  - walk/idle on → `avatar_head_white_helmet_spritesheet`
  - wave off → `avatar_wave_head_spritesheet`
  - wave on → `avatar_wave_head_white_helmet_spritesheet`
  - celebrate off → `avatar_celebrate_head_spritesheet`
  - celebrate on → `avatar_celebrate_head_white_helmet_spritesheet`

### Animation rows (body layers, 8×5, 1536×1024, chroma `#FF00FF`)

| Name | Row | Frames | ms |
|------|-----|--------|-----|
| `idle_s` | 0 | 8 | 120 |
| `walk_s` | 1 | 8 | 80 |
| `walk_n` | 2 | 8 | 80 |
| `walk_w` | 3 | 8 | 80 |
| `walk_e` | 4 | 8 | 80 |

### Emotes (layered sheets, 8×1, 1536×512 each)

| Name | Source row (combined) | Frames | ms | Layer prefix |
|------|----------------------|--------|-----|--------------|
| `wave_s` | 0 | 8 | 100 | `avatar_wave_{feet,body,hands,head}` |
| `celebrate_s` | 1 | 8 | 90 | `avatar_celebrate_{feet,body,hands,head}` |

Split from `avatar_wave_celebrate_spritesheet` via `scripts/split_emote_layers.py`.

### Spritesheet prep (`spritesheet.ts`)

1. Magenta chroma-key.
2. Integer cell slicing (avoid `1024/5` float bleed).
3. **`packedWalkHair`** (head + white-helmet head + basic meta only):
   - `walk_w`: clear packed next-row hair under bottom gap.
   - `walk_e`: restore that band as **overhang** above the cell.
4. Per-frame feet + head anchors from opaque pixels.
5. Layered draw offsets non-head layers by overhang when head is taller.
6. **`SHEET_REVISION`** in `Avatar.tsx` (currently **32**) busts the in-memory sheet cache with Vite URLs.

---

## Assets under `src/assets/avatars/`

### Runtime (imported by `Avatar.tsx`)

| Asset | Role |
|-------|------|
| `avatar_feet_spritesheet.{png,json}` | Walk/idle feet / boots + lower legs |
| `avatar_body_spritesheet.{png,json}` | Walk/idle tunic / belt |
| `avatar_hands_spritesheet.{png,json}` | Walk/idle hands |
| `avatar_head_spritesheet.{png,json}` | Walk/idle default head (`packedWalkHair`) |
| `avatar_head_white_helmet_spritesheet.{png,json}` | Helmet-equipped head (walk/idle) |
| `avatar_wave_{feet,body,hands,head}_spritesheet.{png,json}` | Wave emote layers (Wave button → `wave_s`) |
| `avatar_wave_head_white_helmet_spritesheet.{png,json}` | Helmet-equipped wave head |
| `avatar_celebrate_{feet,body,hands,head}_spritesheet.{png,json}` | Celebrate emote layers (Celebrate button → `celebrate_s`) |
| `avatar_celebrate_head_white_helmet_spritesheet.{png,json}` | Helmet-equipped celebrate head |
| `avatar_wave_assembled_spritesheet.{png,json}` | Preview composite of wave layers (not imported at runtime) |
| `avatar_celebrate_assembled_spritesheet.{png,json}` | Preview composite of celebrate layers (not imported at runtime) |

### Source / unused at runtime

| Asset | Role |
|-------|------|
| `avatar_basic_spritesheet.{png,json}` | Source sheet for walk layer split; keep as reference |
| `avatar_wave_celebrate_spritesheet.{png,json}` | Source for emote split (`scripts/split_emote_layers.py`) |
| `avatar_wave_spritesheet.{png,json}` | Full-body wave slice (reference) |
| `avatar_celebrate_spritesheet.{png,json}` | Full-body celebrate slice (reference) |
| `helmet_red_spritesheet.png` | Orphaned helmet-only overlay experiment (safe to delete unless regenerating overlays) |

Deleted / not used: `helmet_white_*`, `helmet_red_spritesheet.json` — white helmet was baked into the head sheet for MVP.

---

## UI controls (`World.tsx`)

| Control | Behavior |
|---------|----------|
| Wave | One-shot `wave_s`; disabled while walking/emoting |
| Celebrate | One-shot `celebrate_s` |
| Equip / Unequip Helmet | Toggles `helmetEquipped` |

---

## Doc vs code (gaps)

| Decisions doc | Current code |
|---------------|--------------|
| Invisible isometric grid | Grid outlines visible |
| Furniture + interaction points | None |
| Independent equipment layers | Helmet = **head sheet swap** |
| Achievements unlock gear | Manual toggle only |
| Sit / inspect / full emote set | Wave + celebrate only |
| 8-direction walks | 4 walk dirs + front idle |
| EquipmentManager / AnimationController modules | Inlined in World + Avatar |

Rough progress: early MVP phases (grid, walk, layered avatar, depth scale, two emotes, helmet prototype).

---

## Conventions for agents

1. Prefer composing **layer sheets**, not editing `avatar_basic` / `avatar_wave_celebrate` for runtime.
2. After changing prep logic or PNG/JSON sheets, bump **`SHEET_REVISION`**.
3. Only enable `packedWalkHair` on sheets that actually pack walk_e hair into walk_w.
4. Do not reintroduce helmet overlay unless intentionally replacing the head-swap MVP.
5. Keep movement/avatar state in World + hooks; avoid adding engines unless asked.
6. Decisions doc = product intent; **this file** = implementation truth when they disagree.
7. Regenerate emote layers with `.tmp-venv/bin/python scripts/split_emote_layers.py`.
