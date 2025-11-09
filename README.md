# Food Roguelike

A **2D top-view action roguelike** with cooking mechanics! Explore your base camp, venture into dangerous dungeons, fight enemies in real-time combat, and cook delicious dishes from the ingredients you collect.

## Game Overview

### Gameplay

This is a **real-time action roguelike** where you:
- **Move freely** around a tile-based world using WASD or arrow keys
- **Explore your base camp** and interact with cooking stations, shops, and expedition portals
- **Battle enemies** in real-time using hit-and-run tactics
- **Collect ingredients** from defeated monsters
- **Cook dishes** to sell for profit or eat for combat buffs

### Locations

- **Base Camp**: Your safe haven with cooking station, shop, and expedition portal
- **Expeditions**: Procedurally generated dungeons filled with enemies and loot
- **Cooking Station**: Interact to combine ingredients and create dishes
- **Shop**: Buy better weapons and armor to survive tougher dungeons

### Core Mechanics

1. **Real-Time Movement**: Walk around freely, dodge enemy attacks, position for strikes
2. **Action Combat**: Attack enemies with your equipped weapon, manage cooldowns
3. **Hit-and-Run Tactics**: Fight smart - enemies chase and attack you in real-time
4. **Enemy AI**: Monsters patrol, chase when you get close, and attack when in range
5. **Ingredient Gathering**: Defeat enemies to collect cooking ingredients
6. **Cooking System**: Experiment with ingredient combinations and methods
7. **Progression**: Upgrade your weapons and armor to tackle harder dungeons

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open your browser to `http://localhost:5173`

## Controls

- **WASD / Arrow Keys**: Move your character
- **Space / Left Click**: Attack with equipped weapon
- **E**: Interact with objects (cooking station, shop, expedition portal, stairs)
- **ESC**: Pause menu (coming soon)

## Deployment

### GitHub Pages (Automatic)

This project includes GitHub Actions workflows for automatic deployment:

1. **Enable GitHub Pages**: Go to Settings → Pages → Source: **GitHub Actions**
2. **Push to main branch**: Deployment happens automatically
3. **View your game**: `https://[username].github.io/foodrooguelike/`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```bash
# Test production build locally
npm run build:gh
npm run preview:gh

# Push to main/master to deploy
git push origin main
```

## Architecture Overview

The game is built with **extreme modularity** and a **2D game engine** architecture.

### Project Structure

```
src/
├── core/           # Game engine (state, events, input, game loop)
├── entities/       # Player, enemies, and entity base classes
├── systems/        # Game systems (map, combat, cooking, shop)
├── screens/        # Game screen with rendering and logic
├── rendering/      # HTML5 Canvas rendering system
└── data/           # JSON data files (enemies, items, equipment)
```

### Key Design Principles

1. **Canvas-Based Rendering**: HTML5 Canvas for smooth 2D graphics
2. **Entity-Component System**: Modular entity design with stats and behaviors
3. **Real-Time Game Loop**: Smooth 60 FPS rendering and updates
4. **Tile-Based Maps**: Collision detection and interactive tiles
5. **Data-Driven Content**: All enemies, items, and equipment in JSON files

## How to Expand

Each folder contains a `HOW_TO_EXPAND.md` file with detailed instructions:

- `src/data/HOW_TO_EXPAND.md` - Add enemies, ingredients, equipment
- `src/systems/HOW_TO_EXPAND.md` - Create new game systems
- `src/screens/HOW_TO_EXPAND.md` - Add new UI screens
- `src/entities/HOW_TO_EXPAND.md` - Define new entity types
- `src/rendering/HOW_TO_EXPAND.md` - Create custom SVG components

### Quick Examples

**Add a New Enemy** (Just edit JSON!):
```json
// src/data/enemies.json
"zombie": {
  "id": "zombie",
  "type": "enemy",
  "name": "Zombie",
  "health": 80,
  "attack": 12,
  "defense": 4,
  "goldReward": 30,
  "lootTable": [
    { "itemId": "rotten_meat", "chance": 0.9 }
  ]
}
```

**Add a New Screen** (Create one file):
```typescript
// src/screens/YourScreen.ts
export class YourScreen extends Screen {
  render(): void {
    // Your UI code
  }
}

// Register in src/main.ts
screenManager.registerScreen('yourscreen', new YourScreen(renderer));
```

**Add a New System** (Create one file):
```typescript
// src/systems/YourSystem.ts
export class YourSystem {
  doSomething(): void {
    eventBus.emit('something:happened');
  }
}
export const yourSystem = new YourSystem();
```

## Technology Stack

- **TypeScript**: Type-safe development with strict mode
- **Vite**: Lightning-fast build tool and dev server
- **HTML5 Canvas**: Hardware-accelerated 2D rendering
- **JSON**: Data-driven content (enemies, items, equipment)
- **No external game engines**: Pure TypeScript implementation

## Code Guidelines

- ✅ Files must be under 200 lines
- ✅ Single responsibility per file
- ✅ Use EventBus for communication
- ✅ Store data in JSON files
- ✅ TypeScript strict mode
- ✅ No god objects or monolithic files

## Game Systems

### Movement & Input System
- Real-time keyboard and mouse input handling
- Smooth character movement with collision detection
- 8-directional movement with diagonal normalization
- Input buffering and state management

### Combat System
- Real-time action combat with attack cooldowns
- Attack hitboxes based on player facing direction
- Enemy AI with chase and attack states
- Hit-and-run tactics: dodge attacks, strike when safe
- Damage calculation: `max(1, attack - defense)`

### Map System
- Tile-based world with collision detection
- Base camp with interactive zones (cooking station, shop, portal)
- Procedurally generated dungeon layouts
- Interactive tiles: doors, stairs, special objects

### Enemy AI System
- State machine: idle, chase, attack
- Pathfinding around obstacles
- Attack range and cooldown management
- Loot drops on defeat (gold + ingredients)

### Cooking System
- Combine multiple ingredients with cooking methods
- Quality randomization with method modifiers
- Recipe discovery through experimentation
- Dishes can be sold or eaten for buffs

### Shop System
- Buy weapons and armor to boost stats
- Equipment directly affects combat performance
- Progressive gear unlocks as you earn gold

### Canvas Rendering
- Smooth 60 FPS rendering
- Camera system that follows the player
- UI overlay for stats and controls
- Visual feedback for attacks and damage

## Extending the Game

### Example: Adding a Quest System

1. Create entity type:
```typescript
// src/entities/types.ts
export interface Quest extends BaseEntity {
  type: 'quest';
  objectives: Objective[];
  rewards: Rewards;
}
```

2. Create data file:
```json
// src/data/quests.json
{
  "quest_1": { ... }
}
```

3. Create system:
```typescript
// src/systems/QuestSystem.ts
export class QuestSystem { ... }
```

4. Create screen:
```typescript
// src/screens/QuestScreen.ts
export class QuestScreen extends Screen { ... }
```

No existing files modified! That's the power of this architecture.

## Performance

- Hardware-accelerated Canvas rendering
- 60 FPS game loop with delta time
- Efficient collision detection
- Optimized entity updates
- Minimal memory allocation per frame

## Future Expansion Ideas

- [ ] Persistent save system
- [ ] More enemy types and bosses
- [ ] Recipe hints and cookbook
- [ ] Restaurant upgrades
- [ ] Multiple expedition zones
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Multiplayer trading
- [ ] Seasonal ingredients
- [ ] Special cooking events

## License

MIT

## Contributing

The architecture is designed for easy contribution. See the `HOW_TO_EXPAND.md` files in each directory for specific guidance.
