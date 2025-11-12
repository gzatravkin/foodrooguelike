/**
 * CookingRenderer - Handles all rendering for cooking screen
 */

import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import { CookingState } from './CookingState';
import { gameState } from '../core/GameState';

export class CookingRenderer {
    private renderer: SVGRenderer;
    private state: CookingState;

    constructor(renderer: SVGRenderer, state: CookingState) {
        this.renderer = renderer;
        this.state = state;
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

        // Quick select panel (if there are saved recipes)
        const savedRecipes = gameState.getSavedRecipeConfigs();
        if (savedRecipes && savedRecipes.length > 0) {
            this.renderQuickSelectPanel(100, 400);
        }

        // Selection summary
        this.renderSummary(100, savedRecipes && savedRecipes.length > 0 ? 530 : 450);

        // Result card
        if (this.state.getLastDish()) {
            this.renderResultCard(vb.width / 2, 550);
        }

        // Status bar at bottom
        this.renderStatusBar(vb.height - 50);

        // Message display
        const message = this.state.getMessage();
        if (message) {
            this.renderMessage(vb.width / 2, vb.height - 80, message);
        }
    }

    private renderControls(cx: number, y: number): void {
        const controls = 'TAB: Switch Section | ARROWS/WASD: Navigate | ENTER/SPACE: Select | 1-8: Quick Time | C/E: Cook | R: Recipes | ESC: Back';
        const text = this.renderer.createText(cx, y, controls, 14, '#AAA');
        text.setAttribute('text-anchor', 'middle');
        this.renderer.append(text);
    }

    private renderIngredientsColumn(x: number, y: number): void {
        const isActive = this.state.getCurrentSection() === 'ingredients';
        const titleColor = isActive ? '#FFD700' : '#888';

        // Section title
        const title = this.renderer.createText(x, y, '📦 INGREDIENTS', 22, titleColor);
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (isActive) {
            const hint = this.renderer.createText(x, y + 25, '[Active - Use ↑↓ to navigate]', 12, '#90EE90');
            this.renderer.append(hint);
        }

        // Get all available ingredients and stack them
        const allIngredients = cookingSystem.getAvailableIngredients();

        // Group ingredients by template ID
        const ingredientStacks = new Map<string, {template: any, ids: string[], count: number}>();
        allIngredients.forEach(id => {
            const template = entityFactory.getTemplate(id);
            if (template) {
                const templateId = template.id;
                if (!ingredientStacks.has(templateId)) {
                    ingredientStacks.set(templateId, {
                        template: template,
                        ids: [],
                        count: 0
                    });
                }
                const stack = ingredientStacks.get(templateId)!;
                stack.ids.push(id);
                stack.count++;
            }
        });

        // Convert to array and limit display
        const stackedIngredients = Array.from(ingredientStacks.values()).slice(0, 8);

        stackedIngredients.forEach((stack, i) => {
            const selectedCount = stack.ids.filter(id =>
                this.state.getSelectedIngredients().includes(id)
            ).length;
            const isCursor = isActive && this.state.getIngredientCursor() === i;

            let yPos = y + 50 + i * 32;

            // Cursor indicator
            if (isCursor) {
                const cursor = this.renderer.createText(x - 15, yPos + 4, '▶', 16, '#FFD700');
                this.renderer.append(cursor);
            }

            // Item background
            if (selectedCount > 0 || isCursor) {
                const bg = this.renderer.createRect(x, yPos - 10, 250, 28, selectedCount > 0 ? '#2E7D32' : '#444');
                bg.setAttribute('rx', '4');
                this.renderer.append(bg);
            }

            // Item text with count
            const color = selectedCount > 0 ? '#90EE90' : (isCursor ? '#FFF' : '#CCC');
            const prefix = selectedCount > 0 ? '✓ ' : '  ';
            const countText = stack.count > 1 ? ` (${selectedCount}/${stack.count})` : '';
            const text = this.renderer.createText(x + 10, yPos + 4, prefix + stack.template.name + countText, 16, color);
            this.renderer.append(text);
        });
    }

    private renderMethodsColumn(x: number, y: number): void {
        const isActive = this.state.getCurrentSection() === 'methods';
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
            const isSelected = this.state.getSelectedMethod() === id;
            const isCursor = isActive && this.state.getMethodCursor() === i;

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
        const isActive = this.state.getCurrentSection() === 'time';
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
        this.state.timePresets.forEach((time, i) => {
            const isSelected = this.state.getTimeCursor() === i;
            const isCursor = isActive && this.state.getTimeCursor() === i;

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
        const text = `Selected: ${this.state.getSelectedIngredients().length} ingredients, Method: ${this.state.getSelectedMethod() || 'none'}, Time: ${this.state.getCookingTime()}s`;
        const label = this.renderer.createText(x, y, text, 18, '#FFA500');
        label.setAttribute('font-weight', 'bold');
        this.renderer.append(label);
    }

    private renderQuickSelectPanel(x: number, y: number): void {
        const isActive = this.state.getCurrentSection() === 'quickselect';
        const titleColor = isActive ? '#FFD700' : '#888';

        // Section title
        const title = this.renderer.createText(x, y, '⚡ QUICK RECIPES', 22, titleColor);
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (isActive) {
            const hint = this.renderer.createText(x, y + 25, '[Active - Use ↑↓ to navigate, ENTER to load]', 12, '#90EE90');
            this.renderer.append(hint);
        }

        const savedRecipes = gameState.getSavedRecipeConfigs();
        const displayRecipes = savedRecipes.slice(0, 5);

        displayRecipes.forEach((recipe: any, i: number) => {
            const isCursor = isActive && this.state.getQuickSelectCursor() === i;
            let yPos = y + 50 + i * 20;

            // Cursor indicator
            if (isCursor) {
                const cursor = this.renderer.createText(x - 15, yPos + 4, '▶', 14, '#FFD700');
                this.renderer.append(cursor);
            }

            // Recipe text
            const color = isCursor ? '#FFD700' : '#CCC';
            const text = this.renderer.createText(x + 10, yPos + 4, `${i + 1}. ${recipe.recipeName}`, 14, color);
            this.renderer.append(text);
        });
    }

    private renderStatusBar(y: number): void {
        const canCook = this.state.canCook();
        const statusText = canCook
            ? '✓ Ready to cook! Press C or E to start cooking'
            : 'Select ingredients and method to cook';
        const statusColor = canCook ? '#90EE90' : '#FF6B6B';

        const status = this.renderer.createText(50, y, statusText, 18, statusColor);
        status.setAttribute('font-weight', 'bold');
        this.renderer.append(status);
    }

    private renderMessage(cx: number, y: number, message: string): void {
        const isError = message.includes('✗');
        const color = isError ? '#FF6B6B' : '#90EE90';

        const text = this.renderer.createText(cx, y, message, 16, color);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-weight', 'bold');
        this.renderer.append(text);
    }

    private renderResultCard(centerX: number, centerY: number): void {
        const dish = this.state.getLastDish();
        if (!dish) return;

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
}
