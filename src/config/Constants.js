// Game Constants
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const GROUND_HEIGHT = 600;

// Player Constants
export const PLAYER_START_X = 200;
export const PLAYER_START_Y = GROUND_HEIGHT - 50;
export const PLAYER_BASE_SPEED = 300;
export const PLAYER_JUMP_VELOCITY = -800;
export const PLAYER_DOUBLE_JUMP_VELOCITY = -700;

// Difficulty Scaling
export const BASE_SPEED = 300;
export const MAX_SPEED = 800;
export const SPEED_INCREMENT = 0.0001; // Per distance unit
export const BASE_OBSTACLE_FREQUENCY = 2000; // Milliseconds between spawns
export const MIN_OBSTACLE_FREQUENCY = 800;
export const FREQUENCY_DECREASE = 0.0005;

// Mutation Constants
export const MUTATION_SPAWN_CHANCE = 0.15;
export const DNA_SPAWN_CHANCE = 0.3;

// Score Constants
export const SCORE_PER_METER = 10;
export const SCORE_PER_DNA = 50;

// Biomes
export const BIOMES = {
  DESERT: 'desert',
  FOREST: 'forest',
  VOLCANO: 'volcano'
};

// Scene Keys
export const SCENES = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  MENU: 'MenuScene',
  GAME: 'GameScene',
  GAME_OVER: 'GameOverScene'
};

// Asset Keys
export const ASSETS = {
  PLAYER: 'player',
  GROUND: 'ground',
  OBSTACLE_ROCK: 'obstacle_rock',
  OBSTACLE_TREE: 'obstacle_tree',
  OBSTACLE_METEOR: 'obstacle_meteor',
  DNA: 'dna',
  MUTATIONS_JSON: 'mutations'
};

// Storage Keys
export const STORAGE_KEYS = {
  HIGH_SCORE: 'dino_runner_high_score',
  UNLOCKED_MUTATIONS: 'dino_runner_unlocked_mutations'
};
