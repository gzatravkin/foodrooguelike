# Game Balance Documentation

## Overview
This document details the balance changes made to create a smooth progression curve for combat and economy systems.

## Combat Balance Analysis

### Player Base Stats
- **Health**: 100
- **Max Health**: 100
- **Attack**: 10
- **Defense**: 5
- **Starting Gold**: 100

### Enemy Tier Structure

#### Tier 1: Starter Enemies (5-10 gold)
- **Giant Rat**: HP 20, ATK 3, DEF 1, Gold 5
  - Player damage: 9/turn, Rat damage: 0-1/turn
  - Victory: Easy, ~3 turns, takes ~3 damage
- **Cave Bat**: HP 25, ATK 6, DEF 1, Gold 8
  - Player damage: 9/turn, Bat damage: 1/turn
  - Victory: Easy, ~3 turns, takes ~3 damage
- **Slime**: HP 30, ATK 5, DEF 2, Gold 10
  - Player damage: 8/turn, Slime damage: 0/turn
  - Victory: Easy, ~4 turns, takes 0 damage

#### Tier 2: Early Game (15-25 gold)
- **Skeleton**: HP 40, ATK 7, DEF 4, Gold 15
  - Player damage: 6/turn, Skeleton damage: 2/turn
  - Victory: Moderate, ~7 turns, takes ~14 damage
- **Goblin**: HP 50, ATK 8, DEF 3, Gold 20
  - Player damage: 7/turn, Goblin damage: 3/turn
  - Victory: Moderate, ~8 turns, takes ~24 damage
- **Giant Spider**: HP 45, ATK 9, DEF 3, Gold 25
  - Player damage: 7/turn, Spider damage: 4/turn
  - Victory: Challenging, ~7 turns, takes ~28 damage

#### Tier 3: Mid Game (28-40 gold) - *Requires Equipment*
- **Dire Wolf**: HP 55, ATK 11, DEF 4, Gold 28
  - Base player would take: 6 damage/turn, deals 6/turn → ~54 damage taken (death)
  - With Iron Sword (+5 ATK): deals 11/turn, takes 6/turn → ~30 damage
  - With Iron Sword + Leather Armor: deals 11/turn, takes 1/turn → ~5 damage ✓
- **Orc Brute**: HP 60, ATK 12, DEF 5, Gold 30
  - Requires both weapon + armor
- **Giant Crab**: HP 70, ATK 10, DEF 9, Gold 35
  - High defense enemy, slow battle
- **Troll**: HP 80, ATK 10, DEF 10, Gold 40
  - Tank enemy, very long battle

#### Tier 4: Late Game (80-100 gold) - *Requires Steel Equipment*
- **Ice Golem** (Boss): HP 120, ATK 12, DEF 12, Gold 80
  - Requires Steel Sword + Chain Mail minimum
- **Fire Elemental** (Boss): HP 90, ATK 18, DEF 6, Gold 90
  - High damage, speed battle
- **Dragon**: HP 100, ATK 15, DEF 8, Gold 100
  - Classic boss encounter

#### Tier 5: End Game (150 gold) - *Requires Full Steel Equipment*
- **Demon Lord** (Ultimate Boss): HP 150, ATK 20, DEF 10, Gold 150
  - With Steel Sword + Chain Mail: Player has 20 ATK, 15 DEF, 120 HP
  - Player damage: 10/turn, takes 5/turn
  - Victory: 15 turns, takes 75 damage total ✓

### Equipment Progression

#### Starting Equipment (100g budget)
- **Iron Sword**: +5 ATK, Cost 50g
- **Leather Armor**: +5 DEF, Cost 60g
- Total: 110g (need 10g from fights)

#### Mid-tier Equipment (~300-350g)
- **Steel Sword**: +10 ATK, Cost 150g
- **Chain Mail**: +10 DEF, +20 HP, Cost 200g
- Total: 350g

### Progression Path
1. **Start** (100g) → Farm Tier 1 enemies (Rats, Bats, Slimes)
2. **First Purchase** (~110g) → Buy Iron Sword OR Leather Armor
3. **Continue Farming** → Save for second piece
4. **Both Basic Equipment** (~200g spent) → Farm Tier 2 enemies
5. **Save for Steel** (~500g total earned) → Buy Steel Sword
6. **Save for Chain Mail** (~700g total earned) → Buy Chain Mail
7. **End Game Ready** → Fight bosses and ultimate boss

