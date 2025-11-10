/**
 * RecipeBookScreen - Shows discovered recipes and hints for undiscovered ones
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import type { Recipe } from '../entities/types';

export class RecipeBookScreen extends Screen {
    private scrollOffset: number = 0;
    private maxScroll: number = 0;

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, '📖 RECIPE BOOK', 36, '#FFA500');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Get discovered recipes
        const discoveredRecipeIds = cookingSystem.getDiscoveredRecipes();
        const allRecipes = entityFactory.getAllRecipes();

        // Separate discovered and undiscovered recipes
        const discovered: Recipe[] = [];
        const undiscovered: Recipe[] = [];

        for (const recipe of allRecipes) {
            if (discoveredRecipeIds.includes(recipe.id)) {
                discovered.push(recipe);
            } else {
                undiscovered.push(recipe);
            }
        }

        // Sort by rarity
        const rarityOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3 };
        discovered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        undiscovered.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

        // Stats
        const statsText = `Discovered: ${discovered.length} / ${allRecipes.length}`;
        const stats = this.renderer.createText(vb.width / 2, 100, statsText, 18, '#90EE90');
        stats.setAttribute('text-anchor', 'middle');
        this.renderer.append(stats);

        // Render discovered recipes
        let yPos = 140;

        if (discovered.length > 0) {
            const header1 = this.renderer.createText(100, yPos, 'DISCOVERED RECIPES', 24, '#FFD700');
            header1.setAttribute('font-weight', 'bold');
            this.renderer.append(header1);
            yPos += 40;

            for (const recipe of discovered) {
                yPos = this.renderRecipeCard(recipe, 50, yPos, true);
            }
        }

        // Render undiscovered recipes (hints)
        if (undiscovered.length > 0) {
            yPos += 20;
            const header2 = this.renderer.createText(100, yPos, 'UNDISCOVERED RECIPES', 24, '#888');
            header2.setAttribute('font-weight', 'bold');
            this.renderer.append(header2);
            yPos += 40;

            for (const recipe of undiscovered) {
                yPos = this.renderRecipeCard(recipe, 50, yPos, false);
            }
        }

        this.maxScroll = Math.max(0, yPos - vb.height + 100);

        // Scroll indicators
        if (this.scrollOffset > 0) {
            const upArrow = this.renderer.createText(vb.width / 2, 120, '▲ Scroll Up', 14, '#888');
            upArrow.setAttribute('text-anchor', 'middle');
            this.renderer.append(upArrow);
        }
        if (this.scrollOffset < this.maxScroll) {
            const downArrow = this.renderer.createText(vb.width / 2, vb.height - 80, '▼ Scroll Down', 14, '#888');
            downArrow.setAttribute('text-anchor', 'middle');
            this.renderer.append(downArrow);
        }

        // Back button
        const backBtn = this.renderer.createButton(vb.width / 2 - 100, vb.height - 60, 200, 50, 'BACK', () => {
            gameState.setCurrentScreen('cooking');
        });
        this.renderer.append(backBtn);
    }

    private renderRecipeCard(recipe: Recipe, x: number, y: number, discovered: boolean): number {
        const vb = this.renderer.getViewBox();
        const cardHeight = discovered ? 120 : 80;
        const cardWidth = vb.width - 100;

        // Adjust for scroll
        const displayY = y - this.scrollOffset;

        // Skip if off-screen
        if (displayY + cardHeight < 100 || displayY > vb.height - 100) {
            return y + cardHeight + 20;
        }

        // Card background
        const rarityColors = {
            common: '#4A4A4A',
            uncommon: '#2E5CB8',
            rare: '#8B35C1',
            legendary: '#CC8800'
        };

        const bgColor = discovered ? rarityColors[recipe.rarity] : '#2A2A2A';
        const rect = this.renderer.createRect(x, displayY, cardWidth, cardHeight, bgColor);
        rect.setAttribute('stroke', discovered ? '#FFD700' : '#555');
        rect.setAttribute('stroke-width', '2');
        rect.setAttribute('rx', '8');
        this.renderer.append(rect);

        if (discovered) {
            // Recipe name
            const nameColor = recipe.rarity === 'legendary' ? '#FFD700' : '#FFF';
            const name = this.renderer.createText(x + 20, displayY + 30, recipe.name || recipe.id, 20, nameColor);
            name.setAttribute('font-weight', 'bold');
            this.renderer.append(name);

            // Rarity badge
            const rarityText = recipe.rarity.toUpperCase();
            const rarityBadge = this.renderer.createText(x + cardWidth - 20, displayY + 30, rarityText, 14, '#FFD700');
            rarityBadge.setAttribute('text-anchor', 'end');
            this.renderer.append(rarityBadge);

            // Ingredients
            const ingredients = entityFactory.getIngredients(recipe.ingredients);
            const ingredientNames = ingredients.map(ing => ing.name).join(', ');
            const ingText = this.renderer.createText(x + 20, displayY + 55, `Ingredients: ${ingredientNames}`, 14, '#90EE90');
            this.renderer.append(ingText);

            // Method and time
            const methodText = `Method: ${recipe.cookingMethod} | Time: ${recipe.cookingTime}s`;
            const method = this.renderer.createText(x + 20, displayY + 75, methodText, 14, '#4FC3F7');
            this.renderer.append(method);

            // Buff type
            const buffEmoji = recipe.buffType === 'health' ? '❤️' : recipe.buffType === 'attack' ? '⚔️' : '🛡️';
            const buffText = this.renderer.createText(x + 20, displayY + 95, `${buffEmoji} Buff: ${recipe.buffType}`, 14, '#FFA500');
            this.renderer.append(buffText);

        } else {
            // Mysterious recipe (hints only)
            const questionMarks = '???';
            const hintName = this.renderer.createText(x + 20, displayY + 30, questionMarks, 20, '#666');
            hintName.setAttribute('font-weight', 'bold');
            this.renderer.append(hintName);

            // Rarity hint
            const rarityHint = recipe.rarity.toUpperCase();
            const rarityText = this.renderer.createText(x + cardWidth - 20, displayY + 30, rarityHint, 14, '#666');
            rarityText.setAttribute('text-anchor', 'end');
            this.renderer.append(rarityText);

            // Ingredient count hint
            const hint = this.renderer.createText(x + 20, displayY + 55, `Requires ${recipe.ingredients.length} ingredients`, 14, '#666');
            this.renderer.append(hint);

            // Discovery hint
            const discoveryHint = this.renderer.createText(x + 20, displayY + 75, 'Cook with 70%+ quality to discover', 12, '#888');
            discoveryHint.setAttribute('font-style', 'italic');
            this.renderer.append(discoveryHint);
        }

        return y + cardHeight + 20;
    }

    handleInput(event: MouseEvent | TouchEvent | KeyboardEvent): void {
        if (!(event instanceof KeyboardEvent)) return;
        if (event.key === 'Escape') {
            gameState.setCurrentScreen('cooking');
            return;
        }

        // Scroll with arrow keys
        if (event.key === 'ArrowUp') {
            this.scrollOffset = Math.max(0, this.scrollOffset - 50);
            this.render();
        } else if (event.key === 'ArrowDown') {
            this.scrollOffset = Math.min(this.maxScroll, this.scrollOffset + 50);
            this.render();
        }
    }

    handleWheel(event: WheelEvent): void {
        event.preventDefault();
        this.scrollOffset = Math.max(0, Math.min(this.maxScroll, this.scrollOffset + event.deltaY * 0.5));
        this.render();
    }
}
