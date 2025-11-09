# How to Add New Game Systems

Systems contain the game logic. Each system is self-contained and communicates via the EventBus.

## Creating a New System

1. Create a new file: `YourSystem.ts`

```typescript
import { eventBus } from '../core/EventBus';
import { gameState } from '../core/GameState';

export class YourSystem {
    doSomething(): void {
        // Your logic here

        // Emit events for other systems to react
        eventBus.emit('your:event', { data: 'value' });
    }
}

// Export singleton instance
export const yourSystem = new YourSystem();
```

2. Use it anywhere in the game:

```typescript
import { yourSystem } from '../systems/YourSystem';
yourSystem.doSomething();
```

## System Communication

Systems should communicate through the EventBus, not direct references:

```typescript
// In YourSystem.ts
eventBus.emit('item:collected', itemData);

// In AnotherSystem.ts
eventBus.on('item:collected', (itemData) => {
    // React to the event
});
```

## Common System Patterns

### Resource Management System

```typescript
export class ResourceSystem {
    private resources: Map<string, number> = new Map();

    add(type: string, amount: number): void {
        const current = this.resources.get(type) || 0;
        this.resources.set(type, current + amount);
        eventBus.emit('resource:changed', { type, amount });
    }

    spend(type: string, amount: number): boolean {
        const current = this.resources.get(type) || 0;
        if (current >= amount) {
            this.resources.set(type, current - amount);
            return true;
        }
        return false;
    }
}
```

### Achievement System

```typescript
export class AchievementSystem {
    private achievements: Set<string> = new Set();

    unlock(id: string): void {
        if (!this.achievements.has(id)) {
            this.achievements.add(id);
            eventBus.emit('achievement:unlocked', id);
        }
    }
}
```

## Integration Checklist

- [ ] Create system class
- [ ] Export singleton instance
- [ ] Emit events for state changes
- [ ] Document public methods
- [ ] Keep system focused (single responsibility)
- [ ] File should be under 200 lines
