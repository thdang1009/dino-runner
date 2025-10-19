import Phaser from 'phaser';
import {
  SCENES,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  PLAYER_START_X,
  PLAYER_START_Y,
  BASE_SPEED,
  MAX_SPEED,
  SPEED_INCREMENT
} from '../config/Constants.js';
import Player from '../entities/Player.js';
import ObstacleManager from '../managers/ObstacleManager.js';
import MutationManager from '../managers/MutationManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME });
  }

  create() {
    // Initialize game state
    this.gameSpeed = BASE_SPEED;
    this.distance = 0;
    this.score = 0;
    this.isGameOver = false;

    // Get mutations data
    this.mutationsData = this.registry.get('mutationsData');

    // Create ground
    this.createGround();

    // Create player
    this.player = new Player(this, PLAYER_START_X, PLAYER_START_Y);

    // Create managers
    this.obstacleManager = new ObstacleManager(this);
    this.mutationManager = new MutationManager(this, this.mutationsData);

    // Create UI
    this.createUI();

    // Set up input
    this.setupInput();

    // Set up collision
    this.setupCollisions();
  }

  createGround() {
    // Create scrolling ground
    this.ground = this.add.graphics();
    this.ground.fillStyle(0x8B4513, 1);
    this.ground.fillRect(0, GROUND_HEIGHT, GAME_WIDTH, GAME_HEIGHT - GROUND_HEIGHT);

    // Add ground line
    this.ground.lineStyle(4, 0x654321, 1);
    this.ground.lineBetween(0, GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);
  }

  createUI() {
    // Score text
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });

    // Distance text
    this.distanceText = this.add.text(20, 60, 'Distance: 0m', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });

    // Speed text (for debug)
    this.speedText = this.add.text(20, 100, `Speed: ${this.gameSpeed.toFixed(0)}`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });

    // Mutation indicator
    this.mutationText = this.add.text(GAME_WIDTH - 20, 20, '', {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.mutationText.setOrigin(1, 0);
  }

  setupInput() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Touch/click controls
    this.input.on('pointerdown', () => {
      if (!this.isGameOver) {
        this.player.jump();
      }
    });
  }

  setupCollisions() {
    // Collision between player and obstacles
    this.physics.add.overlap(
      this.player,
      this.obstacleManager.obstacles,
      this.handleCollision,
      null,
      this
    );
  }

  handleCollision(player, obstacle) {
    // Check if mutation can destroy this obstacle
    if (this.mutationManager.canDestroy(obstacle.obstacleType)) {
      this.mutationManager.handleObstacleDestroy(obstacle);
      obstacle.destroy();
      this.score += 25; // Bonus for destroying obstacle
      return;
    }

    // Game over
    this.gameOver();
  }

  update(time, delta) {
    if (this.isGameOver) return;

    // Update player
    this.player.update(this.cursors, this.spaceKey);

    // Update distance
    this.distance += (this.gameSpeed * delta) / 1000;

    // Update game speed (progressive difficulty)
    if (this.gameSpeed < MAX_SPEED) {
      this.gameSpeed = Math.min(MAX_SPEED, BASE_SPEED + (this.distance * SPEED_INCREMENT));
    }

    // Update score
    this.score = Math.floor(this.distance * 10);

    // Update obstacles
    this.obstacleManager.update(time, delta, this.gameSpeed, this.distance);

    // Update mutations
    this.mutationManager.update();

    // Update UI
    this.updateUI();
  }

  updateUI() {
    this.scoreText.setText(`Score: ${this.score}`);
    this.distanceText.setText(`Distance: ${Math.floor(this.distance)}m`);
    this.speedText.setText(`Speed: ${this.gameSpeed.toFixed(0)}`);

    if (this.mutationManager.currentMutation) {
      const mutation = this.mutationManager.currentMutation;
      const timeLeft = Math.ceil(this.mutationManager.timeRemaining / 1000);
      this.mutationText.setText(`${mutation.name} (${timeLeft}s)`);
    } else {
      this.mutationText.setText('');
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.physics.pause();

    // Flash screen
    this.cameras.main.flash(500, 255, 0, 0);

    // Show game over text
    const gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'EXTINCTION!', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    });
    gameOverText.setOrigin(0.5);

    // Transition to game over scene
    this.time.delayedCall(2000, () => {
      this.scene.start(SCENES.GAME_OVER, { score: this.score, distance: Math.floor(this.distance) });
    });
  }
}
