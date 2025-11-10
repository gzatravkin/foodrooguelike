# Food Rogue-Like: Complete System Overview

## Project Structure

```
/src
├── core/                  # Core game infrastructure
│   ├── GameState.ts      # Central state management (singleton)
│   ├── GameLoop.ts       # Main game loop controller
│   ├── EventBus.ts       # Event system for communication
│   ├── InputManager.ts   # Input handling
│   └── DataLoader.ts     # Asset/data loading
├── entities/            # Game objects and entities
│   ├── Player.ts        # Player character
│   ├── Enemy.ts         # Enemy entities with AI
│   ├── Entity.ts        # Base entity class
│   ├── EntityFactory.ts # Factory for creating entities
│   └── types.ts         # Type definitions
├── systems/             # Core game systems
│   ├── CombatSystem.ts  # Combat calculations
│   ├── CookingSystem.ts # Recipe/cooking logic
│   ├── ShopSystem.ts    # Economy system
│   └── MapSystem.ts     # Tile-based map handling
├── screens/             # UI screens and game modes
│   ├── GameScreen.ts    # Main gameplay (top-down roguelike)
│   ├── BaseScreen.ts    # Hub/base camp
│   ├── CookingScreen.ts # Cooking interface
│   ├── ShopScreen.ts    # Shop/trading
│   ├── ExpeditionScreen.ts # Enemy selection for combat
│   └── SpawnManager.ts  # Enemy/trap spawning
└── data/                # Game data files
    ├── enemies.json     # Enemy definitions
    ├── weapons.json     # Weapon data
    ├── equipment.json   # Armor/equipment
    ├── ingredients.json # Ingredient definitions
    ├── recipes-*.json   # Recipe data by rarity
    ├── upgrades.json    # Upgrade definitions
    └── cookingMethods.json # Cooking method definitions
```

---

## 1. GAME STATE MANAGEMENT (`src/core/GameState.ts`)

**File:** `/home/user/foodrooguelike/src/core/GameState.ts`

The GameState is a **singleton** that manages all persistent game data:

### Core Data Structure:
```typescript
interface GameData {
    player: PlayerStats {
        health: number
        maxHealth: number
        attack: number
        defense: number
    }
    gold: number                    // Main currency
    inventory: string[]             // Ingredient items
    dishes: string[]                // Cooked dishes
    discoveredRecipes: string[]     // Learned recipe IDs
    currentScreen: 'base'|'shop'|'cooking'|'settings'|'restaurant'|'upgrades'|'recipebook'|'game'
    equipment: {
        weapon?: string
        armor?: string
    }
    activeBuffs: Array<{            // Active food/item buffs
        name: string
        duration: number
        effects: {
            attack?: number
            defense?: number
        }
    }>
    restaurant: {
        level: number
        location: string
        reputation: number
    }
    upgrades: {                     // Purchased upgrades (tracked by level)
        kitchen: Upgrade[]           // Cooking equipment upgrades
        restaurantUpgrades: Upgrade[]
        characterPerks: Upgrade[]    // Player stat upgrades
    }
}
```

### Key Methods:
- `addGold(amount)` - Earn gold, emits 'gold:changed'
- `addToInventory(itemId)` - Add ingredient
- `removeDish(dishId)` - Remove cooked dish
- `purchaseUpgrade(category, upgradeId)` - Buy an upgrade
- `addBuff(buff)` - Add temporary stat boost
- `tickBuffs()` - Decrement buff durations
- `saveGame()/loadGame()` - Persist to localStorage

**Initial State:**
- Health: 100/100
- Attack: 10, Defense: 5
- Gold: 0 (must earn through cooking/combat)
- Empty inventory and dishes

---

## 2. PLAYER STATS & ABILITIES SYSTEM (`src/entities/Player.ts`)

**File:** `/home/user/foodrooguelike/src/entities/Player.ts`

