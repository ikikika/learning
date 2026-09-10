# Gamification Dashboard — Avatar & 2D Game World Decisions

## 1. Overview

The dashboard will use a **2D cartoon avatar** inside an interactive game-like space.

The avatar will:

- Represent the user/player.
- Be able to equip achievement-based items.
- Move around the room in response to mouse interactions.
- Perform contextual animations such as walking, waving, sitting, interacting, and celebrating.
- Become visually smaller when moving toward the back of the room to create a pseudo-3D depth effect.

The surrounding dashboard remains a normal React application, while the avatar/world behaves like a lightweight 2D game.

---

# 2. Technology Direction

## Decision

Start with:

- **React**
- **2D sprite/layered character assets**
- HTML Canvas or a lightweight 2D rendering/game layer
- Invisible diamond/isometric world grid
- Y-position/depth-based scaling
- Y-position/depth-based rendering order

Do **not** start with a full 3D engine.

### Rationale

The product is primarily a gamified dashboard rather than a full 3D game. A 2D approach provides:

- Simpler implementation
- Easier integration with React
- Easier achievement/equipment customization
- Lower rendering complexity
- A strong game-like visual experience without requiring 3D

If the project eventually becomes substantially more game-like, a 2D game engine such as Phaser can be considered.

---

# 3. Avatar Representation

## Decision

Use a **layered 2D avatar**, rather than pre-rendering every possible equipment combination.

The avatar is composed from independent visual layers.

Example:

```text
Final Avatar
    │
    ├── Hair / Head
    ├── Helmet
    ├── Body
    ├── Suit
    ├── Gloves
    ├── Legs
    ├── Boots
    └── Badge
```

Each layer can be replaced independently.

### Why

If there are:

- 10 helmets
- 10 suits
- 10 gloves
- 10 boots
- 20 badges

creating a sprite for every combination would require:

```text
10 × 10 × 10 × 10 × 20 = 200,000 combinations
```

Instead, the individual equipment assets are composed at runtime.

This keeps the system scalable.

---

# 4. Animation Strategy

## Decision

Build the **animation system before the full equipment system**.

The initial animation prototype should support:

- Idle
- Walk
- Wave
- Celebrate

Later animations can include:

- Sit
- Interact
- Run
- Jump
- Inspect
- Dance

### Rationale

Equipment needs to work correctly with animation.

The first technical milestone should therefore prove that the avatar can:

1. Exist in the world.
2. Move from one point to another.
3. Play a walking animation while moving.
4. Stop and transition to another animation.
5. Change direction.

Once this works, equipment can be layered onto the animated avatar.

---

# 5. Directional Animation

## Decision

Use directional animation assets.

For a simple version, support:

- Front
- Back
- Left
- Right

For a more polished game-like version, consider **8 directions**:

```text
              Back
                ↑
            ↖   ↑   ↗

        Left ← Avatar → Right

            ↙   ↓   ↘
                ↓
              Front
```

Possible animation states:

```text
walk_n
walk_ne
walk_e
walk_se
walk_s
walk_sw
walk_w
walk_nw
```

### Rationale

The avatar needs to walk both toward and away from the camera when moving through the room.

Directional sprites make this movement visually convincing.

---

# 6. Equipment Animation

## Decision

Do not create complete sprite sheets for every equipment combination.

Equipment should be aligned with the avatar's animation frames and rendered as layers.

For example:

```text
Walk Frame 1
    Helmet Frame 1
    Body Frame 1
    Suit Frame 1
    Boots Frame 1

Walk Frame 2
    Helmet Frame 2
    Body Frame 2
    Suit Frame 2
    Boots Frame 2
```

All layers must share compatible:

- Canvas dimensions
- Frame dimensions
- Anchor points
- Character proportions
- Animation timing

### Equipment categories

| Equipment | Typical behavior |
|---|---|
| Badge | Follows body |
| Helmet | Follows head |
| Suit | Follows body |
| Gloves | Follows hands |
| Boots | Follows feet |
| Cape | May require independent animation |
| Weapon/accessory | May require independent animation |

For the MVP, keep equipment simple and attached to the relevant body part.

---

# 7. Avatar State

The avatar's state should be separated into at least three concepts:

```text
Avatar
 ├── Position
 ├── Animation
 └── Equipment
```

Example:

```js
const avatar = {
  position: {
    x: 200,
    y: 350
  },

  direction: "left",

  animation: "walk",

  equipment: {
    helmet: "gold-helmet",
    suit: "astronaut-suit",
    gloves: "power-gloves",
    boots: "speed-boots",
    badge: "100-tasks"
  }
};
```

