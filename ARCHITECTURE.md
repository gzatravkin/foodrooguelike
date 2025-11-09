# Architecture Guide

## Design Philosophy

This is a **2D top-view action roguelike** built on **modular architecture** and **real-time game systems**. The core principle: **clean separation between game logic, rendering, and data**.

## Core Architecture

### Game Loop

Real-time game loop running at 60 FPS:

```typescript
// main.ts
const update = (currentTime: number) => {
  const deltaTime = (currentTime - lastTime) / 1000;

  // Update game logic
  gameScreen.update(deltaTime);

  // Render frame
  gameScreen.render();
};

gameLoop.loop(update);
```

### Layer Structure

```
┌─────────────────────────────────────┐
│         Rendering Layer             │
│  (CanvasRenderer, Camera, Drawing)  │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│          Game Screen Layer          │
│  (GameScreen - main game logic)     │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Systems Layer               │
│  (MapSystem, AI, Collision)         │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Entity Layer                │
│  (Player, Enemy, base Entity)       │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Input Layer                 │
│  (InputManager - keyboard/mouse)    │
└─────────────────────────────────────┘
                 ↕
┌─────────────────────────────────────┐
│         Data Layer                  │
│  (GameState, EntityFactory, JSON)   │
└─────────────────────────────────────┘
```

## Core Systems

### 1. Canvas Rendering System

HTML5 Canvas-based rendering with camera support:

```typescript
// rendering/CanvasRenderer.ts
class CanvasRenderer {
  - camera: { x, y }          // Camera position for scrolling
  - canvas: HTMLCanvasElement
  - ctx: CanvasRenderingContext2D

  + drawTile()       // Draw map tiles
  + drawCircle()     // Draw entities (player, enemies)
  + drawText()       // Draw text
  + setCamera()      // Update camera position
  + worldToScreen()  // Convert world coordinates to screen
}
```

**Features:**
- Camera follows player
- World space vs Screen space coordinates
- Optimized rendering (only visible tiles)
- UI overlay (stats, health bars, prompts)

### 2. Input Management System

Real-time input handling:

```typescript
// core/InputManager.ts
class InputManager {
  - keys: Map<string, KeyState>
  - mousePos: { x, y }

  + isKeyPressed(key)      // Check if key is currently held
  + isKeyJustPressed(key)  // Check if key was just pressed this frame
  + getMovementVector()    // Get normalized WASD/Arrow input
  + update()               // Reset per-frame input states
}
```

**Features:**
- Key state tracking (pressed, justPressed, justReleased)
- Movement vector normalization (diagonal = same speed)
- Mouse position and button tracking
- Input buffering and debouncing

### 3. Map System

Tile-based world with collision:

```typescript
// systems/MapSystem.ts
class MapSystem {
  - currentMap: GameMap
  - tileColors: Map<TileType, string>

  + loadMap(map)                // Load a new map
  + getTileAt(x, y)             // Get tile at world position
  + canMoveTo(x, y)             // Check if position is walkable
  + isTileWalkable(tileType)    // Check tile walkability
}
```

**Tile Types:**
- `FLOOR` - Walkable ground
- `WALL` - Blocking walls
- `COOKING_STATION` - Interactive cooking area
- `SHOP` - Interactive shop area
- `EXPEDITION_PORTAL` - Start expeditions
- `STAIRS_UP` / `STAIRS_DOWN` - Level transitions

**Collision Detection:**
- Checks all corners of entity bounding box
- Prevents walking through walls
- Allows sliding along walls

### 4. Entity System

Object-oriented entity hierarchy:

