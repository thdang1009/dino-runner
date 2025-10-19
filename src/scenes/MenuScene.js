import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, STORAGE_KEYS } from '../config/Constants.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create() {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Title
    const title = this.add.text(centerX, centerY - 150, 'DINO RUNNER', {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 8
    });
    title.setOrigin(0.5);

    // Tagline
    const tagline = this.add.text(centerX, centerY - 80, 'Run through extinction — evolve or perish', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    tagline.setOrigin(0.5);

    // Start button
    const startButton = this.add.text(centerX, centerY + 50, 'START GAME', {
      fontSize: '36px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      backgroundColor: '#ff6b6b',
      padding: { x: 30, y: 15 }
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setScale(1.1);
    });

    startButton.on('pointerout', () => {
      startButton.setScale(1);
    });

    startButton.on('pointerdown', () => {
      this.scene.start(SCENES.GAME);
    });

    // High score
    const highScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || 0;
    const highScoreText = this.add.text(centerX, centerY + 150, `High Score: ${highScore}`, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    highScoreText.setOrigin(0.5);

    // Controls info
    const controlsText = this.add.text(centerX, GAME_HEIGHT - 50, 'Controls: SPACE or UP to Jump', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    controlsText.setOrigin(0.5);

    // Keyboard input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start(SCENES.GAME);
    });
  }
}
