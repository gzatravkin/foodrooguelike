# How to Add New Entity Types

Entities are game objects like enemies, items, ingredients, etc.

## Adding a New Entity Type

### 1. Define the Type

Edit `src/entities/types.ts`:

```typescript
export interface YourEntity extends BaseEntity {
    type: 'yourType';
    customProperty: string;
    stats: {
        power: number;
    };
}

// Add to union type
export type GameEntity = Enemy | Ingredient | /* ... */ | YourEntity;
```

### 2. Create Factory Method

Edit `src/entities/EntityFactory.ts`:

```typescript
createYourEntity(id: string): YourEntity | null {
    return this.create(id) as YourEntity;
}
```

### 3. Create Data File

Create `src/data/yourEntities.json`:

```json
{
  "entity_id": {
    "id": "entity_id",
    "type": "yourType",
    "name": "Entity Name",
    "description": "Description",
    "customProperty": "value",
    "stats": {
      "power": 100
    }
  }
}
```

### 4. Register in DataLoader

Edit `src/core/DataLoader.ts`:

```typescript
const yourEntities = await import('../data/yourEntities.json');
entityFactory.registerTemplates(yourEntities.default);
```

### 5. Use It

```typescript
import { entityFactory } from '../entities/EntityFactory';

const entity = entityFactory.createYourEntity('entity_id');
if (entity) {
    console.log(entity.name);
}
```

## Entity Factory Patterns

### Simple Creation

```typescript
const enemy = entityFactory.create('goblin');
```

### With Overrides

```typescript
const powerfulGoblin = entityFactory.create('goblin', {
    health: 200,
    attack: 50
});
```

### Get All of Type

```typescript
const allEnemies = entityFactory.getAllOfType('enemy');
```

### Get Template

```typescript
const template = entityFactory.getTemplate('goblin');
console.log(template.name);
```

## Complex Entity Example

For entities with relationships:

```typescript
// types.ts
export interface Quest extends BaseEntity {
    type: 'quest';
    objectives: Array<{
        type: 'kill' | 'collect';
        targetId: string;
        amount: number;
    }>;
    rewards: {
        gold: number;
        items: string[];
    };
}

// quests.json
{
  "goblin_hunt": {
    "id": "goblin_hunt",
    "type": "quest",
    "name": "Goblin Hunt",
    "description": "Defeat 5 goblins",
    "objectives": [
      {
        "type": "kill",
        "targetId": "goblin",
        "amount": 5
      }
    ],
    "rewards": {
      "gold": 100,
      "items": ["iron_sword"]
    }
  }
}
```

## Dynamic Entity Creation

For entities created at runtime (like dishes):

```typescript
// In EntityFactory.ts
createDish(ingredients: string[], method: string, quality: number): Dish {
    return {
        id: `dish_${Date.now()}`, // Unique ID
        type: 'dish',
        name: `${method} Dish`,
        // ... other properties
        ingredients,
        quality
    };
}
```

## Entity Validation

Add validation for complex entities:

```typescript
private validateEntity(entity: any): boolean {
    if (!entity.id || !entity.type || !entity.name) {
        console.error('Invalid entity:', entity);
        return false;
    }
    return true;
}
```

## Best Practices

- Always include `id`, `type`, `name`, `description`
- Use TypeScript interfaces for type safety
- Keep entity data in JSON files
- Use factory methods for complex creation logic
- Validate entity data at load time
- Document entity properties in interfaces