The important architectural rule is:

> Position, animation, and equipment should be independent systems.

---

# 8. Movement System

## Decision

Mouse clicks should result in movement commands rather than directly manipulating the avatar.

Example:

```text
User clicks furniture
        ↓
Determine interaction point
        ↓
Movement Controller
        ↓
Avatar walks to destination
        ↓
Arrival
        ↓
Play interaction animation
```

Example API:

```js
avatar.walkTo(destination);
avatar.play("wave");
avatar.equip("gold-helmet");
```

For the MVP, movement can use a straight line.

Later, add pathfinding so the avatar can avoid furniture, walls, and other obstacles.

---

# 9. Interactive Objects

## Decision

Every interactive object should have an **interaction point**.

Do not simply tell the avatar to walk to the object's visual position.

Example:

```js
const desk = {
  id: "desk-01",

  position: {
    x: 500,
    y: 300
  },

  interactionPoint: {
    x: 450,
    y: 300
  },

  interaction: "inspect"
};
```

This allows the avatar to stand at the correct position when interacting with an object.

Possible interaction types:

```text
sit
wave
inspect
open
celebrate
interact
```

---

# 10. Depth and Avatar Size

## Decision

The avatar should change size according to its position/depth in the room.

The goal is a **pseudo-3D / 2.5D effect**.

Conceptually:

```text
BACK OF ROOM
    ↓

    🧑   smaller

    🧑   medium

    🧑   larger

    🧑   largest

    ↑
FRONT OF ROOM
```

The sprite assets should **not** contain different sizes for each depth.

Instead, keep a consistent base sprite size and scale it at runtime.

Example:

```js
const scale = calculateScale(avatar.y);
```

Conceptually:

```text
Back  → scale 0.6
Middle → scale 0.8
Front → scale 1.0
```

The exact scale curve should be tuned visually.

---

# 11. Depth / Y Position

The room should conceptually treat Y position as depth.

```text
             BACK
              ↑
              │
          depth = low
              │
              │
          depth = high
              │
              ↓
            FRONT
```

The renderer derives:

```text
Y position
    ↓
Depth
    ↓
Scale
    ↓
Rendering order
```

This allows the avatar to appear smaller toward the back and larger toward the front.

---

# 12. Rendering Order / Occlusion

## Decision

Objects should be rendered according to their depth/Y position.

This allows objects to naturally appear in front of or behind the avatar.

Example:

```text
Avatar behind desk

       🧑
      ┌───┐
      │ 🖥 │
      └───┘
```

The desk can visually obscure the avatar when appropriate.

A simple implementation can sort renderable objects by their Y/depth value.

Conceptually:

```text
lower Y/depth
    ↓
render first

higher Y/depth
    ↓
render later
```

The exact sorting direction depends on the coordinate system used.

---

# 13. World Grid

## Decision

**Use an invisible diamond/isometric coordinate grid.**

The world uses logical grid coordinates that are projected onto the 2D canvas. This supports the pseudo-3D depth effect, diagonal movement, furniture placement, pathfinding, and consistent interaction points while keeping the visual presentation clean.

Given the decisions above—especially **Y-position as depth, Y-based scaling, depth sorting, and a room that feels like a small 2D game**—a **diamond/isometric-style grid** is the best fit.