```typescript
// entities/Entity.ts (abstract base)
abstract class Entity {
  + id: string
  + type: EntityType
  + x, y: number              // World position
  + size: number              // Collision size
  + stats: EntityStats        // Health, attack, defense, speed
  + alive: boolean

  + update(deltaTime)         // Update entity logic
  + takeDamage(amount)        // Apply damage
  + getBounds()               // Get bounding box
  + intersects(other)         // Check collision
}

// entities/Player.ts
class Player extends Entity {
  + weapon: Equipment
  + armor: Equipment
  + gold: number
  + attackCooldown: number
  + facingAngle: number       // Direction player faces

  + move(dx, dy, deltaTime)   // Move with speed
  + attack()                  // Initiate attack
  + getAttackHitbox()         // Get attack range/position
  + equipWeapon(weapon)       // Change equipment
}

// entities/Enemy.ts
class Enemy extends Entity {
  + enemyData: EnemyData      // JSON template data
  + aiState: 'idle' | 'chase' | 'attack'
  + chaseRange: number
  + attackRange: number

  + updateAI(playerPos, deltaTime)  // Run AI behavior
  + chasePlayer()                   // Move towards player
  + getLoot()                       // Get drops on death
}
```

### 5. Combat System

Real-time action combat:

**Player Attack Flow:**
```
1. Player presses Space/Click
2. Check attackCooldown (can attack?)
3. Set cooldown timer
4. Calculate attack hitbox (direction + range)
5. Check all enemies vs hitbox
6. Apply damage = max(1, player.attack - enemy.defense)
7. Visual feedback (attack animation)
```

**Enemy Attack Flow:**
```
1. Enemy AI updates each frame
2. Check distance to player
3. If in attackRange: transition to 'attack' state
4. If attackCooldown ready: deal damage
5. Apply damage = max(1, enemy.attack - player.defense)
6. Set cooldown timer
```

