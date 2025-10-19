import Phaser from 'phaser';
import { GROUND_HEIGHT, PLAYER_JUMP_VELOCITY, PLAYER_DOUBLE_JUMP_VELOCITY } from '../config/Constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Create a placeholder rectangle for now (will be replaced with sprite)
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 50, 70);
    graphics.generateTexture('player_temp', 50, 70);
    graphics.destroy();

    super(scene, x, y, 'player_temp');

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics
    this.setCollideWorldBounds(false);
    this.setGravityY(0); // Using world gravity

    // Player state
    this.isOnGround = false;
    this.hasDoubleJump = true;
    this.jumpCount = 0;
    this.maxJumps = 2;

    // Stats (can be modified by mutations)
    this.baseSpeed = 300;
    this.speed = this.baseSpeed;
    this.jumpPower = PLAYER_JUMP_VELOCITY;
    this.doubleJumpPower = PLAYER_DOUBLE_JUMP_VELOCITY;

    // Create ground check
    this.groundY = GROUND_HEIGHT - this.height / 2;
  }

  update(cursors, spaceKey) {
    // Check if on ground
    this.isOnGround = this.y >= this.groundY;

    // Keep player at ground level when landed
    if (this.isOnGround && this.body.velocity.y >= 0) {
      this.y = this.groundY;
      this.setVelocityY(0);
      this.jumpCount = 0; // Reset jump count when on ground
    }

    // Jump input
    if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(spaceKey)) {
      this.jump();
    }
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      if (this.jumpCount === 0) {
        // First jump
        this.setVelocityY(this.jumpPower);
      } else {
        // Double jump
        this.setVelocityY(this.doubleJumpPower);
      }
      this.jumpCount++;

      // TODO: Play jump sound
      // this.scene.sound.play('jump');
    }
  }

  resetStats() {
    this.speed = this.baseSpeed;
    this.jumpPower = PLAYER_JUMP_VELOCITY;
    this.doubleJumpPower = PLAYER_DOUBLE_JUMP_VELOCITY;
  }

  applySpeedMultiplier(multiplier) {
    this.speed = this.baseSpeed * multiplier;
  }

  applyJumpMultiplier(multiplier) {
    this.jumpPower = PLAYER_JUMP_VELOCITY * multiplier;
    this.doubleJumpPower = PLAYER_DOUBLE_JUMP_VELOCITY * multiplier;
  }
}
