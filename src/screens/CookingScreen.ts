/**
 * CookingScreen - Keyboard-driven cooking interface
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import { eventBus } from '../core/EventBus';
import type { SVGRenderer } from '../rendering/SVGRenderer';

type Section = 'ingredients' | 'methods' | 'time';

export class CookingScreen extends Screen {
    private selectedIngredients: string[] = [];
    private selectedMethod: string = '';
    private cookingTime: number = 60;
    private lastDish: any = null;

    private currentSection: Section = 'ingredients';
    private ingredientCursor: number = 0;
    private methodCursor: number = 0;
    private timeCursor: number = 3; // Default to 60s (index 3)

    private timePresets: number[] = [15, 30, 45, 60, 90, 120, 150, 180];
    private keyListener: ((e: KeyboardEvent) => void) | null = null;

    constructor(renderer: SVGRenderer) {
        super(renderer);
        this.setupKeyboardControls();
    }

    private setupKeyboardControls(): void {
        this.keyListener = (e: KeyboardEvent) => {
            // Don't handle if not visible
            if (gameState.getState().currentScreen !== 'cooking') return;

            e.preventDefault();

            // Section switching with Tab
            if (e.key === 'Tab') {
                this.cycleSection();
                this.render();
                return;
            }

            // Go back with Escape - close the UI and return to gameplay
            if (e.key === 'Escape') {
                // Close the cooking UI by switching away from UI screens
                // This will resume the game without showing the base menu
                const currentState = gameState.getState();
                // Only go to base menu if we're not set to a UI screen, otherwise just close
                if (currentState.currentScreen === 'cooking') {
                    // Hide the UI overlay by setting to a non-UI screen value
                    (gameState as any).state.currentScreen = 'game';
                    eventBus.emit('screen:changed', 'game');
                }
                return;
            }

            // Cook with C key
            if (e.key === 'c' || e.key === 'C') {
                if (this.canCook()) {
                    this.cook();
                }
                return;
            }

            // Recipe book with R key
            if (e.key === 'r' || e.key === 'R') {
                gameState.setCurrentScreen('recipebook');
                return;
            }

            // Navigation
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.moveCursor(-1);
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.moveCursor(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.moveCursor(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.moveCursor(1);
            }

            // Selection with Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                this.selectCurrentItem();
            }

            // Number keys for quick time selection
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= 8) {
                this.timeCursor = num - 1;
                this.cookingTime = this.timePresets[this.timeCursor];
                this.render();
            }

            this.render();
        };

        window.addEventListener('keydown', this.keyListener);
    }

    private cycleSection(): void {
        const sections: Section[] = ['ingredients', 'methods', 'time'];
        const currentIndex = sections.indexOf(this.currentSection);
        this.currentSection = sections[(currentIndex + 1) % sections.length];
    }

    private moveCursor(delta: number): void {
        if (this.currentSection === 'ingredients') {
            const ingredients = cookingSystem.getAvailableIngredients().slice(0, 8);
            this.ingredientCursor = Math.max(0, Math.min(ingredients.length - 1, this.ingredientCursor + delta));
        } else if (this.currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            this.methodCursor = Math.max(0, Math.min(methods.length - 1, this.methodCursor + delta));
        } else if (this.currentSection === 'time') {
            this.timeCursor = Math.max(0, Math.min(this.timePresets.length - 1, this.timeCursor + delta));
            this.cookingTime = this.timePresets[this.timeCursor];
        }
    }

    private selectCurrentItem(): void {
        if (this.currentSection === 'ingredients') {
            const ingredients = cookingSystem.getAvailableIngredients().slice(0, 8);
            const ingredientId = ingredients[this.ingredientCursor];
            if (ingredientId) {
                this.toggleIngredient(ingredientId);
            }
        } else if (this.currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            const methodId = methods[this.methodCursor];
            if (methodId) {
                this.selectedMethod = methodId;
            }
        } else if (this.currentSection === 'time') {
            this.cookingTime = this.timePresets[this.timeCursor];
        }
    }

    private toggleIngredient(id: string): void {
        const index = this.selectedIngredients.indexOf(id);
        if (index > -1) {
            this.selectedIngredients.splice(index, 1);
        } else {
            this.selectedIngredients.push(id);
        }
        this.lastDish = null;
    }

    private canCook(): boolean {
        return this.selectedIngredients.length > 0 && this.selectedMethod !== '';
    }

    private cook(): void {
        const dish = cookingSystem.cook(this.selectedIngredients, this.selectedMethod, this.cookingTime);
        gameState.addDish(dish.id);
        entityFactory.registerTemplate(dish.id, dish);
        this.lastDish = dish;
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;
        this.timeCursor = 3;
        this.render();
    }

    render(): void {
        this.renderer.clear();
        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 50, 'COOKING', 36, '#FFA500');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Controls help
        this.renderControls(vb.width / 2, 90);

        // Three columns layout
        this.renderIngredientsColumn(100, 140);
        this.renderMethodsColumn(400, 140);
        this.renderTimeColumn(700, 140);

        // Selection summary
        this.renderSummary(100, 450);

        // Result card
        if (this.lastDish) {
            this.renderResultCard(vb.width / 2, 550);
        }

        // Status bar at bottom
        this.renderStatusBar(vb.height - 50);
    }

    private renderControls(cx: number, y: number): void {
        const controls = 'TAB: Switch Section | ARROWS/WASD: Navigate | ENTER/SPACE: Select | 1-8: Quick Time | C: Cook | R: Recipes | ESC: Back';
        const text = this.renderer.createText(cx, y, controls, 14, '#AAA');
        text.setAttribute('text-anchor', 'middle');
        this.renderer.append(text);
    }

    private renderIngredientsColumn(x: number, y: number): void {
        const isActive = this.currentSection === 'ingredients';
        const titleColor = isActive ? '#FFD700' : '#888';

        // Section title
        const title = this.renderer.createText(x, y, '📦 INGREDIENTS', 22, titleColor);
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (isActive) {
            const hint = this.renderer.createText(x, y + 25, '[Active - Use ↑↓ to navigate]', 12, '#90EE90');
            this.renderer.append(hint);
        }

        const ingredients = cookingSystem.getAvailableIngredients().slice(0, 8);

        ingredients.forEach((id, i) => {
            const ingredient = entityFactory.getTemplate(id);
            const isSelected = this.selectedIngredients.includes(id);
            const isCursor = isActive && this.ingredientCursor === i;

            let yPos = y + 50 + i * 32;

            // Cursor indicator
            if (isCursor) {
                const cursor = this.renderer.createText(x - 15, yPos + 4, '▶', 16, '#FFD700');
                this.renderer.append(cursor);
            }

            // Item background
            if (isSelected || isCursor) {
                const bg = this.renderer.createRect(x, yPos - 10, 250, 28, isSelected ? '#2E7D32' : '#444');
                bg.setAttribute('rx', '4');
                this.renderer.append(bg);
            }

            // Item text
            const color = isSelected ? '#90EE90' : (isCursor ? '#FFF' : '#CCC');
            const prefix = isSelected ? '✓ ' : '  ';
            const text = this.renderer.createText(x + 10, yPos + 4, prefix + (ingredient?.name || id), 16, color);
            this.renderer.append(text);
        });
    }

    private renderMethodsColumn(x: number, y: number): void {
        const isActive = this.currentSection === 'methods';
        const titleColor = isActive ? '#FFD700' : '#888';

        // Section title
        const title = this.renderer.createText(x, y, '🔥 METHODS', 22, titleColor);
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (isActive) {
            const hint = this.renderer.createText(x, y + 25, '[Active - Use ↑↓ to navigate]', 12, '#90EE90');
            this.renderer.append(hint);
        }

        const methods = cookingSystem.getAvailableMethods();

        methods.forEach((id, i) => {
            const method = entityFactory.getTemplate(id);
            const isSelected = this.selectedMethod === id;
            const isCursor = isActive && this.methodCursor === i;

            let yPos = y + 50 + i * 32;

            // Cursor indicator
            if (isCursor) {
                const cursor = this.renderer.createText(x - 15, yPos + 4, '▶', 16, '#FFD700');
                this.renderer.append(cursor);
            }

            // Item background
            if (isSelected || isCursor) {
                const bg = this.renderer.createRect(x, yPos - 10, 250, 28, isSelected ? '#2E7D32' : '#444');
                bg.setAttribute('rx', '4');
                this.renderer.append(bg);
            }

            // Item text
            const color = isSelected ? '#90EE90' : (isCursor ? '#FFF' : '#CCC');
            const prefix = isSelected ? '✓ ' : '  ';
            const text = this.renderer.createText(x + 10, yPos + 4, prefix + (method?.name || id), 16, color);
            this.renderer.append(text);
        });
    }

    private renderTimeColumn(x: number, y: number): void {
        const isActive = this.currentSection === 'time';
        const titleColor = isActive ? '#FFD700' : '#888';

        // Section title
        const title = this.renderer.createText(x, y, '⏱️  TIME', 22, titleColor);
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (isActive) {
            const hint = this.renderer.createText(x, y + 25, '[Active - Use ↔ or 1-8 keys]', 12, '#90EE90');
            this.renderer.append(hint);
        }

        // Display times in 2 columns
        this.timePresets.forEach((time, i) => {
            const isSelected = this.timeCursor === i;
            const isCursor = isActive && this.timeCursor === i;

            const col = Math.floor(i / 4);
            const row = i % 4;
            const xPos = x + col * 100;
            const yPos = y + 50 + row * 32;

            // Cursor indicator
            if (isCursor) {
                const cursor = this.renderer.createText(xPos - 15, yPos + 4, '▶', 16, '#FFD700');
                this.renderer.append(cursor);
            }

            // Item background
            if (isSelected || isCursor) {
                const bg = this.renderer.createRect(xPos, yPos - 10, 90, 28, isSelected ? '#2E7D32' : '#444');
                bg.setAttribute('rx', '4');
                this.renderer.append(bg);
            }

            // Item text
            const color = isSelected ? '#90EE90' : (isCursor ? '#FFF' : '#CCC');
            const text = this.renderer.createText(xPos + 10, yPos + 4, `${i + 1}. ${time}s`, 16, color);
            this.renderer.append(text);
        });
    }

    private renderSummary(x: number, y: number): void {
        const text = `Selected: ${this.selectedIngredients.length} ingredients, Method: ${this.selectedMethod || 'none'}, Time: ${this.cookingTime}s`;
        const label = this.renderer.createText(x, y, text, 18, '#FFA500');
        label.setAttribute('font-weight', 'bold');
        this.renderer.append(label);
    }

    private renderStatusBar(y: number): void {
        const canCook = this.canCook();
        const statusText = canCook
            ? '✓ Ready to cook! Press C to start cooking'
            : 'Select ingredients and method to cook';
        const statusColor = canCook ? '#90EE90' : '#FF6B6B';

        const status = this.renderer.createText(50, y, statusText, 18, statusColor);
        status.setAttribute('font-weight', 'bold');
        this.renderer.append(status);
    }

    private renderResultCard(centerX: number, centerY: number): void {
        if (!this.lastDish) return;

        const dish = this.lastDish;
        const qualityPercent = Math.round(dish.quality * 100);

        const rarityColors: Record<string, { bg: string; border: string }> = {
            common: { bg: '#4A4A4A', border: '#90EE90' },
            uncommon: { bg: '#2E5CB8', border: '#4FC3F7' },
            rare: { bg: '#8B35C1', border: '#BA68C8' },
            legendary: { bg: '#CC8800', border: '#FFD700' }
        };
        const colors = rarityColors[dish.rarity] || rarityColors['common'];

        const cardWidth = 500;
        const cardHeight = 120;
        const cardX = centerX - cardWidth / 2;
        const cardY = centerY - cardHeight / 2;

        const cardBg = this.renderer.createRect(cardX, cardY, cardWidth, cardHeight, colors.bg);
        cardBg.setAttribute('stroke', colors.border);
        cardBg.setAttribute('stroke-width', '3');
        cardBg.setAttribute('rx', '10');
        this.renderer.append(cardBg);

        const successText = this.renderer.createText(centerX, cardY + 30, `✨ ${dish.name} ✨`, 24, colors.border);
        successText.setAttribute('text-anchor', 'middle');
        successText.setAttribute('font-weight', 'bold');
        this.renderer.append(successText);

        const rarityText = this.renderer.createText(centerX, cardY + 55, dish.rarity.toUpperCase(), 14, '#FFD700');
        rarityText.setAttribute('text-anchor', 'middle');
        this.renderer.append(rarityText);

        const barWidth = 200;
        const barHeight = 15;
        const barX = centerX - barWidth / 2;
        const barY = cardY + 65;

        const barBg = this.renderer.createRect(barX, barY, barWidth, barHeight, '#333');
        barBg.setAttribute('rx', '3');
        this.renderer.append(barBg);

        const fillWidth = barWidth * dish.quality;
        const qualityColor = dish.quality >= 0.9 ? '#FFD700' : dish.quality >= 0.7 ? '#90EE90' : dish.quality >= 0.5 ? '#FFA500' : '#FF6347';
        const barFill = this.renderer.createRect(barX, barY, fillWidth, barHeight, qualityColor);
        barFill.setAttribute('rx', '3');
        this.renderer.append(barFill);

        const qualityLabel = this.renderer.createText(centerX, barY + 12, `Quality: ${qualityPercent}%`, 12, '#FFF');
        qualityLabel.setAttribute('text-anchor', 'middle');
        this.renderer.append(qualityLabel);

        const valueText = this.renderer.createText(centerX, cardY + 105, `Value: ${dish.value}g`, 16, '#FFD700');
        valueText.setAttribute('text-anchor', 'middle');
        this.renderer.append(valueText);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Keyboard-only interface
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;
        this.lastDish = null;
        this.currentSection = 'ingredients';
        this.ingredientCursor = 0;
        this.methodCursor = 0;
        this.timeCursor = 3;
    }
}
