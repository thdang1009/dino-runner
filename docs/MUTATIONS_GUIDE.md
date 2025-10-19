# Mutations System Implementation Guide

## Overview
This guide explains how to use the `mutations.json` file to implement the mutation system in Dino Runner.

## JSON Structure Explained

### Mutation Properties

```javascript
{
  "id": "tail_whip",              // Unique identifier for code reference
  "name": "Tail Whip",            // Display name
  "dinosaur": "Ankylosaurus",     // Lore reference
  "rarity": "rare",               // common | uncommon | rare
  "duration": 8000,               // Milliseconds the mutation lasts
  "activation": "auto_on_pickup", // How mutation activates
  "destroys": ["rock", "tree"],   // Array of obstacle IDs this can destroy
  "behavior": { ... },            // Specific behavior rules
  "effects": { ... },             // Stat modifications
  "visual": { ... },              // Visual feedback
  "sound": { ... },               // Audio feedback
  "biomes": ["desert", "forest"]  // Where this mutation can spawn
}
```

### Activation Types

| Type | Description | MVP Implementation |
|------|-------------|-------------------|
| `auto_on_pickup` | Activates immediately when collected | ✅ Yes |
| `trigger_button` | Requires player to press button | ✅ Yes (Mighty Bite only) |
| `auto_on_jump` | Activates when player jumps | ✅ Yes (Glide only) |
| `auto_on_contact` | Activates on obstacle collision | ⚠️ Phase 2 |

### Behavior Types

#### 1. Passive Destroyer (`tail_whip`)
```javascript
"behavior": {
  "type": "passive_destroyer",
  "radius": 50,           // Collision radius
  "multi_use": true,      // Can destroy multiple obstacles
  "on_contact": true      // Destroys on touch
}
```
**Implementation**: Check collision every frame, destroy if obstacle type in `destroys` array.

#### 2. Triggered Destroyer (`mighty_bite`)
```javascript
"behavior": {
  "type": "triggered_destroyer",
  "range": 80,                      // Forward range of attack
  "multi_use": true,                // Can trigger multiple times
  "uses_per_activation": "unlimited" // No limit on triggers during duration
}
```
**Implementation**: On button press, check obstacles in range, destroy if in `destroys` array.

#### 3. Single-Use Destroyer (`horned_charge`)
```javascript
"behavior": {
  "type": "single_use_destroyer",
  "multi_use": false,       // Only destroys one obstacle
  "expires_on_hit": true,   // Mutation ends after first hit
  "on_contact": true        // Auto-destroys on contact
}
```
**Implementation**: On collision with obstacle in `destroys` array, destroy obstacle and remove mutation.

#### 4. Stat Modifier (`raptor_legs`)
```javascript
"behavior": {
  "type": "stat_modifier",
  "requires_dodging": true  // Player still needs to dodge
}
```
**Implementation**: Apply `effects.speed_multiplier` and `effects.jump_multiplier` to player stats.

#### 5. Camera Modifier (`long_neck`)
```javascript
"behavior": {
  "type": "camera_modifier",
  "camera_zoom": 0.7,                  // Zoom out to 70%
  "vision_distance_multiplier": 1.5    // See 1.5x further
}
```
**Implementation**: Adjust camera zoom/position, spawn obstacles further ahead.

#### 6. Physics Modifier (`glide`)
```javascript
"behavior": {
  "type": "physics_modifier",
  "gravity_multiplier": 0.4,  // Reduce gravity to 40%
  "air_control": true          // Allow direction change in air
}
```
**Implementation**: Modify player's gravity when airborne.

---

## Code Integration Example (PhaserJS)

### Loading Mutations

```javascript
// In preload()
this.load.json('mutations', 'mutations.json');

// In create()
this.mutationsData = this.cache.json.get('mutations');
this.currentMutation = null;
```

### Applying a Mutation

```javascript
class MutationManager {
  constructor(scene, mutationsData) {
    this.scene = scene;
    this.data = mutationsData;
    this.current = null;
    this.timer = null;
  }

  applyMutation(mutationId) {
    // Remove current mutation if exists
    if (this.current) {
      this.removeMutation();
    }

    // Find mutation data
    const mutation = this.data.mutations.find(m => m.id === mutationId);
    if (!mutation) return;

    this.current = mutation;

    // Apply effects
    if (mutation.effects) {
      this.scene.player.speed *= mutation.effects.speed_multiplier;
      this.scene.player.jumpPower *= mutation.effects.jump_multiplier;
    }

    // Apply visual changes
    this.applyVisual(mutation.visual);

    // Play sound
    this.scene.sound.play(mutation.sound.activation);

    // Set timer to remove mutation
    this.timer = this.scene.time.delayedCall(mutation.duration, () => {
      this.removeMutation();
    });
  }

  removeMutation() {
    if (!this.current) return;

    // Reset effects
    if (this.current.effects) {
      this.scene.player.speed /= this.current.effects.speed_multiplier;
      this.scene.player.jumpPower /= this.current.effects.jump_multiplier;
    }

    // Remove visual
    this.removeVisual();

    // Clear timer
    if (this.timer) this.timer.remove();

    this.current = null;
  }

  canDestroy(obstacleType) {
    if (!this.current) return false;
    return this.current.destroys.includes(obstacleType);
  }

  onTrigger() {
    if (!this.current) return;
    if (this.current.activation !== 'trigger_button') return;

    // Handle triggered abilities (Mighty Bite)
    const obstacles = this.scene.obstacles.getChildren();
    obstacles.forEach(obstacle => {
      if (this.isInRange(obstacle) && this.canDestroy(obstacle.type)) {
        obstacle.destroy();
        this.scene.sound.play(this.current.sound.on_destroy);
      }
    });
  }
}
```

