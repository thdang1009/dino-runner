export default class MutationManager {
  constructor(scene, mutationsData) {
    this.scene = scene;
    this.data = mutationsData;
    this.currentMutation = null;
    this.timer = null;
    this.timeRemaining = 0;
  }

  applyMutation(mutationId) {
    // Remove current mutation if exists
    if (this.currentMutation) {
      this.removeMutation();
    }

    // Find mutation data
    const mutation = this.data.mutations.find(m => m.id === mutationId);
    if (!mutation) {
      console.warn(`Mutation ${mutationId} not found`);
      return;
    }

    console.log(`Applying mutation: ${mutation.name}`);
    this.currentMutation = mutation;
    this.timeRemaining = mutation.duration;

    // Apply effects based on mutation type
    this.applyEffects(mutation);

    // Apply visual changes
    this.applyVisual(mutation.visual);

    // TODO: Play activation sound
    // this.scene.sound.play(mutation.sound.activation);

    // Start timer for mutation duration
    this.startTimer(mutation.duration);
  }

  applyEffects(mutation) {
    const player = this.scene.player;

    // Apply stat modifiers
    if (mutation.effects.speed_multiplier !== 1.0) {
      player.applySpeedMultiplier(mutation.effects.speed_multiplier);
    }

    if (mutation.effects.jump_multiplier !== 1.0) {
      player.applyJumpMultiplier(mutation.effects.jump_multiplier);
    }

    // Handle specific behavior types
    switch (mutation.behavior.type) {
      case 'camera_modifier':
        // Zoom out camera
        if (mutation.behavior.camera_zoom) {
          this.scene.cameras.main.setZoom(mutation.behavior.camera_zoom);
        }
        break;

      case 'physics_modifier':
        // Store original gravity for later restoration
        this.originalGravity = player.body.gravity.y;
        if (mutation.behavior.gravity_multiplier) {
          player.setGravityY(this.originalGravity * mutation.behavior.gravity_multiplier);
        }
        break;
    }
  }

  applyVisual(visual) {
    // TODO: Apply visual effects when sprites are ready
    // - Change player sprite/tint
    // - Add particle effects
    // - Apply screen tint
    if (visual && visual.screen_tint) {
      // this.scene.cameras.main.setTint(Phaser.Display.Color.HexStringToColor(visual.screen_tint).color);
    }
  }

  startTimer(duration) {
    // Clear existing timer
    if (this.timer) {
      this.timer.remove();
    }

    // Create new timer
    this.timer = this.scene.time.addEvent({
      delay: duration,
      callback: this.removeMutation,
      callbackScope: this
    });
  }

  removeMutation() {
    if (!this.currentMutation) return;

    console.log(`Removing mutation: ${this.currentMutation.name}`);

    const player = this.scene.player;

    // Reset player stats
    player.resetStats();

    // Reset camera
    this.scene.cameras.main.setZoom(1);

    // Reset physics modifiers
    if (this.originalGravity !== undefined) {
      player.setGravityY(this.originalGravity);
      this.originalGravity = undefined;
    }

    // Remove visual effects
    this.removeVisual();

    // Clear timer
    if (this.timer) {
      this.timer.remove();
      this.timer = null;
    }

    this.currentMutation = null;
    this.timeRemaining = 0;
  }

  removeVisual() {
    // TODO: Remove visual effects
    // this.scene.cameras.main.clearTint();
  }

  canDestroy(obstacleType) {
    if (!this.currentMutation) return false;

    // Check if current mutation can destroy this obstacle type
    return this.currentMutation.destroys.includes(obstacleType);
  }

  handleObstacleDestroy(obstacle) {
    if (!this.currentMutation) return;

    const mutation = this.currentMutation;

    // Play destroy sound
    // TODO: this.scene.sound.play(mutation.sound.on_destroy);

    // Handle single-use mutations (like Horned Charge)
    if (mutation.behavior.type === 'single_use_destroyer' && mutation.behavior.expires_on_hit) {
      console.log(`${mutation.name} expired after destroying obstacle`);
      this.removeMutation();
    }
  }

  onTrigger() {
    if (!this.currentMutation) return;
    if (this.currentMutation.activation !== 'trigger_button') return;

    console.log(`Triggering ${this.currentMutation.name}`);

    // Handle triggered abilities (like Mighty Bite)
    const obstacles = this.scene.obstacleManager.obstacles.getChildren();
    const player = this.scene.player;

    obstacles.forEach(obstacle => {
      // Check if obstacle is in range
      const distance = Math.abs(obstacle.x - player.x);
      const range = this.currentMutation.behavior.range || 100;

      if (distance < range && this.canDestroy(obstacle.obstacleType)) {
        console.log(`Destroying ${obstacle.obstacleType} with ${this.currentMutation.name}`);
        obstacle.destroy();
        this.scene.score += 25; // Bonus for destroying
        // TODO: Play destroy sound
      }
    });
  }

  update() {
    // Update time remaining
    if (this.currentMutation && this.timer) {
      this.timeRemaining = this.timer.getRemaining();
    }
  }
}
