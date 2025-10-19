import Phaser from 'phaser';
import { GAME_WIDTH, GROUND_HEIGHT, BASE_OBSTACLE_FREQUENCY, MIN_OBSTACLE_FREQUENCY } from '../config/Constants.js';

export default class ObstacleManager {
  constructor(scene) {
    this.scene = scene;

    // Create obstacle group
    this.obstacles = this.scene.physics.add.group();

    // Spawn timing
    this.lastSpawnTime = 0;
    this.spawnFrequency = BASE_OBSTACLE_FREQUENCY;

    // Obstacle types and their properties
    this.obstacleTypes = {
      rock: {
        width: 40,
        height: 40,
        color: 0x808080,
        canJumpOver: true
      },
      tree: {
        width: 30,
        height: 100,
        color: 0x228B22,
        canJumpOver: false
      },
      meteor: {
        width: 50,
        height: 50,
        color: 0xFF4500,
        canJumpOver: false,
        falling: true
      }
    };

    // Create placeholder textures
    this.createPlaceholderTextures();
  }

  createPlaceholderTextures() {
    Object.keys(this.obstacleTypes).forEach(type => {
      const props = this.obstacleTypes[type];
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(props.color, 1);
      graphics.fillRect(0, 0, props.width, props.height);
      graphics.generateTexture(`obstacle_${type}_temp`, props.width, props.height);
      graphics.destroy();
    });
  }

  update(time, delta, gameSpeed, distance) {
    // Update spawn frequency based on distance
    this.spawnFrequency = Math.max(
      MIN_OBSTACLE_FREQUENCY,
      BASE_OBSTACLE_FREQUENCY - (distance * 0.5)
    );

    // Spawn new obstacles
    if (time - this.lastSpawnTime > this.spawnFrequency) {
      this.spawnObstacle(distance);
      this.lastSpawnTime = time;
    }

    // Move and clean up obstacles
    this.obstacles.getChildren().forEach(obstacle => {
      // Move obstacle left
      obstacle.x -= (gameSpeed * delta) / 1000;

      // Handle falling meteors
      if (obstacle.falling && obstacle.y < obstacle.targetY) {
        obstacle.y += (300 * delta) / 1000; // Fall speed
      }

      // Remove obstacles that are off-screen
      if (obstacle.x < -100) {
        obstacle.destroy();
      }
    });
  }

  spawnObstacle(distance) {
    // Determine which obstacle types are available based on distance
    const availableTypes = this.getAvailableObstacleTypes(distance);
    const type = Phaser.Utils.Array.GetRandom(availableTypes);
    const props = this.obstacleTypes[type];

    // Spawn position
    const x = GAME_WIDTH + 50;
    let y = GROUND_HEIGHT - props.height / 2;

    // Create obstacle
    const obstacle = this.obstacles.create(x, y, `obstacle_${type}_temp`);
    obstacle.setImmovable(true);
    obstacle.obstacleType = type;
    obstacle.body.allowGravity = false;

    // Special handling for meteors (falling from sky)
    if (props.falling) {
      obstacle.falling = true;
      obstacle.y = 0; // Start from top
      obstacle.targetY = y; // Fall to ground level
    }

    return obstacle;
  }

  getAvailableObstacleTypes(distance) {
    // Start with rocks only
    if (distance < 500) {
      return ['rock'];
    }
    // Add trees
    else if (distance < 1000) {
      return ['rock', 'tree'];
    }
    // Add meteors
    else {
      return ['rock', 'tree', 'meteor'];
    }
  }

  clear() {
    this.obstacles.clear(true, true);
  }
}
