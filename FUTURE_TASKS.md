# Future Development Tasks

## How to Use This Task List

### Workflow

1. **Grab a Task**
   - Find a task marked as `[ ]` (not started)
   - Update it to `[WIP]` (work in progress)
   - Commit the change: `git commit -am "Start: [task name]"`

2. **Complete the Task**
   - Follow the task description
   - Use existing architecture patterns
   - Keep files under 200 lines
   - **MANDATORY: Write unit and integration tests** - All code changes must include tests that confirm functionality works
   - Test your changes: `npm run dev`
   - **MANDATORY: Take a screenshot** - After testing, capture a screenshot of the working game and save to `/screenshots/` folder with descriptive name
   - Ensure build works: `npm run build`

3. **Mark as Done**
   - Update task from `[WIP]` to `[x]`
   - Commit your work with descriptive message
   - Push to a feature branch
   - Update this file: `git commit -am "Complete: [task name]"`

### Task Priority Legend

- 🔥 **Critical** - Core gameplay improvements
- ⭐ **High** - Significant feature additions
- 💡 **Medium** - Nice-to-have enhancements
- 🎨 **Polish** - Visual and UX improvements

---

## Graphics & Visual Design

### Icons & Sprites

- [ ] 🎨 **Create SVG enemy sprites** - Design distinct SVG icons for each enemy type (slime = blob, goblin = small humanoid, dragon = dragon). Add to `src/rendering/EnemyIcons.ts` with rendering in `ExpeditionScreen.ts`. (~150 lines)

- [ ] 🎨 **Create ingredient SVG icons** - Design 8+ ingredient icons matching their types (jelly = wobbly, mushroom = cap, meat = steak). Create `src/rendering/IngredientIcons.ts` and integrate into `CookingScreen.ts` and inventory displays. (~200 lines)

- [ ] 🎨 **Create equipment visual indicators** - Design weapon and armor icons. Show equipped items visually in BaseScreen stats panel. Add `src/rendering/EquipmentIcons.ts`. (~100 lines)

- [ ] 🎨 **Add cooking method icons** - Create icons for boil (pot), fry (pan), grill (flames), bake (oven). Update `CookingScreen.ts` to display icons instead of just text. (~80 lines)

### Animations

- [ ] ⭐ **Combat animations** - Add attack/hit animations in `ExpeditionScreen.ts`. Enemy shakes when hit, player icon pulses during attack. Use SVG transforms and CSS transitions. (~150 lines)

- [ ] 💡 **Cooking animation** - Add bubbling/sizzling animation when cooking. Create particle effects in `src/rendering/ParticleSystem.ts` and trigger in `CookingScreen.ts`. (~180 lines)

- [ ] 💡 **Currency/item pickup animation** - Add floating +gold text and ingredient icons when gained. Create `src/rendering/FloatingText.ts` component. (~120 lines)

- [ ] 🎨 **Screen transition effects** - Add fade in/out or slide transitions between screens. Create `src/rendering/Transitions.ts` and integrate with `ScreenManager.ts`. (~150 lines)

- [ ] 🎨 **Buff indicator animations** - Add glowing effect around player when buffed. Create pulsing circles or particle effects. Update `BaseScreen.ts` to show active buffs visually. (~100 lines)

### UI/UX Improvements

- [ ] ⭐ **Responsive layout system** - Create adaptive layout that rearranges for portrait/landscape. Add `src/rendering/LayoutManager.ts` with breakpoint detection. (~180 lines)

- [ ] 💡 **Health/stats bars with gradients** - Replace text-only stats with visual bars. Add color gradients (green→yellow→red for health). Create `src/rendering/StatBars.ts`. (~120 lines)

- [ ] 🎨 **Tooltip system** - Hover/long-press on items shows detailed tooltips. Create `src/rendering/TooltipManager.ts` with positioning logic. (~160 lines)

