# 🦖 Dino Runner

> Run through extinction — evolve or perish.

A fast-paced endless runner game where you control a dinosaur escaping extinction, collecting mutations to gain powerful abilities. Built with PhaserJS.

## 🎮 Features

- **Endless Runner Gameplay**: Run, jump, and survive as long as possible
- **Mutation System**: Collect DNA to gain temporary dinosaur abilities
  - Tail Whip (Ankylosaurus) - Destroys all obstacles
  - Mighty Bite (T-Rex) - Break rocks with triggered attacks
  - Horned Charge (Triceratops) - Single-use rock destroyer
  - Raptor Legs (Velociraptor) - Enhanced speed and jumping
  - Long Neck (Brachiosaurus) - Extended vision range
  - Glide (Pterosaur) - Slow fall after jumping
- **Progressive Difficulty**: Game speed and obstacle variety increase with distance
- **Local High Score**: Track your best runs

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd dino-runner

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open automatically at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎯 Controls

- **SPACE** or **UP ARROW** - Jump
- **SPACE** (in air) - Double Jump
- **ESC** - Return to menu (on game over screen)

## 📁 Project Structure

```
dino-runner/
├── docs/                      # Documentation
│   ├── PRD.md                # Product Requirements Document
│   └── MUTATIONS_GUIDE.md    # Mutation system implementation guide
├── public/                    # Static assets
│   ├── assets/
│   │   ├── sprites/          # Game sprites (TODO)
│   │   ├── audio/            # Sound effects & music (TODO)
│   │   └── fonts/            # Custom fonts (TODO)
│   └── mutations.json        # Mutation configuration
├── src/
│   ├── config/               # Game configuration
│   │   ├── GameConfig.js     # Phaser game config
│   │   └── Constants.js      # Game constants
│   ├── scenes/               # Phaser scenes
│   │   ├── BootScene.js      # Initial boot
│   │   ├── PreloadScene.js   # Asset loading
│   │   ├── MenuScene.js      # Main menu
│   │   ├── GameScene.js      # Main gameplay
│   │   └── GameOverScene.js  # Game over screen
│   ├── entities/             # Game entities
│   │   └── Player.js         # Player character
│   ├── managers/             # Game systems
│   │   ├── MutationManager.js    # Mutation handling
│   │   └── ObstacleManager.js    # Obstacle spawning
│   └── main.js               # Entry point
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Project dependencies
```

## 🛠️ Development Roadmap

### ✅ MVP (Current)
- [x] Project setup with Vite + Phaser
- [x] Basic game scenes (Menu, Game, GameOver)
- [x] Player movement and jumping
- [x] Obstacle spawning system
- [x] Mutation manager architecture
- [x] Score tracking and high score
- [ ] Add actual sprite assets
- [ ] Add sound effects and music
- [ ] Implement DNA collectibles
- [ ] Complete mutation visual effects
- [ ] Polish and balancing

### 🔮 Phase 2 (Future)
- [ ] Multiple biomes with transitions
- [ ] Mutation combos (stacking abilities)
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Cosmetic unlocks
- [ ] Leaderboard integration
- [ ] Mobile app deployment (PWA)

## 🎨 Adding Assets

Currently, the game uses placeholder graphics. To add your own assets:

### Sprites
Place sprite images in `public/assets/sprites/` and update the preload in [PreloadScene.js](src/scenes/PreloadScene.js):

```javascript
this.load.image('player', '/assets/sprites/player.png');
this.load.image('obstacle_rock', '/assets/sprites/rock.png');
// etc.
```

### Audio
Place audio files in `public/assets/audio/` and load them:

```javascript
this.load.audio('jump', '/assets/audio/jump.mp3');
this.load.audio('collect', '/assets/audio/collect.mp3');
```

## 🧬 Mutation System

The mutation system is data-driven via [mutations.json](public/mutations.json). To add new mutations, simply add entries to the JSON file. See [MUTATIONS_GUIDE.md](docs/MUTATIONS_GUIDE.md) for detailed implementation guide.

## 📊 Performance Targets

- **Load time**: < 2 seconds
- **Memory usage**: < 30MB
- **Target FPS**: 60
- **Supported devices**: Desktop and mobile browsers

## 🤝 Contributing

This is a personal project, but feel free to fork and create your own version!

## 📄 License

See [LICENSE.txt](LICENSE.txt) for details.

## 🎓 Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Game Design Document](docs/PRD.md)
- [Mutation Implementation Guide](docs/MUTATIONS_GUIDE.md)

---

Made with ❤️ and extinction anxiety
