# Building/Tile System Refactoring Proposal

## Problem Statement

Adding a new interactive building (like Character Customization) currently requires updating **8-9 different locations** across the codebase. This is error-prone and makes it easy to forget critical steps, leading to bugs like missing interaction prompts or non-functional E key interactions.

## Current Workflow Analysis

### Steps Required to Add a New Interactive Building

When adding a new building like "Character Customization", you must:

1. **Add TileType enum** in `src/systems/TileTypes.ts`
   ```typescript
   export enum TileType {
     // ...
     CHARACTER_CUSTOMIZATION = 28,
   }
   ```

2. **Create tile plugin definition** in `src/plugins/tiles/definitions/character_customization.ts`
   - Define appearance, walkability, rendering
   - Define interaction logic (but it's not used for prompts!)

3. **Import and register** in `src/plugins/tiles/index.ts`
   ```typescript
   import { CharacterCustomizationTile } from './definitions/character_customization';
   TileRegistry.register(CharacterCustomizationTile);
   ```

4. **Add screen type** to `src/core/GameState.ts`
   ```typescript
   currentScreen: 'menu' | 'shop' | ... | 'customization';
   ```

5. **Place tiles** in `src/systems/BaseCampGenerator.ts`
   ```typescript
   tiles[9][3] = TileType.CHARACTER_CUSTOMIZATION;
   ```

6. **Add interaction prompt check** in `src/screens/GameScreenUpdater.ts` ⚠️ **EASY TO FORGET!**
   ```typescript
   else if (tileType === TileType.CHARACTER_CUSTOMIZATION) {
     showPrompt = true;
     promptText = 'Press E to customize character';
   }
   ```

7. **Add E key handler** in `src/screens/GameScreen.ts` ⚠️ **EASY TO FORGET!**
   ```typescript
   else if (tileType === TileType.CHARACTER_CUSTOMIZATION) {
     gameState.setScreen('customization');
   }
   ```

8. **Add enum mapping** in `GameScreenUpdater.getTileIdFromType()` (for expedition interactions)

9. **Add duplicate mapping** in `GameScreen.getTileIdFromType()` (code duplication!)

### Issues Identified

1. **Too many scattered locations** - 8-9 different files to update
2. **Easy to forget steps** - Steps 6-7 are often missed (like in the bug we just fixed)
3. **Hardcoded if-else chains** - Not scalable, violates Open/Closed Principle
4. **Code duplication** - `getTileIdFromType()` exists in multiple places
5. **Unused plugin metadata** - Tile plugins define interactions but don't define prompts/screens
6. **No single source of truth** - Information scattered across multiple systems
7. **Inconsistency** - Some tiles (DINING_ROOM) don't have plugin definitions at all

## Proposed Solution

### Core Idea: Make Tile Plugins Self-Contained

Tile plugins should contain ALL information needed for their functionality:
- Visual appearance ✅ (already works)
- Interaction logic ✅ (already works)
- **Interaction prompt text** ⭐ NEW
- **Screen to open** ⭐ NEW
- **Base camp metadata** ⭐ NEW (placement info)

### Refactoring Strategy

#### Phase 1: Enhance Tile Plugin Interface

**Update `TilePlugin` interface:**

```typescript
export interface TilePlugin extends Plugin {
  id: string;
  name: string;
  color: string;
  walkable: boolean;
  blocksLight?: boolean;

  // Enhanced interaction metadata
  interaction?: {
    // Existing
    canInteract: (player: Player, tileX: number, tileY: number, mapSystem: MapSystem) => boolean;
    onInteract: (...) => void;
    onStepOn?: (...) => void;
    update?: (...) => void;

    // NEW: Interaction prompt configuration
    prompt?: {
      text: string;  // e.g., "Press E to customize character"
      key?: string;  // e.g., "E" (default)
    };

    // NEW: Screen navigation (for buildings)
    opensScreen?: GameData['currentScreen'];  // e.g., 'customization'
  };

  // NEW: Base camp placement metadata
  baseCamp?: {
    autoPlace?: boolean;  // Should this be automatically placed in base camp?
    location?: {          // Suggested placement location
      x: number;          // Tile X position
      y: number;          // Tile Y position
      width?: number;     // Multi-tile width (default: 1)
      height?: number;    // Multi-tile height (default: 1)
    };
    priority?: number;    // Placement priority (higher = placed first)
  };

  // Existing
  rendering?: TileRendering;
  dungeon?: { ... };
}
```

#### Phase 2: Generic Interaction System

**Refactor `GameScreenUpdater.checkTileInteractions()`:**

```typescript
checkTileInteractions(
  player: Player,
  mode: 'base' | 'expedition',
  mapSystem: MapSystem
): { showPrompt: boolean; promptText: string } {
  let showPrompt = false;
  let promptText = '';

  const tileType = mapSystem.getTileAt(player.x, player.y);

  if (mode === 'base' && tileType !== null) {
    // Generic approach: Look up tile plugin
    const tileId = this.getTileIdFromType(tileType);
    if (tileId) {
      const tilePlugin = TileRegistry.getTileById(tileId);
      if (tilePlugin?.interaction?.prompt) {
        showPrompt = true;
        promptText = tilePlugin.interaction.prompt.text;
      }
    }
  } else if (mode === 'expedition') {
    // ... existing expedition logic ...
  }

  return { showPrompt, promptText };
}
```

**Benefits:**
- No more hardcoded if-else chains!
- New buildings automatically get interaction prompts
- Single source of truth (the tile plugin)

#### Phase 3: Generic Screen Navigation

**Refactor `GameScreen.update()` E key handler:**

```typescript
if (this.inputHandler.handleInteract()) {
  const tileType = this.mapSystem.getTileAt(this.player.x, this.player.y);

  if (this.gameModeManager.getMode() === 'base' && tileType) {
    // Generic approach: Look up tile plugin
    const tileId = this.getTileIdFromType(tileType);
    if (tileId) {
      const tilePlugin = TileRegistry.getTileById(tileId);

      // If plugin defines a screen to open, open it
      if (tilePlugin?.interaction?.opensScreen) {
        gameState.setScreen(tilePlugin.interaction.opensScreen);
      }
      // Otherwise, call custom interaction handler
      else if (tilePlugin?.interaction?.onInteract) {
        tilePlugin.interaction.onInteract(
          this.player,
          tileX, tileY,
          this.mapSystem,
          (text, color) => this.addCombatLog(text, color),
          { /* context */ }
        );
      }
    }
  }
  // ... expedition logic ...
}
```

**Benefits:**
- No more hardcoded screen navigation!
- New buildings automatically open their screens
- Still supports custom interaction logic

#### Phase 4: Centralized TileType Mapping

**Option A: Auto-generate TileType enum from plugins**

Create a build-time script that generates the TileType enum from registered plugins:

```typescript
// Auto-generated file: src/systems/TileTypes.generated.ts
export enum TileType {
  FLOOR = 0,
  WALL = 1,
  // ... auto-generated from TileRegistry
  CHARACTER_CUSTOMIZATION = 28,
}
```

**Option B: Eliminate TileType enum entirely**

Use string IDs everywhere (requires more refactoring):
```typescript
tiles: string[][];  // Instead of TileType[][]
```

**Recommended:** Start with Option A (less disruptive)

#### Phase 5: Smart Base Camp Generator

**Option 1: Metadata-Driven Placement**

```typescript
class BaseCampGenerator {
  static generate(restaurantLocation?: string): GameMap {
    // ... create base map ...

    // Auto-place buildings based on metadata
    const buildingPlugins = TileRegistry.getAll().filter(p => p.baseCamp?.autoPlace);
    buildingPlugins.sort((a, b) => (b.baseCamp?.priority || 0) - (a.baseCamp?.priority || 0));

    for (const plugin of buildingPlugins) {
      const placement = plugin.baseCamp?.location;
      if (placement) {
        this.placeTile(tiles, plugin.id, placement.x, placement.y, placement.width, placement.height);
      }
    }

    return { width, height, tileSize, tiles, name: 'Base Camp' };
  }
}
```

**Option 2: Keep Manual Placement (Less Magic)**

Continue manual placement but use centralized constant:

```typescript
// src/systems/BaseCampLayout.ts
export const BASE_CAMP_LAYOUT = {
  CHARACTER_CUSTOMIZATION: { x: 9, y: 3, width: 2, height: 2 },
  SHOP: { x: 17, y: 2, width: 2, height: 2 },
  // ...
};
```

**Recommended:** Option 2 (more explicit, easier to understand)

### Updated Workflow: Adding a New Building

After refactoring, adding a new building would require:

1. ✅ **Create tile plugin** with complete metadata:
   ```typescript
   export const MyNewBuildingTile: TilePlugin = {
     id: 'my_new_building',
     name: 'My New Building',
     color: '#FF0000',
     walkable: true,
     interaction: {
       canInteract: () => true,
       onInteract: () => {},  // Or custom logic
       prompt: {
         text: 'Press E to enter My Building'
       },
       opensScreen: 'mynewscreen'  // ⭐ Automatically handles navigation!
     },
     rendering: { ... },
   };
   ```

2. ✅ **Register plugin** in `index.ts`:
   ```typescript
   TileRegistry.register(MyNewBuildingTile);
   ```

3. ✅ **Add screen type** to `GameState.ts` (unavoidable):
   ```typescript
   currentScreen: 'menu' | ... | 'mynewscreen';
   ```

4. ✅ **Place in base camp** in `BaseCampGenerator.ts`:
   ```typescript
   tiles[5][5] = TileType.MY_NEW_BUILDING;
   ```

**That's it!** 4 steps instead of 9, with automatic:
- ✅ Interaction prompt display
- ✅ E key handling
- ✅ Screen navigation

## Migration Path

### Step 1: Add new fields to existing tiles (non-breaking)

Update existing tile definitions to include `prompt` and `opensScreen`:

```typescript
// character_customization.ts
export const CharacterCustomizationTile: TilePlugin = {
  // ... existing fields ...
  interaction: {
    canInteract: () => true,
    onInteract: (player, tileX, tileY, mapSystem, onLog, context) => {
      if (context?.showCharacterCustomization) {
        context.showCharacterCustomization();
      }
    },
    prompt: { text: 'Press E to customize character' },  // NEW
    opensScreen: 'customization',  // NEW
  },
};
```

### Step 2: Update GameScreenUpdater.checkTileInteractions()

Add fallback logic that checks plugin metadata first, falls back to hardcoded:

```typescript
// Try plugin metadata first
const tilePlugin = TileRegistry.getTileById(tileId);
if (tilePlugin?.interaction?.prompt) {
  showPrompt = true;
  promptText = tilePlugin.interaction.prompt.text;
}
// Fallback to hardcoded (for backwards compatibility)
else if (tileType === TileType.SHOP) {
  showPrompt = true;
  promptText = 'Press E to enter Shop';
}
// ... etc
```

### Step 3: Update GameScreen E key handler

Similar fallback approach.

### Step 4: Migrate tiles one by one

Gradually update all interactive tiles to use the new system.

### Step 5: Remove hardcoded fallbacks

Once all tiles migrated, remove the if-else chains.

## Benefits Summary

### Before Refactoring
- ❌ 8-9 files to update
- ❌ Easy to forget steps (bugs!)
- ❌ Hardcoded logic scattered everywhere
- ❌ Code duplication
- ❌ Not scalable

### After Refactoring
- ✅ 4 files to update (56% reduction!)
- ✅ Hard to forget (metadata in one place)
- ✅ Generic, data-driven system
- ✅ No duplication
- ✅ Scalable - Open/Closed Principle
- ✅ Type-safe
- ✅ Self-documenting (tile metadata tells you everything)

## Risks & Considerations

### Risks
1. **Refactoring complexity** - Touching core systems is risky
2. **Testing effort** - Need to verify all existing buildings still work
3. **Breaking changes** - May affect existing code

### Mitigation
1. **Incremental approach** - Backwards-compatible migration path
2. **Fallback logic** - Keep hardcoded logic during transition
3. **Testing** - Manually test each building after migration
4. **Type safety** - TypeScript will catch many issues

## Recommendation

**Implement Phase 1-3 first** (Enhanced plugin interface + generic interaction/navigation)

This provides 80% of the benefit with minimal risk:
- Significantly reduces steps to add new buildings
- Eliminates the most common bugs (missing prompts/handlers)
- Backwards compatible
- Can be done incrementally

**Defer Phase 4-5** (TileType enum changes and smart placement) as they're more complex and provide diminishing returns.

## Next Steps

1. Review and approve this proposal
2. Create GitHub issue for tracking
3. Implement Phase 1: Update `TilePlugin` interface
4. Implement Phase 2: Refactor `GameScreenUpdater.checkTileInteractions()`
5. Implement Phase 3: Refactor `GameScreen` E key handler
6. Migrate existing tiles one by one
7. Remove hardcoded fallbacks
8. Document new workflow in PLUGIN_SYSTEM.md

## Example: Full Migration of Character Customization

### Before (Current)
Requires updates in 9 places across the codebase.

### After (Proposed)

**character_customization.ts:**
```typescript
export const CharacterCustomizationTile: TilePlugin = {
  id: 'character_customization',
  name: 'Character Customization',
  color: '#FF69B4',
  walkable: true,
  blocksLight: false,

  interaction: {
    canInteract: () => true,
    onInteract: () => {},  // Handled by opensScreen
    prompt: { text: 'Press E to customize character' },
    opensScreen: 'customization',
  },

  rendering: {
    render: (ctx, worldX, worldY, size) => {
      // ... existing rendering code ...
    },
  },
};
```

**GameState.ts:**
```typescript
currentScreen: 'menu' | ... | 'customization';
```

**BaseCampGenerator.ts:**
```typescript
tiles[9][3] = TileType.CHARACTER_CUSTOMIZATION;
```

**index.ts:**
```typescript
TileRegistry.register(CharacterCustomizationTile);
```

That's it! Everything else is automatic.
