/**
 * CookingScreen - Where players combine ingredients to create dishes
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';

export class CookingScreen extends Screen {
    private selectedIngredients: string[] = [];
    private selectedMethod: string = '';
    private cookingTime: number = 60; // Default 60 seconds
    private resultMessage: string = '';
    private lastDish: any = null;

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'COOKING', 36, '#FFA500');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Ingredients section
        this.renderIngredients(50, 120);

        // Cooking methods
        this.renderCookingMethods(550, 120);

        // Cooking time selector
        this.renderCookingTimeSelector(50, 350);

        // Selected items
        this.renderSelection(50, 450);

        // Cook button
        if (this.selectedIngredients.length > 0 && this.selectedMethod) {
            const cookBtn = this.renderer.createButton(vb.width / 2 - 100, 550, 200, 60, 'COOK!', () => {
                this.cook();
            });
            this.renderer.append(cookBtn);
        }

        // Result card (enhanced visual feedback)
        if (this.lastDish) {
            this.renderResultCard(vb.width / 2, 630);
        }

        // Recipe book button
        const recipeBookBtn = this.renderer.createButton(vb.width / 2 - 100, vb.height - 100, 200, 50, '📖 RECIPE BOOK', () => {
            gameState.setCurrentScreen('recipebook');
        });
        this.renderer.append(recipeBookBtn);

        // Back button
        const backBtn = this.renderer.createButton(50, vb.height - 100, 150, 50, 'BACK', () => {
            gameState.setScreen('base');
        });
        this.renderer.append(backBtn);
    }

    private renderIngredients(x: number, y: number): void {
        const ingredients = cookingSystem.getAvailableIngredients();

        const label = this.renderer.createText(x, y, 'Available Ingredients:', 20, '#FFD700');
        this.renderer.append(label);

        ingredients.slice(0, 8).forEach((id, i) => {
            const ingredient = entityFactory.getTemplate(id);
            const isSelected = this.selectedIngredients.includes(id);

            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 35,
                200,
                30,
                ingredient?.name || id,
                () => this.toggleIngredient(id)
            );

            if (isSelected) {
                const rect = btn.querySelector('rect');
                if (rect) rect.setAttribute('fill', '#2E7D32');
            }

            this.renderer.append(btn);
        });
    }

    private renderCookingMethods(x: number, y: number): void {
        const methods = cookingSystem.getAvailableMethods();

        const label = this.renderer.createText(x, y, 'Cooking Methods:', 20, '#FFD700');
        this.renderer.append(label);

        methods.forEach((id, i) => {
            const method = entityFactory.getTemplate(id);
            const isSelected = this.selectedMethod === id;

            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 35,
                200,
                30,
                method?.name || id,
                () => this.selectMethod(id)
            );

            if (isSelected) {
                const rect = btn.querySelector('rect');
                if (rect) rect.setAttribute('fill', '#2E7D32');
            }

            this.renderer.append(btn);
        });
    }

    private renderCookingTimeSelector(x: number, y: number): void {
        const label = this.renderer.createText(x, y, 'Cooking Time:', 20, '#FFD700');
        this.renderer.append(label);

        // Time preset buttons
        const presets = [15, 30, 45, 60, 90, 120, 150, 180];
        presets.forEach((time, i) => {
            const isSelected = this.cookingTime === time;
            const btn = this.renderer.createButton(
                x + (i % 4) * 105,
                y + 30 + Math.floor(i / 4) * 40,
                100,
                35,
                `${time}s`,
                () => this.setCookingTime(time)
            );

            if (isSelected) {
                const rect = btn.querySelector('rect');
                if (rect) rect.setAttribute('fill', '#2E7D32');
            }

            this.renderer.append(btn);
        });

        // Display current time
        const timeText = this.renderer.createText(x + 450, y + 40, `Time: ${this.cookingTime}s`, 18, '#FFD700');
        this.renderer.append(timeText);
    }

    private renderSelection(x: number, y: number): void {
        const text = `Selected: ${this.selectedIngredients.length} ingredients, Method: ${this.selectedMethod || 'none'}, Time: ${this.cookingTime}s`;
        const label = this.renderer.createText(x, y, text, 18, '#aaa');
        this.renderer.append(label);
    }

    private setCookingTime(time: number): void {
        this.cookingTime = time;
        this.resultMessage = '';
        this.render();
    }

    private toggleIngredient(id: string): void {
        const index = this.selectedIngredients.indexOf(id);
        if (index > -1) {
            this.selectedIngredients.splice(index, 1);
        } else {
            this.selectedIngredients.push(id);
        }
        this.resultMessage = '';
        this.render();
    }

    private selectMethod(id: string): void {
        this.selectedMethod = id;
        this.resultMessage = '';
        this.render();
    }

    private cook(): void {
        const dish = cookingSystem.cook(this.selectedIngredients, this.selectedMethod, this.cookingTime);

        // Store dish separately from inventory
        gameState.addDish(dish.id);
        // Also register the dish as a template so it can be retrieved later
        entityFactory.registerTemplate(dish.id, dish);

        this.lastDish = dish;
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;

        this.render();
    }

    private renderResultCard(centerX: number, centerY: number): void {
        if (!this.lastDish) return;

        const dish = this.lastDish;
        const qualityPercent = Math.round(dish.quality * 100);

        // Rarity colors
        const rarityColors: Record<string, { bg: string; border: string }> = {
            common: { bg: '#4A4A4A', border: '#90EE90' },
            uncommon: { bg: '#2E5CB8', border: '#4FC3F7' },
            rare: { bg: '#8B35C1', border: '#BA68C8' },
            legendary: { bg: '#CC8800', border: '#FFD700' }
        };
        const colors = rarityColors[dish.rarity] || rarityColors['common'];

        // Card background
        const cardWidth = 500;
        const cardHeight = 120;
        const cardX = centerX - cardWidth / 2;
        const cardY = centerY - cardHeight / 2;

        const cardBg = this.renderer.createRect(cardX, cardY, cardWidth, cardHeight, colors.bg);
        cardBg.setAttribute('stroke', colors.border);
        cardBg.setAttribute('stroke-width', '3');
        cardBg.setAttribute('rx', '10');
        this.renderer.append(cardBg);

        // Success emoji and title
        const successText = this.renderer.createText(centerX, cardY + 30, `✨ ${dish.name} ✨`, 24, colors.border);
        successText.setAttribute('text-anchor', 'middle');
        successText.setAttribute('font-weight', 'bold');
        this.renderer.append(successText);

        // Rarity badge
        const rarityText = this.renderer.createText(centerX, cardY + 55, dish.rarity.toUpperCase(), 14, '#FFD700');
        rarityText.setAttribute('text-anchor', 'middle');
        this.renderer.append(rarityText);

        // Quality bar
        const barWidth = 200;
        const barHeight = 15;
        const barX = centerX - barWidth / 2;
        const barY = cardY + 65;

        // Background bar
        const barBg = this.renderer.createRect(barX, barY, barWidth, barHeight, '#333');
        barBg.setAttribute('rx', '3');
        this.renderer.append(barBg);

        // Quality fill
        const fillWidth = barWidth * dish.quality;
        const qualityColor = dish.quality >= 0.9 ? '#FFD700' : dish.quality >= 0.7 ? '#90EE90' : dish.quality >= 0.5 ? '#FFA500' : '#FF6347';
        const barFill = this.renderer.createRect(barX, barY, fillWidth, barHeight, qualityColor);
        barFill.setAttribute('rx', '3');
        this.renderer.append(barFill);

        // Quality percentage
        const qualityLabel = this.renderer.createText(centerX, barY + 12, `Quality: ${qualityPercent}%`, 12, '#FFF');
        qualityLabel.setAttribute('text-anchor', 'middle');
        this.renderer.append(qualityLabel);

        // Value
        const valueText = this.renderer.createText(centerX, cardY + 105, `Value: ${dish.value}g`, 16, '#FFD700');
        valueText.setAttribute('text-anchor', 'middle');
        this.renderer.append(valueText);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.cookingTime = 60;
        this.resultMessage = '';
        this.lastDish = null;
    }
}
