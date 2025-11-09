# Food Roguelike

A TypeScript-based roguelike game with cooking mechanics, designed for mobile browsers with an expandable architecture.

## Game Overview

### Locations

- **Base Camp**: Your restaurant hub where you manage recipes and upgrades
- **Expedition**: Hunt monsters for ingredients
- **Cooking**: Combine ingredients with different methods to create dishes
- **Shop**: Buy equipment, sell dishes, or eat them for buffs

### Core Mechanics

1. **Expedition**: Fight enemies to gather ingredients
2. **Cooking**: Experiment with ingredient combinations and cooking methods
3. **Recipe Discovery**: Find optimal combinations through experimentation
4. **Quality System**: Dishes have quality percentages affecting their value
5. **Economy**: Sell dishes for gold or eat them for combat bonuses
6. **Progression**: Buy better equipment and unlock cooking methods

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

## Architecture Overview

The game is built with **extreme modularity** in mind. Adding new content requires NO modification of existing code.

### Project Structure

```
src/
├── core/           # Game engine (state, events, data loading)
├── entities/       # Entity types and factory system
├── systems/        # Game logic (combat, cooking, shop)
├── screens/        # UI screens (base, expedition, cooking, shop)
├── rendering/      # SVG rendering system
└── data/           # JSON data files (entities, items, etc.)
```

### Key Design Principles

1. **Data-Driven**: All content is in JSON files
2. **Factory Pattern**: Entities created through factory
3. **Event-Driven**: Systems communicate via EventBus
4. **No God Objects**: Each file under 200 lines
5. **Plugin Architecture**: Add features without touching existing code

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

## Mobile Support

- Fully responsive SVG rendering
- Touch-optimized controls
- No hover effects (all tap-based)
- Viewport scaling handled automatically

## Technology Stack

- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **SVG**: Vector graphics for all rendering
- **JSON**: Data-driven content

## Code Guidelines

- ✅ Files must be under 200 lines
- ✅ Single responsibility per file
- ✅ Use EventBus for communication
- ✅ Store data in JSON files
- ✅ TypeScript strict mode
- ✅ No god objects or monolithic files

## Game Systems

### Combat System
Turn-based combat with attack/defense calculations. Defeated enemies drop ingredients and gold.

### Cooking System
Combine multiple ingredients with a cooking method. Quality is randomized with method modifiers. Discover recipes through experimentation.

### Shop System
Buy equipment to improve stats. Sell dishes for gold or eat them for temporary buffs.

### Entity Factory
Central system for creating all game objects from JSON templates. Supports runtime object creation (like dishes).

### Event System
Decoupled communication between systems. Any system can emit events that others can listen to.

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

- Minimal DOM manipulation
- Event-driven updates
- Efficient SVG rendering
- No unnecessary re-renders
- Mobile-optimized

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