### Player Entity Properties:
```typescript
class Player extends Entity {
    weapon: Weapon | null          // Equipped weapon
    armor: Equipment | null        // Equipped armor
    gold: number = 100             // Entity-level gold (separate from GameState)
    attackCooldown: number         // Can't attack while > 0
    facingAngle: number            // Direction player faces
    
    // Dash system
    dashCooldown: number = 1.0     // Dash recharge time
    dashDuration: number = 0.15    // Dash lasts 150ms
    isDashing: boolean
    slowedDuration: number         // Slow effect after dash ends
    slowMultiplier: number = 0.3   // Move at 30% speed when slowed
}
```

### Player Stats:
- **Health:** 100 (upgradeable via "Healthy Eating" perk)
- **Attack:** 10 base + weapon damage
- **Defense:** 5 base + armor bonus
- **Speed:** 150 pixels/second (base)

### Player Abilities:
1. **Basic Attack** (0.5s cooldown default)
   - Cooldown depends on equipped weapon
   - Melee: shorter range (~40px), instant
   - Ranged: fires projectiles (300px+ range)

2. **Dash** (1.0s cooldown)
   - Duration: 0.15 seconds at 3x speed
   - Creates slow effect (0.3x speed) after dash ends for 1.0s
   - Upgradeable via "Nimble Feet" perk

3. **Equipment System**
   - Can equip one weapon and one armor
   - Armor adds defense/health bonuses
   - Weapons modify damage, attack speed, and range

### Combat Calculations:
```
Damage Dealt = (Player Attack + Weapon Damage) - Enemy Defense
Actual Damage = Max(1, damage_calculation)
```

---

## 3. ENEMY COMBAT & REWARD SYSTEMS (`src/entities/Enemy.ts`)

**File:** `/home/user/foodrooguelike/src/entities/Enemy.ts`

### Enemy Data Structure:
```typescript
interface EnemyData {
    id: string
    name: string
    health: number
    attack: number
    defense: number
    speed: number
    goldReward: number             // Dropped on defeat
    aiBehavior: 'standard'|'aggressive'|'defensive'|'ranged'|'ambusher'|'patrol'
    attackPattern: 'standard'|'charge'|'burst'|'strafe'|'retreat'
    weaponId: string              // Enemy's weapon
    lootTable: Array<{
        itemId: string            // Ingredient drop ID
        chance: number            // Drop probability (0-1)
    }>
}
```

### Enemies in Game (from `enemies.json`):

| Enemy | Health | Attack | Defense | Gold | AI Behavior | Attack Pattern | Notable Drops |
|-------|--------|--------|---------|------|-------------|----------------|---------------|
| Slime | 30 | 5 | 2 | 8 | Patrol | Standard | jelly (90%), sugar (50%), salt (30%) |
| Rat | 20 | 3 | 1 | 5 | Aggressive | Standard | meat (60%), herb (40%), flour (50%) |
| Bat | 25 | 6 | 1 | 10 | Aggressive | Strafe | jelly (50%), mushroom (70%), egg (40%) |
| Goblin | 50 | 8 | 3 | 12 | Ranged | Retreat | mushroom (80%), herb (60%), meat (50%), onion (40%), garlic (30%) |
| Dragon | 100 | 15 | 8 | 80 | Ranged | Strafe | dragon_fruit (95%), fire_pepper (80%), premium_meat (90%), phoenix_egg (30%) |

### AI Behaviors:

1. **Standard** - Basic chase and attack
2. **Aggressive** - 30% faster, larger detection range (300px), patrols actively
3. **Defensive** - 20% slower, smaller detection range (150px), retreats when low HP
4. **Ranged** - Maintains optimal distance (70% of attack range), kites around player
5. **Ambusher** - Waits still until player is 150px away, then triples speed and charges
6. **Patrol** - Patrols waypoints, switches to chase when player detected

### Attack Patterns:

1. **Standard** - Maintains position and attacks
2. **Charge** - Brief charge-up before attacking
3. **Burst** - Multiple quick attacks (3 shots) then long cooldown
4. **Strafe** - Circles around player while attacking
5. **Retreat** - Backs away after each attack (0.5s retreat duration)

### Loot System:

**Gold Drops:**
- Enemies drop gold directly on defeat
- Gold amount varies by enemy strength
- Slime: 8g, Goblin: 12g, Dragon: 80g

**Ingredient Drops:**
- Based on lootTable with random chance
- Examples:
  - Slimes drop jelly (90% chance)
  - Goblins drop mushrooms (80% chance), herbs (60%)
  - Dragons drop dragon_fruit (95% chance), fire_pepper (80%)

**Drop Modifiers:**
- "Ingredient Hunter" perk increases all drops by 10% per level
- "Premium Supplier Network" increases rare ingredient drops by 10% per level

---

## 4. GOLD/ECONOMY SYSTEM (`src/systems/ShopSystem.ts`)

**File:** `/home/user/foodrooguelike/src/systems/ShopSystem.ts`

### How Gold is Earned:

1. **Enemy Defeats**
   - Direct gold drops from enemies
   - Varies by enemy: 5g (Rat) to 80g (Dragon)
   - "Elite" enemies (random 20% spawn rate) drop 3x gold

2. **Selling Cooked Dishes**
   - Dishes have a `value` property calculated from:
     ```
     value = floor(baseValue × method_modifier × quality × 2.5)
     ```
   - Quality ranges from 0 to 1.0
   - Rarity affects value (legendary > rare > uncommon > common)
   - "Dining Area" upgrade increases sell prices by 15% per level

3. **Starting Gold**
   - Players start with 0 gold
   - Must farm/cook first to get initial capital

### How Gold is Spent:

1. **Equipment Purchases**
   ```
   Rusty Sword: 30g
   Iron Sword: 80g  
   Magic Staff: 120g
   Leather Armor: 60g
   Chain Mail: 200g
   ```

2. **Upgrade Purchases**
   - Kitchen upgrades: 80-200g base cost
   - Restaurant upgrades: 100-250g base cost
   - Character perks: 150-300g base cost
   - Cost multiplier: 1.5-2.0x per level (exponential cost growth)

### Economy Flow:
```
Fight Enemies → Drop Gold + Ingredients
              ↓
Gather Ingredients → Cook Dishes → Sell for Gold
              ↓
Spend Gold → Buy Equipment → Better Combat → Better Drops
         → Buy Upgrades → Better Cooking/Farming
```

---

## 5. EXPEDITION SYSTEM (`src/screens/ExpeditionScreen.ts`)

**File:** `/home/user/foodrooguelike/src/screens/ExpeditionScreen.ts`

### Expedition Overview:
Expeditions are turn-based combats where players select an enemy and fight until one is defeated.

### Expedition Flow:
1. Player selects an enemy from available list
2. Combat is simulated (not real-time action)
3. Combat calculation:
   ```
   Player Damage = Max(1, Player Attack - Enemy Defense)
   Enemy Damage = Max(1, Enemy Attack - Player Defense)
   
   Combat Loop:
   - Enemy takes damage each round
   - If enemy defeated → Player wins, gets gold + loot
   - Player takes damage each round
   - If player defeated → Player loses, returns to base damaged
   ```
4. After combat, player receives rewards or returns to base

### Combat Results:
- **Victory:** Receive enemy's gold reward + ingredient drops
- **Defeat:** Health reduced, no gold/loot, return to base

### Integration with Main Game:
- Expeditions can also be accessed via main `GameScreen` gameplay
- `MapSystem.createDungeon()` generates procedural dungeon levels
- `SpawnManager.spawnEnemies()` spawns enemies based on dungeon level

---

## 6. FOOD/ITEM SYSTEM (`src/systems/CookingSystem.ts`)

**File:** `/home/user/foodrooguelike/src/systems/CookingSystem.ts`

### Item Types:

1. **Ingredients** (gathered from enemies)
   ```typescript
   interface Ingredient {
       id: string
       type: "ingredient"
       name: string
       rarity: "common"|"uncommon"|"rare"|"legendary"
       baseValue: number
   }
   ```
   - Examples: jelly, sugar, meat, dragon_fruit, fire_pepper
   - Base value: 3-50 gold (legendary items worth more)