### Obstacle Collision Detection

```javascript
function checkCollision(player, obstacle, mutationManager) {
  // If mutation can destroy this obstacle type
  if (mutationManager.canDestroy(obstacle.type)) {
    const mutation = mutationManager.current;

    // Passive destroyer (Tail Whip)
    if (mutation.behavior.type === 'passive_destroyer' &&
        mutation.behavior.on_contact) {
      obstacle.destroy();
      scene.sound.play(mutation.sound.on_destroy);
      return; // No collision damage
    }

    // Single-use destroyer (Horned Charge)
    if (mutation.behavior.type === 'single_use_destroyer' &&
        mutation.behavior.expires_on_hit) {
      obstacle.destroy();
      scene.sound.play(mutation.sound.on_destroy);
      mutationManager.removeMutation();
      return; // No collision damage
    }
  }

  // If we get here, mutation doesn't apply - player takes damage
  player.die();
}
```

### Spawning Mutations Based on Biome

```javascript
function spawnRandomMutation(biome) {
  const pools = mutationsData.biome_mutation_pools[biome];
  const spawnRoll = Math.random();

  if (spawnRoll > mutationsData.spawn_rates.mutation_spawn_chance) {
    return; // Don't spawn
  }

  // Determine rarity
  const rarityRoll = Math.random();
  const weights = mutationsData.spawn_rates.rarity_weights;

  let rarity;
  if (rarityRoll < weights.common) {
    rarity = 'common';
  } else if (rarityRoll < weights.common + weights.uncommon) {
    rarity = 'uncommon';
  } else {
    rarity = 'rare';
  }

  // Pick random mutation of that rarity
  const availableMutations = pools[rarity];
  const mutationId = Phaser.Utils.Array.GetRandom(availableMutations);

  // Spawn collectible
  const x = this.cameras.main.scrollX + 800; // Ahead of player
  const y = 400; // Ground level
  const collectible = this.add.sprite(x, y, 'dna_' + mutationId);
  collectible.mutationId = mutationId;
}
```

---

## Adding New Mutations

To add a new mutation, simply add an entry to `mutations.json`:

```json
{
  "id": "shell_armor",
  "name": "Shell Armor",
  "dinosaur": "Ankylosaurus",
  "rarity": "rare",
  "duration": 5000,
  "activation": "auto_on_pickup",
  "destroys": [],
  "behavior": {
    "type": "damage_shield",
    "absorbs_hits": 1
  },
  "effects": {
    "speed_multiplier": 0.8,
    "jump_multiplier": 1.0
  },
  "visual": {
    "sprite": "shell_overlay",
    "particle_effect": "sparkle_shield",
    "screen_tint": "#4682B4"
  },
  "sound": {
    "activation": "shield_up",
    "on_absorb": "shield_block"
  },
  "biomes": ["desert", "volcano"]
}
```

Then add the behavior handler in your code:
```javascript
// In MutationManager
if (mutation.behavior.type === 'damage_shield') {
  this.scene.player.invulnerable = true;
  this.scene.player.hitsAbsorbed = 0;
  this.scene.player.maxHitsAbsorbed = mutation.behavior.absorbs_hits;
}
```

---

## MVP Implementation Checklist

### Phase 1: Core System
- [ ] Load mutations.json
- [ ] Create MutationManager class
- [ ] Implement mutation replacement (new replaces old)
- [ ] Add duration timers
- [ ] Visual feedback system (sprite swapping)

### Phase 2: Mutation Types
- [ ] **Tail Whip** - passive destroyer (all obstacles)
- [ ] **Mighty Bite** - triggered destroyer (rocks only)
- [ ] **Horned Charge** - single-use destroyer (rocks only)
- [ ] **Raptor Legs** - stat modifier (speed + jump)
- [ ] **Long Neck** - camera modifier (zoom out)
- [ ] **Glide** - physics modifier (slow fall)

### Phase 3: Obstacles
- [ ] Define obstacle types in JSON
- [ ] Implement collision detection per mutation
- [ ] Add visual destruction effects

### Phase 4: Spawning
- [ ] Biome-based mutation pools
- [ ] Rarity system
- [ ] Spawn rate balancing

---

## Balancing Tips

### Rarity Guidelines
- **Common (60%)**: Situational or requires skill (Mighty Bite, Raptor Legs)
- **Uncommon (30%)**: Strong utility (Long Neck, Glide)
- **Rare (10%)**: Overpowered (Tail Whip destroys everything)

### Duration Balancing
- **Universal destroyers**: Short duration (5-8s)
- **Limited destroyers**: Medium duration (8-10s)
- **Utility/movement**: Longer duration (10-12s)

### Testing Checklist
- [ ] Can player complete difficult sections with each mutation?
- [ ] Is Tail Whip rare enough to feel special?
- [ ] Does Mighty Bite trigger feel responsive?
- [ ] Is Horned Charge worth picking up (single-use trade-off)?
- [ ] Do mobility mutations feel fun at high speed?

---

## Future Expansion Hooks

The JSON structure is ready for:
- **Stacking mutations**: Change `removeMutation()` to add to array instead
- **Cooldowns**: Add `cooldown` property to mutations
- **Upgrade trees**: Add `tier` and `upgrades_to` properties
- **Combo effects**: Add `combo_with` array
- **Persistence**: Add `unlocked` boolean for progression

**Example combo expansion:**
```json
{
  "id": "sky_sprint",
  "combo_of": ["glide", "raptor_legs"],
  "effects": {
    "speed_multiplier": 1.5,
    "fall_speed_multiplier": 0.1
  }
}
```
