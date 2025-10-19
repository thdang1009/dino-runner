import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig.js';

// Remove loading message
const loadingElement = document.querySelector('.loading');
if (loadingElement) {
  loadingElement.style.display = 'none';
}

// Initialize game
const game = new Phaser.Game(GameConfig);

// Global reference for debugging
window.game = game;

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh();
});

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());