2. **Dishes** (cooked from ingredients)
   ```typescript
   interface Dish {
       id: string
       type: "dish"
       recipeId: string
       name: string
       ingredients: string[]
       cookingMethod: string
       cookingTime: number
       quality: number         // 0-1.0
       value: number          // Sell price
       rarity: "common"|"uncommon"|"rare"|"legendary"
       buffType: "health"|"attack"|"defense"
       effects: {
           health?: number     // Health restored
           attack?: number     // Attack buff
           defense?: number    // Defense buff
           duration: number    // Buff duration in seconds
       }
   }
   ```

### Cooking Mechanics:

**Recipe Matching Algorithm** (quality calculation):
1. **Ingredient Matching (60% weight)**
   - Matches player ingredients to recipe ingredients
   - Penalizes missing/extra ingredients
   - Score = (matched/required) - (extra × 0.1)

2. **Cooking Method Matching (20% weight)**
   - +0.2 if method matches recipe requirement
   - Methods: boil, grill, fry, bake

3. **Cooking Time Matching (20% weight)**
   - Each recipe has min/max/optimal time range
   - Closer to optimal = higher score within range
   - Outside range = rapid score decrease

**Final Quality:**
```
quality = ingredient_score × 0.6 + method_score × 0.2 + time_score × 0.2
quality = Clamp(0, 1.0, quality + upgrade_bonuses)
```

**Dish Value Calculation:**
```
baseValue = Sum(ingredient_values)
value = floor(baseValue × method_modifier × quality × 2.5)
```

### Recipes by Rarity:

**Common Recipes** (discovered early):
- Slime Pudding: jelly + sugar → Health buff
- Mushroom Soup: mushroom + herb + salt → Defense buff
- Grilled Meat: meat + salt + herb → Attack buff
- Fried Rice: rice + egg + onion + garlic → Health buff

**Uncommon/Rare/Legendary:** 
- More complex ingredient requirements
- Higher quality multipliers
- Better buff effects and duration

### Cooking Effects:

**Buff Duration:** 60-180 seconds (based on quality)

**Buff Strength:**
```
baseEffect = floor(quality × 20 × rarityMultiplier)

Rarity Multipliers:
- Common: 1.0
- Uncommon: 1.5
- Rare: 2.5
- Legendary: 4.0

Actual Buffs:
- Attack buff: baseEffect × 0.5
- Defense buff: baseEffect × 0.3
- Health: instant restoration (no duration)
```

---

## 7. UPGRADE & PROGRESSION SYSTEMS (`src/data/upgrades.json`)

**File:** `/home/user/foodrooguelike/src/data/upgrades.json`

### Three Upgrade Categories:

#### A. Kitchen Upgrades (Improve Cooking Quality)

| Upgrade | Max Level | Base Cost | Multiplier | Effect |
|---------|-----------|-----------|------------|--------|
| Better Oven | 5 | 100g | 1.5x | +10% baking quality/level |
| Premium Grill | 5 | 100g | 1.5x | +10% grilling quality/level |
| Professional Fryer | 5 | 80g | 1.5x | +10% frying quality/level |
| Master Cookware | 10 | 200g | 2.0x | +5% all cooking quality/level |
| Ingredient Preserver | 5 | 150g | 1.8x | +5% chance/level to not consume ingredients |

**Usage:** Bonuses applied automatically during cooking via `CookingSystem.applyUpgradeBonus()`

#### B. Restaurant Upgrades (Improve Economy)

| Upgrade | Max Level | Base Cost | Multiplier | Effect |
|---------|-----------|-----------|------------|--------|
| Dining Area | 5 | 120g | 1.6x | +15% dish sell price/level |
| Marketing Campaign | 5 | 100g | 1.5x | +20% reputation/level |
| Premium Supplier | 5 | 250g | 2.0x | +10% rare ingredient drop rate/level |
| Efficient Service | 5 | 150g | 1.7x | -5% optimal cooking time/level |

#### C. Character Perks (Improve Player Stats)

