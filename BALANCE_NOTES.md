# Game Balance Documentation

## Overview
This document details the balance for the **2D top-view action roguelike** with real-time combat, enemy AI, and progression systems.

## Combat Balance Analysis

### Combat System Overview
- **Combat Type**: Real-time action combat (not turn-based)
- **Player Attack Rate**: 2 attacks per second (0.5s cooldown)
- **Enemy Attack Rate**: 1 attack per second (1.0s cooldown)
- **Damage Formula**: `max(1, attacker.attack - defender.defense)`
- **Combat Style**: Hit-and-run tactics (dodge, strike, retreat)

### Player Base Stats
- **Health**: 100
- **Max Health**: 100
- **Attack**: 10
- **Defense**: 5
- **Speed**: 150 pixels/second
- **Attack Range**: 40 pixels
- **Starting Gold**: 100

### Enemy AI Behavior
- **Chase Range**: 200 pixels (enemies detect and pursue player)
- **Attack Range**: 30 pixels (enemies must get close to attack)
- **Speed**: 80 pixels/second (slower than player - enables kiting)

### Tier Structure

#### Tier 1: Starter Enemies (5-10 gold)
*Safe for base player - teach movement and combat basics*

- **Giant Rat**: HP 20, ATK 3, DEF 1, Gold 5
  - Player damage per hit: 9
  - Rat damage per hit: 0 (max(1, 3-5) = 1 minimum)
  - Strategy: Easy to kill, barely damages player
  - Kills to defeat: ~3 attacks = 1.5 seconds

- **Cave Bat**: HP 25, ATK 6, DEF 1, Gold 8
  - Player damage per hit: 9
  - Bat damage per hit: 1
  - Strategy: Fast but weak, good kiting practice
  - Kills to defeat: ~3 attacks = 1.5 seconds

- **Slime**: HP 30, ATK 5, DEF 2, Gold 10
  - Player damage per hit: 8
  - Slime damage per hit: 1 (max(1, 5-5) = 1 minimum)
  - Strategy: Slow, tanky for tier 1, teaches patience
  - Kills to defeat: ~4 attacks = 2 seconds

**Tier 1 Summary**: Player can easily farm 5-10 gold per enemy with minimal damage taken. Good for learning controls.

#### Tier 2: Early Game (15-25 gold)
*Challenging without equipment - encourages first purchase*

- **Skeleton**: HP 40, ATK 7, DEF 4, Gold 15
  - Player damage per hit: 6
  - Skeleton damage per hit: 2
  - Without equipment: Risky, must dodge effectively
  - Kills to defeat: ~7 attacks = 3.5 seconds
  - If hit 3-4 times during fight: ~6-8 damage taken

- **Goblin**: HP 50, ATK 8, DEF 3, Gold 20
  - Player damage per hit: 7
  - Goblin damage per hit: 3
  - Without equipment: Dangerous, requires good kiting
  - Kills to defeat: ~8 attacks = 4 seconds
  - If hit 4-5 times: ~12-15 damage taken

- **Giant Spider**: HP 45, ATK 9, DEF 3, Gold 25
  - Player damage per hit: 7
  - Spider damage per hit: 4
  - Without equipment: Very challenging, must use hit-and-run
  - Kills to defeat: ~7 attacks = 3.5 seconds
  - If hit 3-4 times: ~12-16 damage taken

**Tier 2 Summary**: These enemies punish poor positioning. Player should buy Iron Sword or Leather Armor before attempting.

#### Tier 3: Mid Game (28-40 gold) - *Requires Equipment*
*Impossible without upgrades - forces progression*

- **Dire Wolf**: HP 55, ATK 11, DEF 4, Gold 28
  - **Without equipment**:
    - Player damage: 6/hit, Wolf damage: 6/hit
    - Kills to defeat: ~10 attacks = 5 seconds
    - Wolf lands 5+ hits → 30+ damage → VERY DANGEROUS
  - **With Iron Sword (+5 ATK)**:
    - Player damage: 11/hit → ~5 attacks = 2.5 seconds
    - Wolf damage: 6/hit → much safer if you dodge
  - **With Iron Sword + Leather Armor (+5 DEF)**:
    - Player damage: 11/hit
    - Wolf damage: 1/hit → Easy to survive ✓

- **Orc Brute**: HP 60, ATK 12, DEF 5, Gold 30
  - Requires weapon + armor minimum
  - High attack, must dodge or die quickly

- **Giant Crab**: HP 70, ATK 10, DEF 9, Gold 35
  - High defense = slow battle
  - Tests patience and positioning

- **Forest Troll**: HP 80, ATK 10, DEF 10, Gold 40
  - Tank enemy, longest battle in tier
  - Rewards good dodging skills

**Tier 3 Summary**: Entry barrier for mid-game. Requires both weapon AND armor to survive comfortably.

#### Tier 4: Late Game (80-100 gold) - *Requires Steel Equipment*
*Boss-tier enemies*

- **Ice Golem**: HP 120, ATK 12, DEF 12, Gold 80
  - **Requires**: Steel Sword + Chain Mail minimum
  - With Steel Sword (+10 ATK): Player has 20 ATK → 8 damage/hit
  - Kills to defeat: ~15 attacks = 7.5 seconds
  - Golem damage with Chain Mail (+10 DEF): 1 damage/hit ✓