- [ ] 🎨 **Sound effect system** - Add audio feedback (click, combat hit, cooking complete). Create `src/core/AudioManager.ts` with sound loading/playing. (~140 lines)

- [ ] 💡 **Background music system** - Add ambient music per screen. Create `src/core/MusicManager.ts` with fade in/out between tracks. (~100 lines)

---

## Game Design & Features

### New Game Systems

- [ ] 🔥 **Save/Load system** - Implement localStorage persistence. Create `src/systems/SaveSystem.ts` with auto-save and manual load. Add save slots. (~180 lines)

- [ ] ⭐ **Recipe discovery hints** - Add NPC/cookbook that gives hints for undiscovered recipes. Create `src/systems/HintSystem.ts` and `RecipeBookScreen.ts`. (~200 lines)

- [ ] ⭐ **Achievement system** - Track milestones (kill 10 slimes, discover 5 recipes, earn 1000 gold). Create `src/systems/AchievementSystem.ts` and `src/data/achievements.json`. (~190 lines)

- [ ] ⭐ **Quest system** - Add daily/weekly quests with rewards. Create `src/systems/QuestSystem.ts`, `QuestScreen.ts`, and `src/data/quests.json`. (~200 lines)

- [ ] 💡 **Restaurant rating system** - Track restaurant reputation based on dishes sold. Affects shop prices and unlock new recipes. Create `src/systems/ReputationSystem.ts`. (~150 lines)

- [ ] 💡 **Time/day cycle** - Add day counter with daily events. Different ingredients available per day. Create `src/systems/TimeSystem.ts`. (~130 lines)

- [ ] 💡 **Customer system** - NPCs visit restaurant with dish preferences. Create `src/systems/CustomerSystem.ts` and `CustomerScreen.ts`. (~200 lines)

- [ ] ⭐ **Skill tree system** - Player unlocks cooking techniques, combat abilities. Create `src/systems/SkillSystem.ts` and `SkillScreen.ts`. (~200 lines)

### Content Expansion

- [x] 🔥 **Add 10 more enemies** - Create varied enemies in `src/data/enemies.json` with unique stats and loot tables. Include boss variants. Test balance. (~50 lines JSON)

- [x] 🔥 **Add 20 more ingredients** - Expand ingredient variety in `src/data/ingredients.json`. Include legendary/exotic types. Organize by rarity tiers. (~100 lines JSON)

- [ ] ⭐ **Multiple expedition zones** - Add forest, cave, volcano zones with different enemies. Create `src/systems/ZoneSystem.ts` and update `ExpeditionScreen.ts`. (~180 lines)

- [ ] ⭐ **Boss battles** - Special high-difficulty enemies with better rewards. Create `src/systems/BossSystem.ts` with multi-phase combat. (~190 lines)

- [ ] 💡 **Seasonal ingredients** - Ingredients only available certain times. Create `src/systems/SeasonSystem.ts` linking to TimeSystem. (~120 lines)

- [ ] 💡 **Equipment sets** - Matching equipment gives bonuses. Add set definitions to `src/data/equipment.json` and bonus calculation logic. (~100 lines)

- [ ] 💡 **Consumable items** - Potions, buffs usable in combat. Create `src/data/consumables.json` and integrate into `ExpeditionScreen.ts`. (~150 lines)

### Combat Enhancements

- [ ] ⭐ **Turn-based combat overhaul** - Replace auto-combat with turn selection (attack/defend/item/flee). Update `src/systems/CombatSystem.ts`. (~200 lines)

- [ ] ⭐ **Special abilities** - Add skill-based attacks (power attack, multi-strike, heal). Create `src/systems/AbilitySystem.ts`. (~170 lines)

- [ ] 💡 **Enemy AI patterns** - Enemies use different strategies (aggressive, defensive, healer). Add AI logic to `CombatSystem.ts`. (~160 lines)

- [ ] 💡 **Status effects** - Poison, burn, freeze effects. Create `src/systems/StatusEffectSystem.ts` and integrate with combat. (~180 lines)

