# How to Add New Screens

Screens are the UI views of the game. Each screen is independent and handles its own rendering.

## Creating a New Screen

1. Create a new file: `YourScreen.ts`

```typescript
import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';

export class YourScreen extends Screen {
    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        // Clear previous content
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Create UI elements
        const title = this.renderer.createText(
            vb.width / 2,
            60,
            'YOUR SCREEN',
            36,
            '#FFD700'
        );
        title.setAttribute('text-anchor', 'middle');
        this.renderer.append(title);

        // Add buttons
        const btn = this.renderer.createButton(
            100,
            200,
            200,
            50,
            'Click Me',
            () => this.handleButtonClick()
        );
        this.renderer.append(btn);

        // Back button
        const back = this.renderer.createButton(
            50,
            vb.height - 100,
            150,
            50,
            'BACK',
            () => gameState.setScreen('base')
        );
        this.renderer.append(back);
    }

    private handleButtonClick(): void {
        // Your logic
        this.render(); // Re-render after changes
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Additional input handling if needed
    }

    cleanup(): void {
        // Clean up resources when leaving screen
    }
}
```

2. Register in `src/main.ts`:

```typescript
import { YourScreen } from './screens/YourScreen';

// In Game.init():
this.screenManager.registerScreen('yourscreen', new YourScreen(this.renderer));
```

3. Navigate to it:

```typescript
gameState.setScreen('yourscreen');
```

## SVG Rendering Helpers

The renderer provides these methods:

- `createRect(x, y, width, height, fill)` - Rectangle
- `createCircle(cx, cy, r, fill)` - Circle
- `createText(x, y, text, size, fill)` - Text
- `createButton(x, y, w, h, label, onClick)` - Interactive button
- `createGroup(id?)` - Group container
- `append(element)` - Add to screen

## Screen Layout Tips

```typescript
const vb = this.renderer.getViewBox();

// Center horizontally
const centerX = vb.width / 2;

// Common positions
const topArea = 100;
const middleArea = vb.height / 2;
const bottomArea = vb.height - 100;

// Grid layout
const columns = 3;
const itemWidth = 200;
const spacing = 50;

for (let i = 0; i < items.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);

    const x = 100 + col * (itemWidth + spacing);
    const y = 200 + row * 80;

    // Create item at position
}
```

## Mobile-Friendly Design

- Use large touch targets (50+ pixels)
- Avoid hover effects (use click/tap)
- Test different screen sizes
- Use `viewBox` for responsive scaling
- Add `touch-action: none` for dragging

## State Management in Screens

```typescript
// Get current game state
const state = gameState.getState();

// Display data
const text = this.renderer.createText(
    100, 100,
    `Gold: ${state.gold}`,
    20
);

// Update state
gameState.addGold(50);
this.render(); // Re-render to show changes
```

## Complex UI Components

For complex reusable components, create helper methods:

```typescript
private renderInventoryGrid(x: number, y: number): void {
    const items = gameState.getState().inventory;

    items.forEach((item, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);

        const group = this.renderer.createGroup();
        // Build item display...
        this.renderer.append(group);
    });
}
```

## Checklist

- [ ] Extend Screen base class
- [ ] Implement render() method
- [ ] Clear renderer at start of render
- [ ] Add back/navigation buttons
- [ ] Register in main.ts
- [ ] Test on mobile
- [ ] File under 200 lines
