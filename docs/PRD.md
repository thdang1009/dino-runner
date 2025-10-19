# 🦖 Dino Runner — Product Requirements Document

## 1. Overview

**Genre:** Endless Runner / Arcade
**Platform:** Web (HTML5 / Canvas), Mobile (Android/iOS via wrapper)
**Engine:** PhaserJS or pure Canvas (no backend)

### Core Tagline
> "Run through extinction — evolve or perish."

A fast, minimal, dopamine-driven runner game where the player controls a dinosaur escaping extinction. Each biome offers mutation opportunities — new body parts inspired by iconic dinosaurs.

---

## 2. Objectives

### Primary
Build a lightweight, addictive, offline-playable runner game.

### Secondary
Create a foundation for expansion (evolution, score sharing, unlockables).

### Design Intent
Nostalgia + evolution theme = emotional hook.

### Success Metrics
- **Retention:** 1–2 min average session time
- **High replayability** without backend
- **Playable on low-end devices**

---

## 3. Core Gameplay

### Player Controls
- **Tap / Space / Up:** Jump
- **Slide forward:** Dash or temporary mutation activation (once unlocked)

### Core Loop
1. **Auto-run** (horizontal scroll)
2. **Progressive difficulty:** The more distance you run, the faster the game becomes with more obstacles and more variety (balanced to remain avoidable)
3. **Avoid obstacles** (rocks, meteors, plants)
4. **Collect DNA or Fossils** for temporary or permanent mutations
5. **Survive as long as possible** to maximize score

### Mutation System (Unique Twist)

Certain collectibles trigger mutations that modify abilities. Press a button on screen to activate (debate: one button per skill vs. one button for all — TBD).

**Implementation Note:** Store mutations in a JSON file so adding new skills only requires JSON updates (+ new code for unique mechanics if needed).

#### Mutation Types

**Obstacle Types in Game**: Rocks, Trees, Meteors, Pits/Gaps

| Mutation | Dinosaur Part | Destroys | Activation | Behavior | Duration |
|----------|--------------|----------|------------|----------|----------|
| 🦕 **Tail Whip** | Ankylosaurus Tail | ALL obstacles | Auto on pickup | Breaks everything on contact | 5-10s |
| 🦖 **Mighty Bite** | T-Rex Jaw | Rocks ONLY | Trigger button | Reusable during duration, doesn't work on trees/meteors | 5-10s |
| 🦏 **Horned Charge** | Triceratops Horn | Rocks ONLY | Auto on contact | Single-use: breaks first rock hit then mutation ends | 5-10s |
| 🦘 **Raptor Legs** | Velociraptor Legs | None | Auto on pickup | Increased speed + higher jump (must dodge obstacles) | 5-10s |
| 🦕 **Long Neck** | Brachiosaurus Neck | None | Auto on pickup | Camera zooms out, see obstacles earlier | 5-10s |
| 🪽 **Glide** | Pterosaur Wings | None | Auto on jump | Slow fall after jump (better air control) | 5-10s |

**Design Notes:**
- **Strategic Depth**: Different mutations counter different obstacles - players must choose wisely
- **Mutation Replacement**: New mutation replaces current one instantly (no stacking in MVP)
- **Auto-activation vs Manual**: JSON supports both, but MVP defaults to auto
- **Power Hierarchy**: Tail Whip (universal) > Horned Charge (limited) > Mighty Bite (trigger required)
- Random mutation pool per biome creates freshness in each run

#### Future Expansion: Mutation Combos
*Not for MVP - design space reserved for Phase 2:*
- Stack multiple mutations simultaneously
- Create combo effects (Wings + Raptor Legs = extended glide + speed)
- Manual activation system with cooldowns
- Mutation upgrade trees

### Progression
- **Score = Distance traveled + DNA collected**
- **Optional:** Local storage for personal best / unlocked mutations

---

## 4. Game Loop (Player Experience)

