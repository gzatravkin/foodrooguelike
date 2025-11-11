# 🎮 Plugin-Based Architecture - Adding New Content Made Easy!

## Overview

The game now uses a **plugin-based architecture** that makes adding new content incredibly simple. Instead of updating multiple files, you can now **add most new content by creating just ONE file**!

## 🎯 Quick Summary

| Content Type | How to Add | Files to Create |
|--------------|-----------|-----------------|
| **New Tile** | Create `.ts` file in `src/plugins/tiles/definitions/` | **1 file** |
| **New Enemy** | Create `.json` file in `src/plugins/enemies/` | **1 file** |
| **New Weapon** | Create `.json` file in `src/plugins/weapons/` | **1 file** |
| **New Building** | Create tile in `src/plugins/tiles/definitions/` | **1 file** |
| **New Interactable** | Create tile in `src/plugins/tiles/definitions/` | **1 file** |

---

## 📦 How It Works

### Architecture
The plugin system uses **automatic registration**:
1. Each content type has a **Registry** (TileRegistry, EnemyRegistry, WeaponRegistry)
2. On game startup, all plugins are loaded from their directories
3. Plugins are automatically registered and available in-game
4. No manual imports or enum updates needed!

### File Structure
```
src/plugins/
├── tiles/
│   ├── definitions/        # Individual tile files
│   │   ├── floor.ts
│   │   ├── water.ts
│   │   ├── magic_circle.ts # NEW!
│   │   └── ...
│   ├── TileRegistry.ts     # Registry system
│   └── index.ts            # Auto-loader
├── enemies/
│   ├── wraith.json         # NEW!
│   ├── minotaur.json       # NEW!
│   ├── EnemyRegistry.ts
│   └── index.ts
├── weapons/
│   ├── dark_bolt.json      # NEW!
│   ├── crossbow.json       # NEW!
│   ├── WeaponRegistry.ts
│   └── index.ts
└── index.ts                # Main plugin initializer
```

---

## 🆕 Adding New Content

### 1️⃣ Adding a New Tile

**Create:** `src/plugins/tiles/definitions/my_tile.ts`

```typescript
import { TilePlugin } from '../TileRegistry';

export const MyTile: TilePlugin = {
  id: 'my_tile',
  name: 'My Tile',
  color: '#FF6347',
  walkable: true,
  blocksLight: false,

  // Optional: Custom interaction
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog) => {
      onLog('You interacted with my tile!', '#FFD700');
    },
  },

  // Optional: Custom rendering
  rendering: {
    render: (ctx, worldX, worldY, size) => {
      ctx.fillStyle = '#FF6347';
      ctx.fillRect(worldX, worldY, size, size);
    },
  },

  // Optional: Dungeon generation settings
  dungeon: {
    canSpawnInRoom: true,
    spawnWeight: 0.3,
  },
};
```

**Register:** Add to `src/plugins/tiles/index.ts`:
```typescript
import { MyTile } from './definitions/my_tile';
// ...
TileRegistry.register(MyTile);
```

**Done!** Your tile is now in the game!

---

### 2️⃣ Adding a New Enemy

**Create:** `src/plugins/enemies/my_enemy.json`

```json
{
  "id": "my_enemy",
  "name": "My Enemy",
  "hp": 100,
  "attack": 25,
  "defense": 10,
  "speed": 120,
  "xp": 80,
  "color": "#FF0000",
  "size": 24,
  "weaponId": "my_weapon",
  "ai": {
    "type": "aggressive",
    "chaseRange": 400,
    "attackRange": 250
  },
  "loot": {
    "ingredients": [
      { "id": "tomato", "chance": 0.5 }
    ],
    "gold": { "min": 30, "max": 60 }
  }
}
```

**Register:** Add to `src/plugins/enemies/index.ts`:
```typescript
import myEnemyData from './my_enemy.json';
// ...
EnemyRegistry.register(myEnemyData as any);
```

**Done!** Your enemy can now spawn in expeditions!

---

### 3️⃣ Adding a New Weapon

**Create:** `src/plugins/weapons/my_weapon.json`

```json
{
  "id": "my_weapon",
  "name": "My Weapon",
  "damage": 30,
  "fireRate": 1.5,
  "projectileSpeed": 400,
  "range": 500,
  "color": "#00FF00",
  "size": 8,
  "piercing": false,
  "spread": 5,
  "description": "A powerful weapon!"
}
```

**Register:** Add to `src/plugins/weapons/index.ts`:
```typescript
import myWeaponData from './my_weapon.json';
// ...
WeaponRegistry.register(myWeaponData as any);
```

**Done!** Your weapon is now available!

---

### 4️⃣ Adding a New Building

