# Architecture Guide

## Design Philosophy

This game is built on **extreme modularity** and **data-driven design**. The core principle: **adding features should never require modifying existing code**.

## Core Patterns

### 1. Data-Driven Content

All game content lives in JSON files. Want a new enemy? Edit a JSON file. That's it.

```
src/data/
├── enemies.json        # Enemy definitions
├── ingredients.json    # Ingredient definitions
├── cookingMethods.json # Cooking method definitions
└── equipment.json      # Equipment definitions
```

### 2. Factory Pattern

The `EntityFactory` creates all game objects from templates:

```typescript
// Load templates from JSON
entityFactory.registerTemplates(enemiesData);

// Create instances
const goblin = entityFactory.create('goblin');
```

### 3. Event-Driven Architecture

Systems communicate through events, not direct coupling:

```typescript
// System A emits
eventBus.emit('enemy:defeated', { id: 'goblin' });

// System B reacts
eventBus.on('enemy:defeated', (data) => {
  // Handle event
});
```

### 4. Single Responsibility

Each file has ONE job and is under 200 lines:

- `CombatSystem.ts` - Only combat
- `CookingSystem.ts` - Only cooking
- `ShopSystem.ts` - Only shop transactions

### 5. Screen-Based UI

Each screen is independent and self-contained:

```typescript
class YourScreen extends Screen {
  render() { /* Draw UI */ }
  handleInput() { /* Handle clicks */ }
  cleanup() { /* Clean up */ }
}
```

## System Interaction Flow

```
User Action
    ↓
Screen (UI Layer)
    ↓
System (Logic Layer)
    ↓
GameState (Data Layer)
    ↓
EventBus (Communication)
    ↓
Other Systems (React to changes)
    ↓
Screen Re-renders
```

## Example: Player Defeats Enemy

```typescript
// 1. User clicks "Attack" on ExpeditionScreen
ExpeditionScreen.performAttack()

// 2. Screen calls CombatSystem
combatSystem.fight(enemy)

// 3. CombatSystem updates GameState
gameState.updatePlayer({ health: newHealth })
gameState.addGold(reward)

// 4. GameState emits events
eventBus.emit('player:updated', playerData)
eventBus.emit('gold:changed', gold)

// 5. CombatSystem emits combat result
eventBus.emit('combat:finished', result)

// 6. CombatSystem returns result
return result

// 7. Screen re-renders with new data
this.render()

// 8. Other systems can react to events
achievementSystem.on('enemy:defeated', checkAchievements)
```

## Adding New Features

### Example: Adding a Crafting System

**Step 1**: Define entity type
```typescript
// src/entities/types.ts
export interface CraftingRecipe extends BaseEntity {
  type: 'crafting';
  materials: string[];
  result: string;
}
```

**Step 2**: Create data file
```json
// src/data/crafting.json
{
  "iron_sword_recipe": {
    "id": "iron_sword_recipe",
    "type": "crafting",
    "materials": ["iron_ore", "iron_ore", "wood"],
    "result": "iron_sword"
  }
}
```

**Step 3**: Create system
```typescript
// src/systems/CraftingSystem.ts
export class CraftingSystem {
  craft(recipeId: string): void {
    const recipe = entityFactory.create(recipeId);
    // Crafting logic
    eventBus.emit('item:crafted', result);
  }
}
export const craftingSystem = new CraftingSystem();
```

**Step 4**: Create screen
```typescript
// src/screens/CraftingScreen.ts
export class CraftingScreen extends Screen {
  render(): void {
    // Display recipes
    // Show craft buttons
  }
}
```

**Step 5**: Register screen
```typescript
// src/main.ts (only place you modify)
screenManager.registerScreen('crafting', new CraftingScreen(renderer));
```

**Step 6**: Register data
```typescript
// src/core/DataLoader.ts (only other place you modify)
const crafting = await import('../data/crafting.json');
entityFactory.registerTemplates(crafting.default);
```

**Done!** You've added a complete crafting system by creating 3 new files and making 2 small additions.

## Layer Responsibilities

### Core Layer (`src/core/`)
- Game engine fundamentals
- State management
- Event system
- Data loading

**When to add here**: Only when creating fundamental systems used by everything else.

### Entity Layer (`src/entities/`)
- Type definitions
- Entity factory
- Entity creation logic

**When to add here**: When adding new types of game objects.

### System Layer (`src/systems/`)
- Game logic
- Business rules
- State transformations