- [ ] 🎨 **Combat log improvements** - Better combat messaging with color coding and animations. Update `ExpeditionScreen.ts` rendering. (~100 lines)

### Cooking Enhancements

- [ ] ⭐ **Mini-game for cooking** - Add timing/pattern mini-game to improve dish quality. Create `src/systems/CookingMinigame.ts`. (~190 lines)

- [ ] ⭐ **Recipe tiers** - Common/rare/legendary recipes with special effects. Update `src/systems/CookingSystem.ts` with tier logic. (~140 lines)

- [ ] 💡 **Failed dishes** - Low quality attempts create "burnt" or "raw" dishes. Add failure states to `CookingSystem.ts`. (~80 lines)

- [ ] 💡 **Combo recipes** - Use dishes as ingredients to create mega-dishes. Update `CookingSystem.ts` to accept dish IDs. (~120 lines)

- [ ] 💡 **Cooking equipment upgrades** - Better ovens/tools improve quality. Create `src/data/cookingEquipment.json` and modifier system. (~150 lines)

---

## Game Balance & Economy

- [x] 🔥 **Combat balance pass** - Adjust all enemy stats, player base stats, and equipment values. Test difficulty curve. Document in `BALANCE_NOTES.md`. (~Testing + documentation)

- [x] 🔥 **Economy balance** - Adjust gold rewards, equipment costs, dish values. Ensure progression feels rewarding. Test and document. (~Testing + documentation)

- [ ] ⭐ **Dynamic pricing** - Shop prices fluctuate based on supply/demand. Create `src/systems/MarketSystem.ts`. (~160 lines)

- [ ] 💡 **Ingredient rarity balancing** - Adjust drop rates for all rarities. Create balanced loot tables. Update `enemies.json`. (~Testing + JSON updates)

- [ ] 💡 **Difficulty modes** - Easy/Normal/Hard modes with stat multipliers. Add to `GameState.ts` and create selection screen. (~130 lines)

### Progression Systems

- [ ] ⭐ **Level system** - Player levels up from combat XP. Stats increase per level. Create `src/systems/LevelSystem.ts`. (~180 lines)

- [ ] ⭐ **Equipment upgrading** - Enhance weapons/armor with materials. Create `src/systems/UpgradeSystem.ts` and upgrade UI. (~190 lines)

- [ ] 💡 **Prestige/New Game+** - Reset with bonuses. Create `src/systems/PrestigeSystem.ts` with permanent upgrades. (~170 lines)

---

## Quality of Life

- [x] ⭐ **Settings screen** - Volume controls, reset game, enable/disable animations. Create `SettingsScreen.ts` and `src/core/SettingsManager.ts`. (~180 lines)

- [ ] 💡 **Inventory management** - Sort/filter inventory. Add categories (ingredients/dishes/equipment). Update UI in all screens. (~150 lines)

- [ ] 💡 **Bulk actions** - Sell all dishes, quick cook previous recipe. Add to `ShopScreen.ts` and `CookingScreen.ts`. (~120 lines)

- [ ] 💡 **Statistics screen** - Track total enemies defeated, dishes created, gold earned. Create `StatsScreen.ts` and tracking in `GameState.ts`. (~160 lines)

- [ ] 🎨 **Tutorial system** - First-time walkthrough with tooltips. Create `src/systems/TutorialSystem.ts` with step-by-step guide. (~180 lines)

- [ ] 🎨 **Confirmation dialogs** - Confirm before selling/eating expensive items. Create `src/rendering/DialogManager.ts`. (~140 lines)

---

## Advanced Features

- [ ] ⭐ **Multiplayer trading** - Trade ingredients/dishes with other players. Create `src/systems/TradingSystem.ts` with API integration. (~200 lines)

- [ ] ⭐ **Leaderboards** - Global rankings for various stats. Create `src/systems/LeaderboardSystem.ts` with backend integration. (~180 lines)