![Diamond / isometric room grid example 1](https://images.openai.com/static-rsc-4/K032dZGiNPSn9R3WANlCSgMXmYQ3qx-5D2fNdEM9pS3bp3tu4WHPo_NBnLiA6-YqmAeyKhUJSi8MISAu1fX34D5IZoVCxCnlyUYR54Y7HF-oVyHfxPidOlEG7ekzI1yXAVql5SKnIzkkMr08vDovU2zgvWyYpuzMtgQ3665EUUm7fZ4qjXI0QgaETu14mcJJ?purpose=fullsize)

![Diamond / isometric room grid example 2](https://images.openai.com/static-rsc-4/BX7PunOoY8LnARuere-YzGyaNyOQa_r_MmtZU_ZTBRX5I3hLjRXT6zTB-qa-WXO1Ns5E1duI0XJoILXy_WSfoGWEluCgHTGEc0RcMK_CGvzkVeqVuVR6h1MNKCLWC34sIYmpKOjiX_AIFAz1z_kJswzTJAZgNO2Ldylm6cjqI7kMAa2h02p1t42Il2hQiw3I?purpose=fullsize)

![Diamond / isometric room grid example 3](https://images.openai.com/static-rsc-4/pMzMIo386VcgvqDZb2xuAF96waFk6fAwYYJx9Q7IjEeM8dkEachwCIn-NK8UY7gk82JjHWi-l9FIDDdU4LrpPGp00iGk2JRtXpKI_-mfvwQ8sI_d5azifFOE9G5_U9mUYKSqZB63frQPzCfSaySaQn_f4-vZ5rrtQKW1hjtT-xPlqLJAgYJ65U5StlGTSZ2d?purpose=fullsize)

![Diamond / isometric room grid example 4](https://images.openai.com/static-rsc-4/SxaENoC7n-2D82ObsgNanNyrI0lnugLJS8qC9xW0PqDLO3vJpZm6hrCmcL5h4mY6K-aX-ffCsV7523s2L0sXR0y2brZaJhKugKFV24hKD8O-0QYsBjnTdBX3QZJ2zHgEtGOu19BS8dWNBu43OxCsrM-FWCDUAPvqKvfFlFlaQiMYcc6JrfbBl0szep7pHu9c?purpose=fullsize)

![Diamond / isometric room grid example 5](https://images.openai.com/static-rsc-4/bNELJ60MFDKr4zw0kc8WFKi1WOzATD0BqnArLgsK9V7bN453EHQfLtgEn6eG3zySmG5wYubW1LmIE5EKPgGfgIyueBwD5JY5-uovpk1jqHUJlrnHtlNaAcl2HQc0apSeD05NUU2HvUvPphFM_1oufhBH7WL7i1iY25ox4mjZibAOeO_Ta9sBkfJxP48W5eLG?purpose=fullsize)

![Diamond / isometric room grid example 6](https://images.openai.com/static-rsc-4/VZyH3v7tPpwxR3TWn8V6bUXCCcLFADw0LnkBUUIOHx9DYVeewpZbIm7i80t6msAFAS8-cGMbxckvbdQWfp3rrqiNoMTOqYFH4YUeGsHmC1HT2a4krbtFDvpzLdcGE_0-tOXy7h7jbSVatHNuahexdBU0b_VAPi0krdzjqh4cWQhqymFjM-Ofp9dyH26jqLNi?purpose=fullsize)

### Grid options

| Grid                    | Recommendation | Why                                                                        |
| ----------------------- | -------------- | -------------------------------------------------------------------------- |
| **Square**              | 🟡 Good        | Easiest to implement, but feels more like a normal floor plan              |
| **Diamond / Isometric** | 🟢 **Best**    | Naturally communicates depth and makes front/back movement feel convincing |
| **Hexagon**             | 🔴 Avoid       | Good for strategy/board games, but awkward for furniture and room layouts  |

### Why diamond fits

The current design already says:

```text
Y position → Depth → Scale → Rendering order
```

A diamond grid makes this much easier to *visually understand*.

For example:

```text
             BACK
              ▲
        ◇  ◇  ◇  ◇
      ◇  ◇  ◇  ◇  ◇
    ◇  ◇  🧑  ◇  ◇
      ◇  ◇  ◇  ◇
        ◇  ◇  ◇
              ▼
             FRONT
```

The avatar can move diagonally:

```text
              🧑
             ↗
           ↗
         ↗
       🧑
```

and as it moves upward (toward the back):

```text
        BACK
          🧑  scale 0.6

          🧑  scale 0.75

          🧑  scale 0.9

          🧑  scale 1.0
        FRONT
```

This reinforces the pseudo-3D effect already planned: smaller toward the back, larger toward the front.

### Invisible grid, visible room

Do **not** necessarily show a visible grid in the UI.

Treat it as an **invisible diamond coordinate system** underneath the artwork:

```text
                   Room
        ┌─────────────────────────┐
        │       🖥️                │
        │                          │
        │             🛋️          │
        │                          │
        │   🪴             🏆      │
        │             🧑           │
        └─────────────────────────┘

              invisible
           diamond grid underneath
```

Furniture and the avatar occupy positions on that grid, while the user sees a clean game environment.

### Logical coordinates → screen projection

Structure the world around **logical grid coordinates**, rather than raw screen `x/y`.

For example:

```js
{
  gridX: 5,
  gridY: 8
}
```

Then convert that to screen coordinates:

```text
          grid coordinates
                 ↓
        isometric projection
                 ↓
          screen x / y
                 ↓
       avatar + furniture
```

This gives a stronger foundation for later adding:

- furniture placement
- collision
- pathfinding
- interaction points
- room expansion
- multiple floors/areas
- NPCs
- collectibles
- teleport points

### Choice

**Use a diamond/isometric grid internally, but hide the grid visually.**

---

# 14. Achievement → Equipment System

## Decision

Separate **unlocked equipment** from **currently equipped equipment**.

Example:

```js
const player = {
  unlockedItems: [
    "helmet-gold",
    "boots-speed",
    "badge-100"
  ],

  equipped: {
    helmet: "helmet-gold",
    boots: "boots-speed",
    suit: "suit-basic",
    badge: "badge-100"
  }
};
```

The intended flow is:

```text
Main Application
       ↓
Achievement
       ↓
Unlock Equipment
       ↓
Inventory
       ↓
Player Equips Item
       ↓
Avatar Appearance
```

Equipment definitions should be data-driven rather than hard-coded throughout the application.

Example:

```js
const equipment = {
  helmets: {
    gold: {
      name: "Gold Helmet",
      requiredAchievement: "100_tasks",
      asset: "/avatars/helmet-gold.png"
    }
  }
};
```

This makes it possible to add new achievements and equipment without modifying core avatar logic.

---

# 15. Recommended Component / Module Architecture

A possible structure:

```text
src/
├── game/
│   ├── World
│   ├── Avatar
│   ├── MovementController
│   ├── AnimationController
│   ├── InteractionManager
│   └── PathFinder
│
├── avatar/
│   ├── AvatarAppearance
│   ├── EquipmentManager
│   └── equipment/
│
└── achievements/
    └── AchievementManager
```

The exact React component structure can evolve during implementation.

The important separation is:

```text
World
  │
  ├── Movement
  ├── Interaction
  └── Rendering

Avatar
  │
  ├── Appearance
  ├── Equipment
  └── Animation

Application
  │
  └── Achievements / Player Data
```

---

# 16. Recommended MVP Development Order

## Phase 1 — Avatar

Create:

- Base 2D cartoon avatar
- Idle animation
- Walk animation
- Direction changes
- Basic positioning

## Phase 2 — World

Create a simple room containing:

- Invisible diamond/isometric grid coordinate system
- Floor
- Walls/background
- Desk
- Sofa
- Plant
- Trophy or other interactive objects

## Phase 3 — Movement

Implement:

```text
Click object
    ↓
Calculate destination
    ↓
Walk avatar
    ↓
Stop at interaction point
```

## Phase 4 — Depth

Add:

- Y-based scaling
- Depth sorting
- Basic occlusion

## Phase 5 — Interactions

Implement:

- Wave
- Sit
- Inspect
- Celebrate
- Other contextual animations

## Phase 6 — Equipment

Add:

- Helmet
- Suit
- Gloves
- Boots
- Badges

Use layered assets rather than pre-combined character sprites.

## Phase 7 — Gamification

Connect:

```text
Achievement
    ↓
Unlock
    ↓
Inventory
    ↓
Equip
    ↓
Avatar
```

---

# 17. Core Design Principles

1. **Do not pre-render every equipment combination.**
2. **Keep equipment as independent visual layers.**
3. **Separate position, animation, and equipment state.**
4. **Build movement/animation before implementing the full equipment system.**
5. **Use interaction points for furniture and objects.**
6. **Keep sprite assets at a consistent base size.**
7. **Apply depth-based scaling at runtime.**
8. **Use depth/Y sorting for natural foreground/background behavior.**
9. **Use an invisible diamond/isometric grid for world coordinates.**
10. **Keep achievements and equipment data-driven.**
11. **Start simple and add pathfinding/advanced animation later.**

---

# 18. Target Experience

The intended interaction should feel like a small game embedded inside a dashboard:

```text
                  Gamification Dashboard

 ┌──────────────────────────────────────────────┐
 │                                              │
 │              🖥️                              │
 │                                              │
 │                       🛋️                     │
 │                                              │
 │       🪴                    🏆                │
 │                                              │
 │                         🧑                   │
 │                                              │
 └──────────────────────────────────────────────┘

 Click 🖥️
     ↓
 Avatar walks toward it
     ↓
 Avatar gets smaller as it moves toward back
     ↓
 Avatar stops at interaction point
     ↓
 Avatar performs interaction animation
```

The overall goal is a **gamified 2D environment**, while retaining React as the main application framework.
