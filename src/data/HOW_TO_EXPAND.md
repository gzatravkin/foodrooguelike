# How to Add New Content (Data-Driven)

This folder contains all game content in JSON format. Adding new content is as simple as editing these files!

## Adding New Enemies

**File:** `enemies.json`

1. Add a new entry following this template:

```json
"your_enemy_id": {
  "id": "your_enemy_id",
  "type": "enemy",
  "name": "Display Name",
  "description": "Enemy description",
  "health": 50,
  "attack": 10,
  "defense": 5,
  "goldReward": 25,
  "lootTable": [
    { "itemId": "ingredient_id", "chance": 0.8 }
  ]
}
```

2. That's it! The enemy will automatically appear in the expedition screen.

## Adding New Ingredients

**File:** `ingredients.json`

1. Add a new entry:

```json
"your_ingredient_id": {
  "id": "your_ingredient_id",
  "type": "ingredient",
  "name": "Display Name",
  "description": "Ingredient description",
  "rarity": "common|uncommon|rare|legendary",
  "baseValue": 10
}
```

2. Reference this ID in enemy loot tables to make it droppable.

## Adding New Cooking Methods

**File:** `cookingMethods.json`

```json
"your_method_id": {
  "id": "your_method_id",
  "type": "cookingMethod",
  "name": "Display Name",
  "description": "Method description",
  "unlocked": true,
  "cost": 100,
  "qualityModifier": 1.5
}
```

- `qualityModifier`: Multiplier for dish quality (higher = better dishes)
- `unlocked`: Set to false if it should be purchasable

## Adding New Equipment

**File:** `equipment.json`

```json
"your_equipment_id": {
  "id": "your_equipment_id",
  "type": "equipment",
  "name": "Display Name",
  "description": "Equipment description",
  "slot": "weapon|armor",
  "stats": {
    "attack": 15,
    "defense": 10,
    "health": 50
  },
  "cost": 300
}
```

## Creating New Data Types

1. Create a new JSON file (e.g., `consumables.json`)
2. Register it in `src/core/DataLoader.ts`:

```typescript
const consumables = await import('../data/consumables.json');
entityFactory.registerTemplates(consumables.default);
```

3. Create a new type in `src/entities/types.ts`
4. Use `entityFactory.create('your_id')` to instantiate

No need to modify existing files - the architecture is designed for expansion!
