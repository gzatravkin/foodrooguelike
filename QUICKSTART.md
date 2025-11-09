# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open browser to http://localhost:5173

## Building

```bash
npm run build
npm run preview
```

## Game Controls

All controls are touch/click based - perfect for mobile!

### Base Camp Screen
- **EXPEDITION** - Hunt monsters for ingredients
- **COOKING** - Create dishes from ingredients
- **SHOP** - Buy equipment or sell/eat dishes

### Expedition Screen
- Click enemy to start combat
- Click **ATTACK** to fight
- Return to base when done

### Cooking Screen
- Click ingredients to select
- Click cooking method
- Click **COOK!** to create dish
- Experiment to discover recipes!

### Shop Screen
- Click equipment to buy
- Click **SELL** on dishes for gold
- Click **EAT** on dishes for combat buffs

## First Steps

1. Go to **EXPEDITION**
2. Fight a **Slime** (easiest enemy)
3. Collect ingredients (jelly, sugar)
4. Return to **BASE**
5. Go to **COOKING**
6. Select ingredients and a cooking method
7. Create your first dish!
8. Go to **SHOP**
9. Sell dish for gold OR eat it for buffs
10. Use gold to buy better equipment

## Tips

- Better equipment = stronger in combat
- Higher quality dishes = more value
- Eating dishes gives temporary combat bonuses
- Experiment with ingredient combinations
- Different cooking methods affect dish quality
- Tougher enemies drop better ingredients

## Adding Content

Want to add new content? It's easy!

### Add a New Enemy

Edit `src/data/enemies.json`:

```json
"newenemy": {
  "id": "newenemy",
  "type": "enemy",
  "name": "New Enemy",
  "description": "A new foe",
  "health": 60,
  "attack": 10,
  "defense": 5,
  "goldReward": 30,
  "lootTable": [
    { "itemId": "rare_item", "chance": 0.5 }
  ]
}
```

Refresh - done!

### Add a New Ingredient

Edit `src/data/ingredients.json`:

```json
"rare_item": {
  "id": "rare_item",
  "type": "ingredient",
  "name": "Rare Item",
  "description": "A rare drop",
  "rarity": "rare",
  "baseValue": 50
}
```

### More Info

Check the `HOW_TO_EXPAND.md` files in each `src/` folder for detailed guides!

## Troubleshooting

**Blank screen?**
- Open browser console (F12) for errors
- Ensure all files are present
- Try `npm install` again

**Build fails?**
- Run `npm run type-check`
- Check for TypeScript errors
- Ensure JSON files are valid

**Game doesn't respond?**
- Check console for errors
- Try hard refresh (Ctrl+Shift+R)
- Clear browser cache

## Next Steps

1. Read `README.md` for architecture overview
2. Check `ARCHITECTURE.md` for design patterns
3. Explore `HOW_TO_EXPAND.md` files
4. Add your own content!
5. Build something amazing!
