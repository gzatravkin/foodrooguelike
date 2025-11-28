# Architecture Guide

## Design Philosophy

This is a **2D top-view action roguelike** built on **Phaser 3 game engine** with **modular architecture** and **real-time game systems**. The core principle: **leverage Phaser's powerful features while maintaining clean separation between game logic, rendering, and data**.

## Core Architecture

### Game Engine: Phaser 3

The game is powered by Phaser 3 (v3.80.1), a mature HTML5 game framework that provides:
- Scene management
- Arcade Physics system
- Sprite rendering with WebGL/Canvas
- Input handling (keyboard, mouse, touch)
- Camera system with follow and bounds
- Asset loading and management
- Animation system
- Particle effects

### Main Entry Point

```typescript
// src/main.ts
class Game {
  private phaserGame: Phaser.Game;

  async init() {
    // Initialize plugins and data
    initializeAllPlugins();
    await dataLoader.loadAll();

    // Create Phaser game with scenes
    const config = {
      ...phaserConfig,
      scene: [PreloadScene, GameScene, GlobalMapScene],
    };

    this.phaserGame = new Phaser.Game(config);
  }
}
```

### Layer Structure

```
┌─────────────────────────────────────┐
│         Phaser 3 Engine             │
│  (Rendering, Physics, Input, etc.)  │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Scene Layer                 │
│  (GameScene, GlobalMapScene, etc.)  │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│      Phaser Game Objects            │
│  (PhaserPlayer, PhaserEnemy, etc.)  │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Systems Layer               │
│  (MapSystem, CombatSystem, etc.)    │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Data Layer                  │
│  (GameState, EntityFactory, JSON)   │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Preact UI Overlay           │
│  (Screens, Menus, Components)       │
└─────────────────────────────────────┘
```

## Core Systems

### 1. Phaser Scene System

Scenes are the primary organizational unit in Phaser 3:

```typescript
// src/scenes/PreloadScene.ts
export class PreloadScene extends Phaser.Scene {
  preload() {
    // Load all game assets (SVG sprites, audio, etc.)
  }

  create() {
    // Start the main game scene
    this.scene.start('GameScene');
  }
}

// src/scenes/GameScene.ts
export class GameScene extends Phaser.Scene {
  create() {
    // Initialize player, enemies, physics, input
  }

  update(time: number, delta: number) {
    // Update game logic each frame
  }
}
```

**Active Scenes:**
- **PreloadScene**: Asset loading with progress bar
- **GameScene**: Main gameplay (dungeon exploration, combat)
- **GlobalMapScene**: World map for biome selection

### 2. Phaser Physics System

Using Arcade Physics for top-down gameplay:

```typescript
// Physics configuration
physics: {
  default: 'arcade',
  arcade: {
    gravity: { x: 0, y: 0 }, // No gravity for top-down
    debug: false,
  },
}
```

**Features:**
- Collision detection between sprites
- Velocity-based movement
- World bounds
- Overlap detection for projectile hits

### 3. Phaser Sprite System

Game entities extend Phaser's sprite classes:

```typescript
// src/entities/PhaserPlayer.ts
export class PhaserPlayer extends Phaser.Physics.Arcade.Sprite {
  public weapon: Weapon | null;
  public health: number;
  public moveSpeed: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update(deltaTime: number) {
    // Update player logic
  }
}
```

**Entity Classes:**
- **PhaserPlayer**: Player character with weapons and abilities
- **PhaserEnemy**: AI-controlled enemies with behavior patterns
- **PhaserProjectile**: Bullets, arrows, magic bolts

### 4. Camera System

Phaser's camera follows the player:

```typescript
// In GameScene.create()
this.cameras.main.startFollow(this.player);
this.cameras.main.setBounds(0, 0, 2000, 2000);
```

**Features:**
- Smooth camera following
- World bounds
- Automatic coordinate conversion

### 5. Input System

Phaser handles all input:

```typescript
// Keyboard
this.cursors = this.input.keyboard.createCursorKeys();
this.wasdKeys = {
  W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
  // ...
};

// Mouse
this.input.on('pointerdown', (pointer) => {
  this.handlePlayerAttack(pointer);
});
```

**Supported Input:**
- WASD/Arrow keys for movement
- Mouse click for shooting
- Space for dash ability
- ESC for menu
- Touch controls (mobile)

### 6. Asset Loading

SVG assets converted to Phaser textures:

```typescript
// src/scenes/PreloadScene.ts
private loadSVGAssets() {
  const svgAssets = [
    { key: 'player', svg: createPlayerSVG() },
    { key: 'slime', svg: createSlimeSVG() },
    // ...
  ];

  svgAssets.forEach(({ key, svg }) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    this.load.image(key, url);
  });
}
```

### 7. Hybrid UI System

Phaser renders the game, Preact renders the UI overlay:

```typescript
// HTML structure
<div id="game-container">
  <div id="game-canvas-container"></div>  <!-- Phaser injects here -->
  <div id="game-ui"></div>                <!-- Preact UI overlay -->
</div>
```

**UI Screens (Preact):**
- Base/Restaurant management
- Cooking screen
- Shop screen
- Upgrades and training
- Settings and menus

**Game Screens (Phaser):**
- Gameplay (combat, exploration)
- World map

### 8. State Management

GameState singleton manages all game data:

```typescript
// src/core/GameState.ts
class GameState {
  private state: GameData;

  setScreen(screen: string) {
    this.state.currentScreen = screen;
    eventBus.emit('screen:changed', screen);
  }

  addGold(amount: number) { ... }
  equipWeapon(weaponId: string) { ... }
  // ... more methods
}
```

**State includes:**
- Player stats and equipment
- Inventory and gold
- Discovered recipes
- Restaurant progression
- Training skills
- Expedition progress