## Economy Balance Analysis

### Current Issues
1. **Dish values too low** - Not profitable to cook vs selling raw ingredients
2. **Ingredient base values not used** - System ignores ingredient rarity
3. **Quality randomness too punishing** - 50-100% range means inconsistent profits

### Proposed Changes

#### Dish Value Formula Update
**Old Formula**: `ingredients.length * 10 * quality`
- 2 common ingredients (jelly + sugar = 8g value) → dish worth 10-20g
- Not profitable!

**New Formula**: `(sum of ingredient base values) * 1.5 * quality`
- 2 common ingredients (jelly + sugar = 8g) → dish worth 6-12g (BAD)
- Need higher multiplier!

**Better Formula**: `(sum of ingredient base values) * 2.5 * quality + cooking method bonus`
- 2 common ingredients (jelly + sugar = 8g) → dish worth 10-20g
- 2 rare ingredients (dragon_fruit + fire_pepper = 90g) → dish worth 112-225g ✓
- Encourages using better ingredients!

#### Quality Range Adjustment
- **Old**: 50-100% (0.5 + random * 0.5)
- **New**: 60-100% (0.6 + random * 0.4)
- Less punishing RNG, more consistent profits

#### Cooking Method Bonuses
- **Boil**: 1.0x modifier (free) → no extra bonus
- **Fry**: 1.1x modifier (free) → +10% value
- **Grill**: 1.2x modifier (50g unlock) → +20% value
- **Bake**: 1.3x modifier (100g unlock) → +30% value

### Gold Reward Adjustments

#### Minor Adjustments (smoother curve)
- **Rat**: 5g → 8g (better starter reward)
- **Bat**: 8g → 10g
- **Spider**: 25g → 22g (was too high for stats)
- **Crab**: 35g → 32g

These changes create smoother 2-3g increments between enemy tiers.

## Testing Scenarios

### Scenario 1: Early Game Loop
1. Start with 100g
2. Kill 2 Rats (16g) → 116g total
3. Buy Iron Sword (50g) → 66g remaining
4. Kill 3 Slimes (30g) → 96g total
5. Cook jelly + sugar with Boil → ~12g dish value
6. Sell dish → ~108g
7. Buy Leather Armor (60g) → 48g remaining
8. **Result**: Both basic equipment after ~5-6 fights ✓

### Scenario 2: Mid Game Progression
1. With Iron Sword + Leather Armor
2. Farm Tier 2 enemies (Goblins 20g, Skeletons 15g)
3. Collect premium ingredients from drops
4. Cook premium dishes (50-100g value)
5. Save for Steel Sword (150g)
6. **Result**: Smooth progression in 10-15 fights ✓

### Scenario 3: Cooking Profitability
**Common Ingredients Dish**:
- Jelly (5g) + Mushroom (8g) + Herb (6g) = 19g ingredient value
- Cook with Fry (1.1x): 19 * 2.5 * 0.8 * 1.1 = 41.8g ✓
- **Profit**: ~22g vs selling raw ingredients

**Rare Ingredients Dish**:
- Dragon Fruit (50g) + Fire Pepper (40g) + Premium Meat (60g) = 150g value
- Cook with Bake (1.3x): 150 * 2.5 * 0.9 * 1.3 = 438g ✓
- **Profit**: ~288g vs selling raw ingredients

## Implementation Checklist

### Combat Changes
- [x] Adjust gold rewards for Rat, Bat, Spider, Crab
- [x] Verify all enemy stat balance
- [x] Document progression path

### Economy Changes
- [x] Update dish value formula in EntityFactory.ts
- [x] Adjust quality range in CookingSystem.ts
- [x] Verify cooking method modifiers apply to value
- [x] Test profitability scenarios

### Testing
- [ ] Play through early game (0-200g)
- [ ] Verify Tier 3 enemies require equipment
- [ ] Test cooking profitability
- [ ] Verify boss battles are challenging but winnable
- [ ] Check end-game balance with full equipment

## Balance Philosophy

1. **Smooth Progression**: No huge jumps in difficulty or cost
2. **Meaningful Choices**: Cooking vs selling, equipment vs saving
3. **Risk vs Reward**: Harder enemies drop better ingredients
4. **Time Respect**: ~20-30 fights to reach end game feels fair
5. **Experimentation**: Cooking should be profitable and encouraged