- [ ] 💡 **Daily challenges** - Special limited-time objectives. Create `src/systems/ChallengeSystem.ts` linked to TimeSystem. (~170 lines)

- [ ] 💡 **Event system** - Seasonal events with exclusive content. Create `src/systems/EventSystem.ts` and event data structure. (~190 lines)

- [ ] 💡 **Crafting system** - Create equipment from raw materials. Create `src/systems/CraftingSystem.ts` and `CraftingScreen.ts`. (~200 lines)

---

## Technical Improvements

- [ ] ⭐ **Performance optimization** - Implement object pooling for SVG elements. Reduce re-renders. Add performance monitoring. (~150 lines)

- [ ] 💡 **Mobile gesture support** - Add swipe gestures for screen navigation. Create `src/core/GestureManager.ts`. (~160 lines)

- [ ] 💡 **Offline mode** - Full game works without internet. Add service worker and manifest. (~120 lines)

- [ ] 💡 **Accessibility features** - Screen reader support, high contrast mode, larger text option. Update all screens. (~Varies)

- [ ] 🎨 **Analytics integration** - Track user behavior (optional, privacy-respecting). Create `src/core/AnalyticsManager.ts`. (~100 lines)

---

## Testing & Documentation

- [ ] ⭐ **Unit tests** - Add tests for core systems (Combat, Cooking, Shop). Use Vitest. Create `src/**/*.test.ts` files. (~300+ lines)

- [ ] 💡 **E2E tests** - Full gameplay flow tests. Test complete game loops. (~200 lines)

- [ ] 🎨 **Video tutorial** - Create gameplay walkthrough video. Record and host. (Non-code task)

- [ ] 🎨 **Streamer mode** - Hide sensitive info, better spectator UI. Create `StreamerModeScreen.ts`. (~100 lines)

---

## Current Status

Total Tasks: 65
- Critical (🔥): 6
- High Priority (⭐): 24
- Medium Priority (💡): 28
- Polish (🎨): 12

Completed: 5
In Progress: 0
Not Started: 60

---

## Notes for Contributors

- Always run `npm run type-check` before committing
- Keep files under 200 lines (split if needed)
- Add new data to JSON files when possible
- Update relevant `HOW_TO_EXPAND.md` if you add new patterns
- Test on mobile browsers (Chrome DevTools mobile view minimum)
- Follow existing code style and architecture patterns
- Document complex logic with comments
- Emit events for state changes (use EventBus)
- **MANDATORY: Write tests** - Create unit and integration tests in `src/**/*.test.ts` files for all code changes
- **MANDATORY: Screenshot verification** - Save game screenshots to `/screenshots/` folder to confirm features work correctly

## Example Task Workflow

```bash
# 1. Grab a task
# Edit FUTURE_TASKS.md: Change [ ] to [WIP] for your chosen task
git commit -am "Start: Create SVG enemy sprites"

# 2. Create feature branch
git checkout -b feature/enemy-sprites

# 3. Do the work
# ... create files, test, iterate ...

# 4. Test thoroughly
npm run dev
npm run build

# 5. Commit and mark done
# Edit FUTURE_TASKS.md: Change [WIP] to [x]
git add -A
git commit -m "Add SVG enemy sprites with distinct designs

- Created EnemyIcons.ts with slime, goblin, dragon sprites
- Integrated into ExpeditionScreen.ts combat rendering
- Added hover effects and animations
- Tested on mobile and desktop"

# 6. Push
git push -u origin feature/enemy-sprites

# 7. Done! Pick next task
```

---

## Quick Wins (Start Here!)

Good first tasks for getting familiar with the codebase:

1. ✅ **Add 10 more enemies** - Just JSON editing
2. ✅ **Add 20 more ingredients** - Just JSON editing
3. ✅ **Combat balance pass** - Testing and tuning
4. ✅ **Create ingredient SVG icons** - Creative + simple integration
5. ✅ **Settings screen** - Standard UI screen following existing patterns

---

Happy coding! 🎮✨