| Upgrade | Max Level | Base Cost | Multiplier | Effect |
|---------|-----------|-----------|------------|--------|
| Healthy Eating | 10 | 150g | 1.5x | +20 max health/level |
| Combat Training | 10 | 200g | 1.6x | +2 attack/level |
| Armor Proficiency | 10 | 180g | 1.5x | +1 defense/level |
| Chef Expertise | 5 | 300g | 2.0x | +20% food buff duration/level |
| Ingredient Hunter | 5 | 250g | 1.8x | +10% ingredient drop rate/level |
| Nimble Feet | 5 | 200g | 1.6x | -10% dash cooldown/level |

### Upgrade Cost Progression:

```
Cost(level) = baseCost × (costMultiplier ^ (level - 1))

Example - Better Oven:
Level 1: 100g
Level 2: 150g (100 × 1.5)
Level 3: 225g (100 × 1.5²)
Level 4: 337.5g
Level 5: 506.25g
Total for max: 1318.75g
```

### Progression Strategy:
1. **Early:** Combat Training + Healthy Eating for survivability
2. **Mid:** Ingredient Hunter to farm better loot
3. **Late:** Kitchen Upgrades for better cooking profit
4. **End-game:** Premium Supplier + Dining Area for peak farming

---

## 8. WEAPONS & EQUIPMENT SYSTEM (`src/data/weapons.json`, `equipment.json`)

**File:** `/home/user/foodrooguelike/src/data/weapons.json`

### Weapon Types:

**Melee Weapons:**
- Fists (0g): 5 damage, 0.5s attack speed
- Rusty Sword (30g): 8 damage, 0.6s speed
- Iron Sword (80g): 12 damage, 0.7s speed
- Steel Sword (150g): 15+ damage, varies

**Ranged Weapons:**
- Magic Staff (120g): 10 damage, 250px projectile speed, purple bolts
- Crossbow: 12 damage, multi-pellet spread
- Dragon Breath: 20 damage, 300px range (special)

### Weapon Properties:
```typescript
interface Weapon {
    id: string
    type: "weapon"
    name: string
    weaponType: "melee"|"ranged"
    damage: number              // Damage bonus to add to attack stat
    attackSpeed: number         // Cooldown between attacks
    range: number              // Attack range in pixels
    projectileSpeed: number    // For ranged weapons (0 = melee)
    pelletCount?: number       // For spread weapons
    spread?: number            // Angle spread for multi-shot
    projectileColor?: string
    projectileSize?: number
    projectileShape?: 'circle'|'beam'|'bolt'|'fire'
    trailColor?: string
    impactColor?: string
    rarity: "common"|"uncommon"|"rare"|"legendary"
    cost: number
}
```

### Equipment (Armor):

| Item | Cost | Defense | Health |
|------|------|---------|--------|
| Leather Armor | 60g | +5 def | - |
| Chain Mail | 200g | +10 def | +20 hp |

---

## 9. GAME LOOP & STATE MANAGEMENT (`src/core/GameLoop.ts`)

**File:** `/home/user/foodrooguelike/src/core/GameLoop.ts`

### Game Loop Architecture:

```
GameLoop (requestAnimationFrame)
    ↓
Main Game Loop [each frame]
    ├─ Input Handling (InputManager/InputHandler)
    ├─ Update Game State (GameScreenUpdater)
    │   ├─ Update player position/cooldowns
    │   ├─ Update enemy AI and position
    │   ├─ Check for collisions
    │   ├─ Process combat
    │   ├─ Tick buffs (duration decay)
    │   └─ Update particles
    ├─ Render Screen (GameScreenRenderer)
    │   ├─ Render map tiles
    │   ├─ Render entities (player, enemies)
    │   ├─ Render particles
    │   └─ Render UI (health, log, prompts)
    └─ Next Frame
```

### Screen State Management:

**Current Screen Types:**
- `'game'` - Main action gameplay (2D top-down)
- `'base'` - Base camp hub (shows stats, navigation)
- `'cooking'` - Cooking interface
- `'shop'` - Shop interface
- `'expedition'` - Turn-based combat selection
- `'settings'` - Game settings
- `'recipebook'` - Recipe discovery view
- `'restaurant'` - Restaurant management (future)