- **Fire Elemental**: HP 90, ATK 18, DEF 6, Gold 90
  - High damage, glass cannon
  - ONE mistake = massive damage
  - Rewards perfect dodging

- **Dragon**: HP 100, ATK 15, DEF 8, Gold 100
  - Classic boss, balanced stats
  - Epic encounter

**Tier 4 Summary**: Requires full steel equipment. Tests mastery of combat system.

#### Tier 5: End Game (150 gold) - *Ultimate Challenge*

- **Demon Lord**: HP 150, ATK 20, DEF 10, Gold 150
  - **With Steel Sword + Chain Mail**:
    - Player: 20 ATK, 15 DEF, 120 HP
    - Player damage: 10/hit
    - Demon damage: 5/hit
  - Kills to defeat: ~15 attacks = 7.5 seconds
  - If hit 5-6 times: ~25-30 damage
  - **Strategy**: Must dodge most attacks, perfect execution required ✓

### Equipment Progression

#### Starting Gear (100g budget)
- **Iron Sword**: +5 ATK, Cost 50g
  - Increases damage output significantly
  - First recommended purchase
- **Leather Armor**: +5 DEF, Cost 60g
  - Reduces damage taken
  - Second purchase after sword

**Recommended path**:
1. Farm Tier 1 (Rats, Bats) → 50g
2. Buy Iron Sword (total spent: 50g)
3. Farm Tier 1 more → 60g
4. Buy Leather Armor (total spent: 110g)
5. Now safe to fight Tier 2

#### Mid-tier Equipment (~350g total)
- **Steel Sword**: +10 ATK, Cost 150g
  - Doubles attack bonus
  - Required for Tier 4
- **Chain Mail**: +10 DEF, +20 HP, Cost 200g
  - Doubles defense bonus + health boost
  - Required for Tier 4

**Path to steel gear**:
1. With Iron Sword + Leather Armor: Farm Tier 2 (15-25g each)
2. Need ~350g total for both steel items
3. Farm 15-20 Tier 2 enemies
4. Upgrade to steel
5. Ready for bosses

### Real-Time Combat Dynamics

#### Hit-and-Run Tactics
- **Player Speed**: 150 px/s
- **Enemy Speed**: 80 px/s
- **Strategy**: Attack → Retreat → Attack
  1. Move in range
  2. Attack (0.5s cooldown)
  3. Retreat while enemy chases
  4. Turn and attack again
  5. Repeat

#### Positioning Matters
- Enemies chase within 200 pixels
- Attack range is only 40 pixels (player) / 30 pixels (enemy)
- **Kiting**: Stay at edge of range, hit and run
- **Wall usage**: Trap enemies in corners for burst damage
- **Multi-enemy**: Fight one at a time, use speed advantage

#### Difficulty Factors
- **Enemy Count**: 5-10 enemies per dungeon
- **Respawn**: No respawns in dungeon
- **Death Penalty**: Lose 50% gold, respawn at base
- **Risk vs Reward**: Push deeper for more gold, risk losing it all

## Economy Balance

### Income Sources
1. **Combat**: 5-150 gold per enemy
2. **Cooking**: Sell dishes for ~2.5x ingredient value
3. **Progression**: Higher tier = more gold

### Major Expenses
1. **Iron Sword**: 50g (first priority)
2. **Leather Armor**: 60g (second priority)
3. **Steel Sword**: 150g (mid-game goal)
4. **Chain Mail**: 200g (mid-game goal)

### Progression Timeline

**Phase 1: Early Game (0-110g)**
- Farm 5-15 Tier 1 enemies
- Buy Iron Sword + Leather Armor
- Duration: ~5-10 minutes

**Phase 2: Mid Game (110-350g)**
- Farm 15-25 Tier 2 enemies
- Save for steel equipment
- Duration: ~15-20 minutes

**Phase 3: Late Game (350g+)**
- Farm Tier 3 enemies (28-40g each)
- Attempt Tier 4 bosses
- Challenge Demon Lord
- Duration: ~20-30 minutes

**Total Game Length**: 40-60 minutes for full progression

## Balance Insights

### What Works Well
✓ **Speed advantage**: Player can always escape (150 vs 80 speed)
✓ **Equipment gates**: Clear upgrade points (Iron → Steel)
✓ **Skill expression**: Good dodging reduces damage dramatically
✓ **Risk/reward**: Death penalty creates tension
✓ **Tier clarity**: Each tier has clear power levels

### Future Balance Adjustments
- [ ] Add more weapons with different stats (fast/slow, range variations)
- [ ] Enemy variety (ranged enemies, faster enemies, heavier enemies)
- [ ] Buff system from eating dishes (temporary stat boosts)
- [ ] Dungeon difficulty scaling (deeper = harder + better loot)
- [ ] Boss attack patterns (telegraphed attacks, dodge mechanics)

## Testing Notes

**Difficulty Targets**:
- Tier 1: Tutorial difficulty, forgiving
- Tier 2: Requires basic combat skill
- Tier 3: Requires equipment + good positioning
- Tier 4: Requires full gear + mastery
- Tier 5: Perfect execution required

**Player Feedback Goals**:
- "I can always escape if needed" (speed advantage)
- "I died because I made mistakes" (not RNG)
- "I need better gear to progress" (clear upgrade path)
- "I'm getting better at dodging" (skill improvement)