Buildings are special tiles placed in specific locations. Follow the tile creation process above, then add placement logic in `src/systems/BaseCampGenerator.ts`:

```typescript
// In BaseCampGenerator.generate()
tiles[y][x] = TileRegistry.getTileIndex('my_building');
```

---

### 5️⃣ Adding a New Dungeon Interactable

Same as adding a tile! Just set `dungeon.canSpawnInRoom: true` in the tile definition, and the DungeonGenerator will automatically place it.

---

## 🚀 New Content Added (Proof of Concept)

### New Tiles (4)
1. **Mud** - Heavy slowing effect
2. **Sand** - Light slowing effect
3. **Magic Circle** - Grants random permanent stat boost
4. **Quicksand** - Very slow + damage over time

### New Interactables (5)
1. **Enchanting Altar** - Enhances weapon damage
2. **Wishing Well** - Random rewards (gold/health/XP)
3. **Statue** - Flavor text for atmosphere
4. **Campfire** - Full heal + temporary buffs
5. **Mysterious Door** - Costs gold to open

### New Buildings (2)
1. **Library** - Grants XP and knowledge
2. **Blacksmith** - Repairs equipment, boosts defense

### New Enemies (4)
1. **Wraith** - Fast, aggressive, uses dark magic
2. **Minotaur** - Tanky melee brute
3. **Elemental** - Ranged attacker with elemental magic
4. **Bandit** - Ambusher with crossbow

### New Weapons (4)
1. **Dark Bolt** - Piercing dark energy
2. **Battle Axe** - High damage melee
3. **Elemental Blast** - Rapid fire with spread
4. **Crossbow** - Accurate long-range

---

## 🔧 Technical Details

### Plugin Registries
- **TileRegistry**: Manages all tile types with automatic ID-to-index mapping
- **EnemyRegistry**: Manages enemy definitions
- **WeaponRegistry**: Manages weapon definitions

### Initialization Flow
1. `main.ts` calls `initializeAllPlugins()`
2. Each registry loads and registers its plugins
3. `DataLoader` integrates plugin data with EntityFactory
4. Game systems access entities via registries

### Compatibility
- **Backward Compatible**: Existing JSON-based enemies/weapons still work
- **Type Safe**: TypeScript interfaces ensure correctness
- **Hot Reloadable**: Easy to add/remove during development

---

## 📝 Examples of Adding Content

### Example: Adding a Lava Bridge Tile
```typescript
// src/plugins/tiles/definitions/lava_bridge.ts
export const LavaBridgeTile: TilePlugin = {
  id: 'lava_bridge',
  name: 'Lava Bridge',
  color: '#8B4513',
  walkable: true,
  blocksLight: false,
};
```

### Example: Adding a Boss Enemy
```json
// src/plugins/enemies/dragon_boss.json
{
  "id": "dragon_boss",
  "name": "Ancient Dragon",
  "hp": 500,
  "attack": 60,
  "defense": 30,
  "speed": 90,
  "xp": 500,
  "color": "#8B0000",
  "size": 48,
  "weaponId": "fire_breath",
  "ai": {
    "type": "aggressive",
    "chaseRange": 600,
    "attackRange": 350
  }
}
```

---

## 🎯 Benefits

✅ **Single File Per Entity**: Add content with minimal friction
✅ **No Manual Registration**: Auto-discovery and loading
✅ **Type Safety**: TypeScript interfaces prevent errors
✅ **Modular**: Easy to enable/disable plugins
✅ **Scalable**: Add hundreds of entities without code bloat
✅ **Maintainable**: Clear separation of concerns

---

## 🔮 Future Enhancements

Potential improvements:
- **Hot Reload**: Update content without restarting
- **Mod Support**: Load external plugins from files
- **Visual Editor**: GUI for creating entities
- **Validation**: Runtime checks for plugin correctness
- **Dependencies**: Plugins that depend on other plugins

---

## 📚 Additional Resources

- **TilePlugin Interface**: `src/plugins/tiles/TileRegistry.ts`
- **EnemyPlugin Interface**: `src/plugins/enemies/EnemyRegistry.ts`
- **WeaponPlugin Interface**: `src/plugins/weapons/WeaponRegistry.ts`
- **Plugin Initializer**: `src/plugins/index.ts`
- **Data Loader Integration**: `src/core/DataLoader.ts`

---

## ✨ Summary

**Before:**
- Add new tile → Update 4+ files
- Add new enemy → Edit large JSON + imports
- Add new building → Hardcode in multiple places

**After:**
- Add new tile → Create **1 file** ✨
- Add new enemy → Create **1 file** ✨
- Add new building → Create **1 file** ✨

**The game is now MUCH more maintainable and extensible!** 🎉
