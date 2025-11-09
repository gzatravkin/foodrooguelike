# How to Expand Core Systems

The core folder contains fundamental game engine components.

## Event System

Use the EventBus for decoupled communication:

```typescript
import { eventBus } from './EventBus';

// Emit events
eventBus.emit('enemy:defeated', { enemyId: 'goblin', xp: 50 });

// Listen to events
eventBus.on('enemy:defeated', (data) => {
    console.log(`Defeated ${data.enemyId}, gained ${data.xp} XP`);
});

// Remove listener
const handler = (data) => { /* ... */ };
eventBus.on('event:name', handler);
eventBus.off('event:name', handler);
```

## Adding Game State Properties

1. Edit `src/core/GameState.ts`
2. Add to GameData interface:

```typescript
export interface GameData {
    // ... existing properties
    newProperty: YourType;
}
```

3. Initialize in `getInitialState()`:

```typescript
private getInitialState(): GameData {
    return {
        // ... existing
        newProperty: initialValue
    };
}
```

4. Add accessor methods:

```typescript
updateNewProperty(value: YourType): void {
    this.state.newProperty = value;
    eventBus.emit('newProperty:changed', value);
}
```

## Creating New Core Systems

Only add to core if:
- Used by multiple systems
- Fundamental to game operation
- Self-contained and reusable

Example - Save System:

```typescript
// src/core/SaveSystem.ts
import { gameState } from './GameState';

export class SaveSystem {
    save(): void {
        const state = gameState.getState();
        localStorage.setItem('saveData', JSON.stringify(state));
    }

    load(): boolean {
        const data = localStorage.getItem('saveData');
        if (data) {
            // Restore state
            return true;
        }
        return false;
    }
}

export const saveSystem = new SaveSystem();
```

## Data Loading

To add new data sources:

1. Create JSON file in `src/data/`
2. Edit `DataLoader.ts`:

```typescript
async loadAll(): Promise<void> {
    const [/* existing */, newData] = await Promise.all([
        // ... existing imports
        import('../data/newData.json')
    ]);

    entityFactory.registerTemplates(newData.default);
}
```

## Game Loop Extensions

To add logic to the game loop:

```typescript
// In any system
import { eventBus } from '../core/EventBus';

eventBus.on('game:update', (deltaTime) => {
    // Runs every frame
    // deltaTime in milliseconds
});
```

## Best Practices

- Keep files focused and under 200 lines
- Use TypeScript interfaces for type safety
- Emit events for state changes
- Document public APIs
- Prefer composition over inheritance
- Keep core systems stateless when possible
