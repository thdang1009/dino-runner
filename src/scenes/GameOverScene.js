import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, STORAGE_KEYS } from '../config/Constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalDistance = data.distance || 0;
  }

  create() {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Check and update high score
    const previousHighScore = parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE)) || 0;
    const isNewHighScore = this.finalScore > previousHighScore;

    if (isNewHighScore) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, this.finalScore);
    }

    // Title
    const title = this.add.text(centerX, centerY - 200, 'EXTINCTION!', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8
    });
    title.setOrigin(0.5);

    // Score
    const scoreText = this.add.text(centerX, centerY - 100, `Score: ${this.finalScore}`, {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    });
    scoreText.setOrigin(0.5);

    // Distance
    const distanceText = this.add.text(centerX, centerY - 40, `Distance: ${this.finalDistance}m`, {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    distanceText.setOrigin(0.5);

    // High score or new record
    if (isNewHighScore) {
      const newRecordText = this.add.text(centerX, centerY + 20, 'NEW HIGH SCORE!', {
        fontSize: '32px',
        fontFamily: 'Arial Black',
        color: '#FFD700',
        stroke: '#000000',
        strokeThickness: 4
      });
      newRecordText.setOrigin(0.5);

      // Pulse animation
      this.tweens.add({
        targets: newRecordText,
        scale: { from: 1, to: 1.2 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      const highScoreText = this.add.text(centerX, centerY + 20, `High Score: ${previousHighScore}`, {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      });
      highScoreText.setOrigin(0.5);
    }

    // Retry button
    const retryButton = this.add.text(centerX, centerY + 100, 'RETRY', {
      fontSize: '36px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 40, y: 15 }
    });
    retryButton.setOrigin(0.5);
    retryButton.setInteractive({ useHandCursor: true });

    retryButton.on('pointerover', () => {
      retryButton.setScale(1.1);
    });

    retryButton.on('pointerout', () => {
      retryButton.setScale(1);
    });

    retryButton.on('pointerdown', () => {
      this.scene.start(SCENES.GAME);
    });

    // Menu button
    const menuButton = this.add.text(centerX, centerY + 170, 'MAIN MENU', {
      fontSize: '28px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      backgroundColor: '#2196F3',
      padding: { x: 30, y: 10 }
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });

    menuButton.on('pointerover', () => {
      menuButton.setScale(1.1);
    });

    menuButton.on('pointerout', () => {
      menuButton.setScale(1);
    });

    menuButton.on('pointerdown', () => {
      this.scene.start(SCENES.MENU);
    });

    // Keyboard shortcuts
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SCENES.GAME);
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start(SCENES.MENU);
    });
  }
}
