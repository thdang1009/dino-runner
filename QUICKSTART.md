# 🚀 Quick Start Guide

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

The game will automatically open at http://localhost:3000

## What You'll See

The game currently runs with **placeholder graphics** (colored rectangles):
- 🟢 Green rectangle = Player (dino)
- ⚫ Gray rectangle = Rock obstacle
- 🟢 Green rectangle = Tree obstacle
- 🔴 Red rectangle = Meteor obstacle

## Current Features Working

✅ Menu screen with high score tracking
✅ Player movement (left/right, jump, double jump)
✅ Progressive difficulty (speed increases with distance)
✅ Obstacle spawning (rocks, trees, meteors)
✅ Collision detection
✅ Score system
✅ Game over screen
✅ Mutation system architecture (ready for implementation)

## Next Steps to Complete MVP

### 1. Add Visual Assets

**Option A: Create Simple Sprites**
Use free tools like:
- [Piskel](https://www.piskelapp.com/) - Pixel art editor
- [Figma](https://www.figma.com/) - Vector graphics
- [Kenney Assets](https://kenney.nl/assets) - Free game assets

Place sprites in:
```
public/assets/sprites/
├── player.png
├── rock.png
├── tree.png
├── meteor.png
└── dna.png
```

Then uncomment the load statements in `src/scenes/PreloadScene.js`

**Option B: Use Placeholder Shapes (Current)**
Keep developing with colored rectangles until you're ready for art.

### 2. Add Sound Effects

**Free Sound Resources:**
- [Freesound.org](https://freesound.org/)
- [OpenGameArt.org](https://opengameart.org/)
- [Zapsplat.com](https://www.zapsplat.com/)

Place audio in:
```
public/assets/audio/
├── jump.mp3
├── collect.mp3
├── game_over.mp3
└── bgm.mp3
```

### 3. Implement DNA Collectibles

Add to `ObstacleManager.js`:
```javascript
spawnDNA() {
  const x = GAME_WIDTH + 50;
  const y = GROUND_HEIGHT - 100; // Float above ground
  const dna = this.dnaGroup.create(x, y, 'dna');
  dna.mutationId = this.selectRandomMutation();
}
```

### 4. Test Mutations

Press the following keys during gameplay (add debug controls):
- **1** - Test Tail Whip mutation
- **2** - Test Mighty Bite
- **3** - Test Raptor Legs

Add to `GameScene.js`:
```javascript
// Debug mutation testing
this.input.keyboard.on('keydown-ONE', () => {
  this.mutationManager.applyMutation('tail_whip');
});
```

## Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Debugging Tips

### Enable Physics Debug
In `src/config/GameConfig.js`:
```javascript
physics: {
  arcade: {
    debug: true  // Shows collision boxes
  }
}
```

### View Game Object in Console
The game instance is available globally:
```javascript
// In browser console
window.game
window.game.scene.scenes[3] // Access GameScene
```

### Check Mutations Data
```javascript
// In browser console during gameplay
window.game.registry.get('mutationsData')
```

## Common Issues

### Game doesn't start
- Check browser console (F12) for errors
- Make sure you ran `npm install`
- Try clearing browser cache

### Mutations not working
- Check `public/mutations.json` is loading
- Look for errors in console
- Verify mutation ID matches JSON

### Performance issues
- Enable production build: `npm run build`
- Check FPS in browser DevTools
- Reduce obstacle spawn rate in Constants.js

## Project Structure at a Glance

```
dino-runner/
├── 📄 README.md              ← Project overview
├── 📄 QUICKSTART.md          ← You are here
├── 📁 docs/
│   ├── PRD.md               ← Full game design
│   └── MUTATIONS_GUIDE.md   ← How mutations work
├── 📁 public/
│   ├── mutations.json       ← Mutation data
│   └── assets/              ← Put sprites/audio here
├── 📁 src/
│   ├── scenes/              ← Game screens
│   ├── entities/            ← Player, enemies, etc.
│   ├── managers/            ← Game systems
│   └── config/              ← Settings
└── 📄 package.json          ← Dependencies
```

## Testing Checklist

Before considering MVP complete:

- [ ] Player can jump and double jump
- [ ] Obstacles spawn and move
- [ ] Collision causes game over
- [ ] Score increases with distance
- [ ] High score saves to localStorage
- [ ] Game speed increases over time
- [ ] At least 2 mutations work (Tail Whip + Raptor Legs)
- [ ] DNA collectibles spawn
- [ ] Picking up DNA applies mutation
- [ ] Mutation timer shows and expires correctly
- [ ] Game is playable on mobile (touch controls)
- [ ] Sounds play (if added)
- [ ] Sprites display (if added)

## Need Help?

1. Check [docs/PRD.md](docs/PRD.md) for game design
2. Check [docs/MUTATIONS_GUIDE.md](docs/MUTATIONS_GUIDE.md) for mutation system
3. Read Phaser docs: https://photonstorm.github.io/phaser3-docs/

---

**Ready to run?**

```bash
npm run dev
```

Happy coding! 🦖