| Phase | Description | Emotional Curve |
|-------|-------------|-----------------|
| 1. Start | Tap to begin. Immediate motion. | Curiosity |
| 2. Survive | Dodging obstacles, collecting DNA | Focus & flow |
| 3. Mutation | Short burst of empowerment | Dopamine spike |
| 4. Extinction | Meteor or fall ends run | Release & retry urge |
| 5. Replay | Quick retry | Hook & mastery |

---

## 5. Art & Aesthetic

### Visual Style
**Style:** Flat 2D, minimalist prehistoric theme

**Visual Direction:**
- Backgrounds shift subtly between biomes (desert, forest, volcano)
- Silhouette-style or cel-shaded line art for simplicity
- Mutations visually layered (modular sprite swapping)

### Sound Design
- Short chiptune loops for background music
- **Jump:** "Thud" sound
- **DNA pickup:** "Crunch" sound
- **Game over:** Meteor roar

### Tone
Fun yet slightly melancholic — running against extinction.

---

## 6. Technical Specifications

| Component | Detail |
|-----------|--------|
| **Engine** | PhaserJS (or pure JS Canvas) |
| **Assets** | SVG or PNG sprites (under 1MB total) |
| **Physics** | Simple collision rectangles |
| **Save System** | LocalStorage for high score + unlocked mutations |
| **Performance** | Target <30MB memory, <2s load time |
| **Build Target** | PWA + Web export (no backend) |
| **Optional** | Add leaderboard later (Firebase / Supabase) |

---

## 7. Monetization & Retention

### Phase 1 (Launch)
- **No ads, no in-app purchases** — pure experience

### Phase 2 (Optional Future)
- Cosmetic unlocks (color variants, hats, footprints)
- Watch ad = unlock mutation early (if monetized)
- Score leaderboard integration

### Retention Mechanics
- Mutation variety keeps each run unique
- Quick restart → instant retry dopamine loop

---

## 8. Expansion Ideas

- 🧬 **Evolution Mode:** Persistent DNA unlocks new abilities permanently
- 🌋 **Dynamic Weather:** Random lava rain, asteroid showers
- 🏞️ **Biome Transition:** Smooth world changes = "timeline of extinction"
- 🦴 **Fossil Archive:** Collection system with lore entries
- 🪐 **Time Warp:** Reverse extinction — go from dino → bird → human (meta layer)
- 🎯 **Daily Challenges:** Special obstacle patterns or mutation restrictions
- 🏆 **Achievement System:** Unlock badges for specific feats
- 🎨 **Skin System:** Unlock different dinosaur species as playable characters

---

## 9. MVP Scope (First Launch)

### Core Features Only
1. **1 playable dinosaur** (base form)
2. **Jump / double jump controls**
3. **3 obstacle types** (rocks, meteors, plants)
4. **2 mutations** (Tail + Wings)
5. **Distance + score tracking** (LocalStorage)
6. **1 background theme + looping music**

### Development Timeline

| Task | Estimate |
|------|----------|
| Basic movement & collision | 2 days |
| Mutation system | 3 days |
| Art & sound | 3 days |
| Polish & deploy (itch.io / web) | 2 days |
| **Total** | **~10 days for MVP** |

---

## ✅ Summary

**Dino Runner** isn't just a runner — it's a symbolic sprint through extinction, blending simplicity, evolution, and emotional resonance.

A project you can finish fast, showcase publicly, and use as a creative playground for future experimental systems (mutation, archetypes, evolution storytelling).

---

## 🤔 Open Questions & Decisions Needed

1. **Control scheme:** One button per mutation or single button cycling through active mutations?
2. **Horned Charge ability:** What should this do besides breaking rocks?
3. **Difficulty scaling:** What's the maximum speed cap to maintain playability?
4. **Mutation activation:** Auto-activate on pickup or manual player trigger?
5. **Art style:** Pixel art vs. vector graphics vs. hand-drawn?