**Key Features:**
- Hit-and-run tactics (dodge, strike, retreat)
- Attack cooldowns prevent spamming
- Facing direction matters (can't attack behind you)
- Visual attack indicators

### 6. AI System

Enemy state machine:

```
┌──────┐   distance > chaseRange
│ IDLE │ ◄─────────────────────────┐
└──────┘                            │
   │ distance ≤ chaseRange          │
   ▼                                │
┌───────┐  distance > attackRange   │
│ CHASE │ ────────────────────────►─┘
└───────┘
   │ distance ≤ attackRange
   ▼
┌────────┐
│ ATTACK │
└────────┘
```

**Behaviors:**
- **IDLE**: Stand still, wait for player
- **CHASE**: Move towards player, navigate around walls
- **ATTACK**: Stop and attack when in range

**Pathfinding:**
- Simple direct movement towards player
- Obstacle avoidance (try X, try Y if blocked)
- Future: A* pathfinding for smarter navigation

### 7. Game Mode System

Two main modes:

**Base Camp Mode:**
- Safe area, no enemies
- Interactive tiles:
  - Cooking Station → (E to cook)
  - Shop → (E to buy/sell)
  - Expedition Portal → (E to start dungeon)

**Expedition Mode:**
- Dungeon with enemies
- Procedurally generated layout
- Interactive tiles:
  - Stairs Up → (E to return to base)
  - Stairs Down → (E to next level)
- Enemy spawning based on level difficulty

## Data Flow Examples

### Example 1: Player Movement

```
User presses W
  ↓
InputManager.getMovementVector() → { x: 0, y: -1 }
  ↓
GameScreen.handlePlayerMovement(deltaTime)
  ↓
Calculate newX, newY based on speed * deltaTime
  ↓
MapSystem.canMoveTo(newX, newY)?
  ↓ YES
Player.move(dx, dy, deltaTime)
  ↓
Camera.setCamera(player.x - width/2, player.y - height/2)
  ↓
Render updated frame
```

### Example 2: Combat

```
User presses Space
  ↓
Player.canAttack()? (check cooldown)
  ↓ YES
Player.attack() → set cooldown
  ↓
Calculate hitbox = player.pos + facing * range
  ↓
For each enemy:
  if distance(enemy, hitbox) < hitbox.radius:
    enemy.takeDamage(player.getAttackDamage())
      ↓
    if enemy.health ≤ 0:
      enemy.alive = false
      loot = enemy.getLoot()
      player.gold += loot.gold
      gameState.addToInventory(loot.items)
```

### Example 3: Enemy AI

```
Every frame, for each enemy:
  ↓
Calculate distance to player
  ↓
Update state based on distance:
  - Far away → IDLE
  - Medium → CHASE
  - Close → ATTACK
  ↓
Execute state behavior:
  CHASE:
    - Calculate direction to player
    - Move towards player if path clear
    - Avoid obstacles
  ATTACK:
    - If cooldown ready:
      - Deal damage to player
      - Reset cooldown
```

## File Structure

```
src/
├── core/
│   ├── GameLoop.ts          # 60 FPS game loop
│   ├── InputManager.ts      # Keyboard/mouse input
│   ├── GameState.ts         # Global game state
│   ├── EventBus.ts          # Event system
│   └── DataLoader.ts        # Load JSON data
├── rendering/
│   └── CanvasRenderer.ts    # Canvas drawing API
├── entities/
│   ├── Entity.ts            # Base entity class
│   ├── Player.ts            # Player character
│   ├── Enemy.ts             # Enemy with AI
│   ├── types.ts             # Type definitions
│   └── EntityFactory.ts     # Create entities from JSON
├── systems/
│   └── MapSystem.ts         # Map, tiles, collision
├── screens/
│   └── GameScreen.ts        # Main game screen
├── data/
│   ├── enemies.json         # Enemy definitions
│   ├── ingredients.json     # Ingredient definitions
│   ├── cookingMethods.json  # Cooking methods
│   └── equipment.json       # Weapon/armor stats
└── main.ts                  # Entry point
```

## Adding New Features

### Add a New Enemy Type

1. Edit `src/data/enemies.json`:
```json
{
  "zombie": {
    "id": "zombie",
    "type": "enemy",
    "name": "Zombie",
    "health": 80,
    "attack": 12,
    "defense": 3,
    "goldReward": 25,
    "lootTable": [
      { "itemId": "rotten_meat", "chance": 0.8 }
    ]
  }
}
```

2. That's it! Enemy will appear in expeditions automatically.

### Add a New Map

```typescript
// In MapSystem.ts or new file
static createCustomDungeon(): GameMap {
  const width = 40;
  const height = 30;
  const tiles: TileType[][] = [];

  // Create your layout
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = TileType.FLOOR; // or WALL, etc.
    }
  }

  return { width, height, tileSize: 32, tiles, name: 'Custom Dungeon' };
}
```

### Add a New Interactive Tile

1. Add tile type to `MapSystem.ts`:
```typescript
enum TileType {
  // ...existing types
  TREASURE_CHEST = 8,
}
```

2. Handle interaction in `GameScreen.ts`:
```typescript
private checkInteractions(): void {
  const tile = this.mapSystem.getTileAt(this.player.x, this.player.y);

  if (tile === TileType.TREASURE_CHEST) {
    this.showInteractionPrompt = true;
    this.interactionPromptText = 'Press E to Open Chest';

    if (this.input.isKeyJustPressed('e')) {
      // Give loot
      this.player.gold += 100;
    }
  }
}
```

## Performance Considerations

### Rendering
- Only render visible tiles (future: frustum culling)
- Batch similar draw calls
- Cache frequently used calculations
- Use requestAnimationFrame for smooth 60 FPS

### Collision Detection
- Bounding box (AABB) collision
- Only check relevant entities (spatial partitioning future)
- Early exit when collision found

### Memory
- Reuse objects when possible
- Avoid allocations in hot paths (game loop)
- Clean up dead entities each frame

## Future Architecture Improvements

- [ ] Spatial partitioning (quadtree) for collision
- [ ] A* pathfinding for smarter enemy AI
- [ ] Sprite system instead of simple shapes
- [ ] Particle effects for combat
- [ ] Menu system for cooking/shop (overlay UI)
- [ ] Save/load system
- [ ] Sound system
- [ ] Mobile touch controls

## Design Principles

1. **Separation of Concerns**: Rendering ≠ Logic ≠ Data
2. **Entity-Component Pattern**: Modular, reusable entity behaviors
3. **Data-Driven**: Content in JSON, code handles systems
4. **Real-Time Focus**: 60 FPS, delta time, smooth movement
5. **Modularity**: Each file < 200 lines, single responsibility
