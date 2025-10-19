import Phaser from 'phaser';
import { SCENES, ASSETS } from '../config/Constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload() {
    // Load JSON data
    this.load.json(ASSETS.MUTATIONS_JSON, '/mutations.json');

    // TODO: Load sprites when ready
    // this.load.image(ASSETS.PLAYER, '/public/assets/sprites/player.png');
    // this.load.image(ASSETS.GROUND, '/public/assets/sprites/ground.png');
    // this.load.image(ASSETS.OBSTACLE_ROCK, '/public/assets/sprites/rock.png');
    // this.load.image(ASSETS.OBSTACLE_TREE, '/public/assets/sprites/tree.png');
    // this.load.image(ASSETS.OBSTACLE_METEOR, '/public/assets/sprites/meteor.png');
    // this.load.image(ASSETS.DNA, '/public/assets/sprites/dna.png');

    // TODO: Load audio when ready
    // this.load.audio('jump', '/public/assets/audio/jump.mp3');
    // this.load.audio('collect', '/public/assets/audio/collect.mp3');
    // this.load.audio('game_over', '/public/assets/audio/game_over.mp3');
  }

  create() {
    // Store mutations data globally
    this.registry.set('mutationsData', this.cache.json.get(ASSETS.MUTATIONS_JSON));

    // Move to menu scene
    this.scene.start(SCENES.MENU);
  }
}