**Screen Transitions:**
```
base ←→ cooking
  ↓
shop
  ↓
game (main gameplay)
  ↓
expedition (combat system)
```

### Event Bus System (`src/core/EventBus.ts`):

Decoupled communication via events:
```
'gold:changed' → Update gold display
'player:updated' → Sync player stats
'inventory:changed' → Update item lists
'combat:finished' → Show results
'cooking:completed' → Add dish, emit discovered recipe
'shop:purchase' → Item purchased
'upgrade:purchased' → Upgrade level increased
'buff:added' → Show buff indicator
```

---

## 10. MAP SYSTEM & DUNGEON GENERATION (`src/systems/MapSystem.ts`)

**File:** `/home/user/foodrooguelike/src/systems/MapSystem.ts`

### Tile Types:

| Tile | Color | Walkable | Effects |
|------|-------|----------|---------|
| FLOOR | #2a2a2a | Yes | Normal |
| WALL | #555 | No | Obstacle |
| WATER | #1e90ff | Yes | Slows movement |
| LAVA | #ff4500 | Yes | Damage over time |
| ICE | #87ceeb | Yes | Slippery |
| GRASS | #228b22 | Yes | Normal |
| COOKING_STATION | #ff6b35 | Yes | Opens cooking menu |
| SHOP | #4ecdc4 | Yes | Opens shop |
| EXPEDITION_PORTAL | #9b59b6 | Yes | Enter expeditions |
| HEALTH_FOUNTAIN | #ff69b4 | Yes | Restore health |
| TREASURE_CHEST | #ffd700 | Yes | Gold/items |
| SHRINE | #daa520 | Yes | Stat buffs |
| SPIKE_TRAP | #8b0000 | Yes | Damage |
| POISON_TRAP | #32cd32 | Yes | Poison damage |

### Dungeon Generation:

**Procedural Generation Algorithm:**
1. Create random number of rooms (4-12 based on level)
2. Rooms are 5-12 tiles wide/tall
3. Connect rooms with L-shaped corridors
4. Add themed special tiles (water, lava, ice, grass)
5. Place features in room centers (fountains, shrines, chests, traps)
6. Ensure spawn point is walkable
7. Validate entire map before returning

**Difficulty Scaling:**
```
Level 1-3: 30×20 map, 4-8 rooms, 8-20 enemies
Level 4-6: 35×25 map, 6-10 rooms, 10-25 enemies
Level 7+:  40×30 map, 8-12 rooms, 12-30 enemies
```

### Base Camp Layout:
- Cooking stations (top-left)
- Shop (top-right)
- Expedition portal (bottom-center)
- Player spawn in center

---

## SYSTEM INTEGRATION DIAGRAM

```
╔════════════════════════════════════════════════════════╗
║                     GAME STATE                         ║
║  (Central Singleton - All game data lives here)        ║
║  - Player stats, gold, inventory, dishes              ║
║  - Equipment, upgrades, buffs                         ║
║  - Screen state, restaurant data                      ║
╚════════════════════════════════════════════════════════╝
              ↑              ↑              ↑
              │              │              │
        ┌─────┴─────┐  ┌────┴────┐  ┌──────┴──────┐
        │ CombatSys │  │CookingSys│  │ ShopSystem  │
        │           │  │          │  │             │
        │ Calculates│  │ Matches  │  │ Buys/sells  │
        │ damage    │  │ recipes  │  │ equipment   │
        │ Rewards   │  │ Creates  │  │ Manages $   │
        │ gold/loot │  │ dishes   │  │ value       │
        └─────┬─────┘  └────┬────┘  └──────┬──────┘
              │              │              │
              └──────┬───────┴──────┬───────┘
                     │              │
                  ╔══════════════════════════╗
                  ║   ENTITY FACTORY         ║
                  ║   Creates/retrieves:     ║
                  ║   - Weapons, Equipment   ║
                  ║   - Ingredients, Dishes  ║
                  ║   - Recipes, Upgrades    ║
                  ║   - Enemies, Items       ║
                  ╚══════════════════════════╝

         INPUT → GAME LOOP → RENDER
              (60 FPS ideal)
              - Update positions
              - Check collisions
              - Process combat
              - Tick timers/buffs
              - Render screen
```