### 9. Event Bus

Cross-component communication:

```typescript
// src/core/EventBus.ts
eventBus.on('screen:changed', (screenName) => {
  if (screenName === 'game') {
    this.scene.resume();
  } else {
    this.scene.pause();
  }
});
```

**Key Events:**
- screen:changed
- inventory:changed
- recipe:discovered
- weapon:equipped

## Game Loop

Phaser manages the game loop automatically:

```typescript
// GameScene.update() called every frame
update(time: number, delta: number) {
  const deltaTime = delta / 1000; // Convert to seconds

  // Update player
  this.player.update(deltaTime);

  // Update enemies
  this.enemies.forEach(enemy => {
    enemy.update(deltaTime, this.player.x, this.player.y);
  });

  // Update projectiles
  this.projectiles.forEach(projectile => {
    projectile.update(deltaTime);
  });
}
```

**Frame Rate:**
- Target: 60 FPS
- Delta time: Dynamic (handles variable frame rates)
- Pause/Resume: Scene-based

## Key Features

### Combat System

Real-time combat with projectiles:

```typescript
private handlePlayerAttack(pointer: Phaser.Input.Pointer) {
  const angle = Phaser.Math.Angle.Between(
    this.player.x, this.player.y,
    worldPoint.x, worldPoint.y
  );

  const projectile = new PhaserProjectile(
    this, this.player.x, this.player.y,
    'bullet', angle, speed, damage, 'player'
  );

  // Setup collision with enemies
  this.physics.add.overlap(projectile, enemy, handleHit);
}
```

### AI System

Enemy AI with behavior states:

```typescript
update(deltaTime: number, playerX: number, playerY: number) {
  const distance = Phaser.Math.Distance.Between(
    this.x, this.y, playerX, playerY
  );

  if (distance < this.detectionRange) {
    if (distance > this.attackRange) {
      this.aiState = 'chase';
      this.moveTowardsPlayer(playerX, playerY);
    } else {
      this.aiState = 'attack';
    }
  }
}
```

### Dash Ability

Physics-based dash with cooldown:

```typescript
private handlePlayerDash() {
  if (this.player.dashCharges <= 0) return;

  this.player.dashDuration = 0.2;
  this.player.dashCharges -= 1;

  // Apply dash velocity in update()
  if (this.player.isDashing) {
    const dashSpeed = this.player.moveSpeed * 3.0;
    this.player.setVelocity(
      this.player.dashDirection.x * dashSpeed,
      this.player.dashDirection.y * dashSpeed
    );
  }
}
```

## File Structure

```
src/
├── main.ts                    # Entry point (Phaser initialization)
├── core/
│   ├── PhaserConfig.ts       # Phaser game configuration
│   ├── GameState.ts          # Global state management
│   ├── EventBus.ts           # Event system
│   ├── InputManager.ts       # Legacy input (still used for utils)
│   └── DataLoader.ts         # JSON data loading
├── scenes/
│   ├── PreloadScene.ts       # Asset loading scene
│   ├── GameScene.ts          # Main gameplay scene
│   └── GlobalMapScene.ts     # World map scene
├── entities/
│   ├── PhaserPlayer.ts       # Player sprite
│   ├── PhaserEnemy.ts        # Enemy sprite
│   ├── PhaserProjectile.ts   # Projectile sprite
│   └── types.ts              # Type definitions
├── systems/
│   ├── MapSystem.ts          # Tile map management
│   ├── CombatSystem.ts       # Combat calculations
│   └── DungeonGenerator.ts   # Procedural generation
├── rendering/
│   ├── SVGArt.ts             # SVG sprite generation
│   ├── SVGPlayer.ts          # Player sprite
│   ├── SVGEnemies*.ts        # Enemy sprites
│   └── SVGWeapons.ts         # Weapon sprites
├── components/               # Preact UI components
│   ├── App.tsx               # Root UI component
│   └── screens/              # UI screens
└── data/                     # JSON data files
```

## Performance Considerations

### Phaser Optimizations
- WebGL renderer by default (falls back to Canvas)
- Sprite pooling for projectiles and particles
- Only update visible sprites
- Scene pause/resume for UI screens

### Build Optimizations
- Vite bundler with code splitting
- TypeScript strict mode
- Tree shaking for unused code
- Minification in production

## Development Workflow

### Running Locally
```bash
npm run dev           # Start dev server (Vite)
npm run type-check    # TypeScript validation
npm run build         # Production build
```

### Adding New Content

**New Enemy Type:**
1. Add SVG generator in `rendering/SVGEnemies*.ts`
2. Add data in `data/enemies.json`
3. Preload texture in `PreloadScene`
4. Spawn in `GameScene` using `PhaserEnemy`

**New Weapon:**
1. Add SVG in `rendering/SVGWeapons.ts`
2. Add data in `data/weapons.json`
3. Use in `PhaserPlayer.weapon`

**New Scene:**
1. Create scene class extending `Phaser.Scene`
2. Add to config in `main.ts`
3. Implement `create()` and `update()` methods

## Migration Notes

This game was migrated from a custom Canvas-based engine to Phaser 3:

**What Changed:**
- Custom game loop → Phaser scene lifecycle
- Custom rendering → Phaser sprites and graphics
- Manual collision → Phaser physics system
- Custom camera → Phaser camera
- Custom input → Phaser input system

**What Stayed:**
- GameState and data management
- Preact UI overlay
- JSON data structure
- Plugin system
- SVG art generation
- Save/load system

**Benefits:**
- Better performance with WebGL
- Built-in physics and collision
- Professional scene management
- Active community and updates
- Extensive documentation
- Mobile-friendly by default