**When to add here**: When adding new game mechanics or features.

### Screen Layer (`src/screens/`)
- UI rendering
- User input handling
- Visual presentation

**When to add here**: When adding new UI views.

### Rendering Layer (`src/rendering/`)
- SVG utilities
- Rendering primitives
- Visual components

**When to add here**: When creating reusable visual components.

### Data Layer (`src/data/`)
- JSON templates
- Game content

**When to add here**: Always! This is where most additions happen.

## State Management

### Global State (`GameState`)

Stores all game data:
- Player stats
- Inventory
- Gold
- Discovered recipes
- Current screen
- Active buffs

Access with:
```typescript
const state = gameState.getState(); // Read
gameState.addGold(50); // Modify
```

### Local State (Screen-specific)

Each screen can have private state:
```typescript
class CookingScreen extends Screen {
  private selectedIngredients: string[] = [];
  private selectedMethod: string = '';
}
```

This state is cleaned up when screen changes.

## Event Catalog

### Player Events
- `player:updated` - Player stats changed
- `player:died` - Player health reached 0

### Combat Events
- `combat:started` - Combat began
- `combat:finished` - Combat ended
- `enemy:defeated` - Enemy killed

### Economy Events
- `gold:changed` - Gold amount changed
- `shop:purchase` - Item purchased
- `shop:sold` - Item sold

### Inventory Events
- `inventory:changed` - Inventory updated
- `item:added` - Item added
- `item:removed` - Item removed

### Cooking Events
- `cooking:completed` - Dish created
- `recipe:discovered` - New recipe found

### System Events
- `game:started` - Game loop started
- `game:stopped` - Game loop stopped
- `game:update` - Frame update (with deltaTime)
- `game:render` - Render frame
- `screen:changed` - Screen switched

## File Size Rule

**Every file must be under 200 lines.**

If a file grows too large:
1. Split into multiple files
2. Extract reusable components
3. Move data to JSON
4. Create helper utilities

Example:
```
// Too large:
CombatSystem.ts (300 lines)

// Split into:
CombatSystem.ts (150 lines)
DamageCalculator.ts (80 lines)
LootSystem.ts (70 lines)
```

## Mobile Considerations

### Touch Handling
- No hover states
- Large touch targets (50+ pixels)
- Prevent default touch behavior
- Support both click and touch events

### Responsive SVG
- Use viewBox for scaling
- Relative coordinates
- Text sizing relative to viewBox
- Test on multiple screen sizes

### Performance
- Minimize DOM operations
- Batch rendering updates
- Avoid unnecessary re-renders
- Use event delegation

## Testing Strategy

### Manual Testing Checklist
- [ ] Add enemy via JSON
- [ ] Add ingredient via JSON
- [ ] Fight enemy, get loot
- [ ] Cook dish with ingredients
- [ ] Sell dish for gold
- [ ] Buy equipment
- [ ] Eat dish for buffs
- [ ] Test on mobile device
- [ ] Test screen transitions

### Extension Testing
- [ ] Add new entity type
- [ ] Create new system
- [ ] Add new screen
- [ ] Verify no existing code modified

## Performance Guidelines

- Re-render only when state changes
- Use event-driven updates
- Clear SVG before re-rendering
- Minimize entity creation in loops
- Cache entity templates
- Debounce rapid events

## Common Pitfalls

❌ **Don't**: Modify existing entity JSON files to add new content
✅ **Do**: Add new entries to JSON files

❌ **Don't**: Put game logic in screens
✅ **Do**: Keep screens focused on rendering

❌ **Don't**: Directly modify GameState internal state
✅ **Do**: Use GameState methods

❌ **Don't**: Create circular dependencies
✅ **Do**: Use EventBus for loose coupling

❌ **Don't**: Mix concerns in one file
✅ **Do**: Keep files focused and under 200 lines

## Success Metrics

A well-architected addition:
- ✅ Adds 0 lines to existing files (or minimal registration)
- ✅ Creates focused, single-purpose files
- ✅ Uses existing systems and patterns
- ✅ Follows the 200-line rule
- ✅ Works with data-driven content
- ✅ Communicates via events

## Conclusion

This architecture prioritizes:
1. **Modularity** - Small, focused files
2. **Extensibility** - Add features without changing existing code
3. **Simplicity** - Clear patterns, easy to understand
4. **Maintainability** - Each file has one job
5. **Data-Driven** - Content in JSON, not code

Follow these principles and the game will scale effortlessly!