---

## KEY DATA FLOWS

### Farm-to-Wealth Flow:
```
Expedition: Fight Enemy
    ↓
Enemy Drops: Gold (direct) + Ingredients (random)
    ↓
Inventory: Ingredients collected
    ↓
Cooking: Select ingredients + method + time
    ↓
CookingSystem: Matches recipe → calculates quality
    ↓
Result: Dish with value based on quality × rarity
    ↓
Shop: Sell dish for gold
    ↓
Gold: Accumulate for upgrades/equipment
```

### Combat Flow:
```
Enemy Spawned (MapSystem)
    ↓
Enemy AI (updateAI):
- Detect player (chaseRange)
- Update behavior state
- Execute movement pattern
- Check if can attack
    ↓
Combat Check (InputHandler/CombatSystem):
- Player attacks enemy
- Calculate damage = (attack - defense), min 1
- Check if enemy defeated
- Process rewards
    ↓
Rewards Given:
- Gold added to GameState
- Items added to inventory
- Emit events for UI update
```

### Upgrade Application Flow:
```
Purchase Upgrade (ShopSystem)
    ↓
GameState.purchaseUpgrade()
    ↓
Store in upgrades[category][]
    ↓
Active Use:
- Cooking: Applied in CookingSystem.applyUpgradeBonus()
- Stats: Applied in Player.getAttackDamage() etc
- Equipment: Applied automatically on equip
```

---

## NOTABLE GAME MECHANICS

1. **Buff System:**
   - Only ONE buff can be active at a time
   - Food buffs replace previous buffs
   - Duration ticks down each game loop
   - Removed when duration reaches 0

2. **Quality-Based Value:**
   - Dish value scales from 0-1.0 quality
   - Affects both selling price and buff strength
   - Matching recipe perfectly = 1.0 quality
   - Random dishes = 0.5-0.7 quality (50-70% value)

3. **Dash Mechanics:**
   - 3x speed boost for 0.15 seconds
   - Creates 0.3x speed slow for 1.0 second after
   - 1.0 second recharge
   - Upgradeable for faster recharge

4. **Enemy Scaling:**
   - Spawned based on dungeon level
   - Higher levels = stronger enemies
   - 20% chance for "elite" variants (2x stats, 3x gold)
   - 30% chance for "horde" event (2x enemy count)

5. **Ingredient Preservation:**
   - Normally 100% consumed when cooking
   - "Ingredient Preserver" upgrade: 5% chance per level to NOT consume
   - Can farm more efficiently with this upgrade

---

## FILE LOCATIONS - QUICK REFERENCE

| System | File |
|--------|------|
| State Management | `/src/core/GameState.ts` |
| Combat Calculation | `/src/systems/CombatSystem.ts` |
| Cooking/Recipes | `/src/systems/CookingSystem.ts` |
| Economy/Shops | `/src/systems/ShopSystem.ts` |
| Map/Dungeons | `/src/systems/MapSystem.ts` |
| Player Entity | `/src/entities/Player.ts` |
| Enemy Entity | `/src/entities/Enemy.ts` |
| Enemy Data | `/src/data/enemies.json` |
| Weapon Data | `/src/data/weapons.json` |
| Equipment Data | `/src/data/equipment.json` |
| Ingredient Data | `/src/data/ingredients.json` |
| Recipe Data | `/src/data/recipes-*.json` |
| Upgrade Data | `/src/data/upgrades.json` |
| Main Game Screen | `/src/screens/GameScreen.ts` |
| Base Camp UI | `/src/screens/BaseScreen.ts` |
| Cooking UI | `/src/screens/CookingScreen.ts` |
| Shop UI | `/src/screens/ShopScreen.ts` |
| Expedition UI | `/src/screens/ExpeditionScreen.ts` |
| Spawn Manager | `/src/screens/SpawnManager.ts` |

