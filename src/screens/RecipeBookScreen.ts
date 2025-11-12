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

        // Semi-transparent dark background overlay
        const bgOverlay = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(15, 15, 25, 0.95)');
        this.renderer.append(bgOverlay);

        // Title with gradient-like effect using multiple text elements
        const titleShadow = this.renderer.createText(vb.width / 2 + 2, 62, '📖 RECIPE BOOK', 38, 'rgba(255, 165, 0, 0.3)');
        titleShadow.setAttribute('text-anchor', 'middle');
        titleShadow.setAttribute('font-weight', 'bold');
        this.renderer.append(titleShadow);

        const title = this.renderer.createText(vb.width / 2, 60, '📖 RECIPE BOOK', 38, '#FFA500');
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

        // Stats panel with background
        const statsBg = this.renderer.createRect(vb.width / 2 - 150, 85, 300, 35, 'rgba(30, 30, 40, 0.8)');
        statsBg.setAttribute('rx', '8');
        statsBg.setAttribute('stroke', '#90EE90');
        statsBg.setAttribute('stroke-width', '2');
        this.renderer.append(statsBg);

        const statsText = `Discovered: ${discovered.length} / ${allRecipes.length}`;
        const stats = this.renderer.createText(vb.width / 2, 108, statsText, 18, '#90EE90');
        stats.setAttribute('text-anchor', 'middle');
        stats.setAttribute('font-weight', 'bold');
        this.renderer.append(stats);

        // Render discovered recipes
        let yPos = 150;

        if (discovered.length > 0) {
            // Section header with background
            const headerBg = this.renderer.createRect(80, yPos - 20, 840, 40, 'rgba(255, 215, 0, 0.15)');
            headerBg.setAttribute('rx', '8');
            this.renderer.append(headerBg);

            const header1 = this.renderer.createText(100, yPos + 5, '✨ DISCOVERED RECIPES', 24, '#FFD700');
            header1.setAttribute('font-weight', 'bold');
            this.renderer.append(header1);
            yPos += 50;

            for (const recipe of discovered) {
                yPos = this.renderRecipeCard(recipe, 80, yPos, true);
            }
        }

        // Render undiscovered recipes (hints)
        if (undiscovered.length > 0) {
            yPos += 20;

            // Section header with background
            const headerBg = this.renderer.createRect(80, yPos - 20, 840, 40, 'rgba(136, 136, 136, 0.15)');
            headerBg.setAttribute('rx', '8');
            this.renderer.append(headerBg);

            const header2 = this.renderer.createText(100, yPos + 5, '🔒 UNDISCOVERED RECIPES', 24, '#999');
            header2.setAttribute('font-weight', 'bold');
            this.renderer.append(header2);
            yPos += 50;

            for (const recipe of undiscovered) {
                yPos = this.renderRecipeCard(recipe, 80, yPos, false);
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
        const cardHeight = discovered ? 130 : 90;
        const cardWidth = vb.width - 160;

        // Adjust for scroll
        const displayY = y - this.scrollOffset;

        // Skip if off-screen
        if (displayY + cardHeight < 100 || displayY > vb.height - 100) {
            return y + cardHeight + 25;
        }

        // Enhanced card background with rarity colors
        const rarityColors = {
            common: { bg: 'rgba(74, 74, 74, 0.9)', border: '#6B6B6B', glow: 'rgba(107, 107, 107, 0.3)' },
            uncommon: { bg: 'rgba(33, 150, 243, 0.25)', border: '#2196F3', glow: 'rgba(33, 150, 243, 0.4)' },
            rare: { bg: 'rgba(156, 39, 176, 0.25)', border: '#9C27B0', glow: 'rgba(156, 39, 176, 0.4)' },
            legendary: { bg: 'rgba(255, 152, 0, 0.3)', border: '#FF9800', glow: 'rgba(255, 152, 0, 0.5)' }
        };

        const colors = discovered ? rarityColors[recipe.rarity] :
            { bg: 'rgba(42, 42, 50, 0.8)', border: '#555', glow: 'rgba(85, 85, 85, 0.2)' };

        // Drop shadow effect
        const shadow = this.renderer.createRect(x + 4, displayY + 4, cardWidth, cardHeight, 'rgba(0, 0, 0, 0.4)');
        shadow.setAttribute('rx', '12');
        this.renderer.append(shadow);

        // Glow effect for discovered recipes
        if (discovered) {
            const glow = this.renderer.createRect(x - 2, displayY - 2, cardWidth + 4, cardHeight + 4, colors.glow);
            glow.setAttribute('rx', '14');
            this.renderer.append(glow);
        }

        // Main card background
        const rect = this.renderer.createRect(x, displayY, cardWidth, cardHeight, colors.bg);
        rect.setAttribute('stroke', colors.border);
        rect.setAttribute('stroke-width', discovered ? '3' : '2');
        rect.setAttribute('rx', '12');
        this.renderer.append(rect);

        if (discovered) {
            // Recipe name with icon
            const nameColor = recipe.rarity === 'legendary' ? '#FFD700' : '#FFFFFF';
            const name = this.renderer.createText(x + 25, displayY + 32, `🍽️ ${recipe.name || recipe.id}`, 22, nameColor);
            name.setAttribute('font-weight', 'bold');
            this.renderer.append(name);

            // Rarity badge with background
            const rarityText = recipe.rarity.toUpperCase();
            const rarityColors = {
                common: '#8BC34A',
                uncommon: '#2196F3',
                rare: '#9C27B0',
                legendary: '#FFD700'
            };
            const rarityColor = rarityColors[recipe.rarity] || '#888';

            const badgeWidth = 100;
            const badgeBg = this.renderer.createRect(x + cardWidth - badgeWidth - 15, displayY + 15, badgeWidth, 25, 'rgba(0, 0, 0, 0.5)');
            badgeBg.setAttribute('rx', '12');
            this.renderer.append(badgeBg);

            const rarityBadge = this.renderer.createText(x + cardWidth - 65, displayY + 32, rarityText, 14, rarityColor);
            rarityBadge.setAttribute('text-anchor', 'middle');
            rarityBadge.setAttribute('font-weight', 'bold');
            this.renderer.append(rarityBadge);

            // Ingredients with better formatting
            const ingredients = entityFactory.getIngredients(recipe.ingredients);
            const ingredientNames = ingredients.map(ing => ing.name).join(', ');
            const ingText = this.renderer.createText(x + 25, displayY + 62, `🥗 ${ingredientNames}`, 15, '#90EE90');
            this.renderer.append(ingText);

            // Method and time with icons
            const methodText = `🔥 ${recipe.cookingMethod} | ⏱️ ${recipe.cookingTime}s`;
            const method = this.renderer.createText(x + 25, displayY + 85, methodText, 15, '#4FC3F7');
            this.renderer.append(method);

            // Buff type with better visual
            const buffEmoji = recipe.buffType === 'health' ? '❤️' : recipe.buffType === 'attack' ? '⚔️' : '🛡️';
            const buffColors = { health: '#F44336', attack: '#FF9800', defense: '#2196F3' };
            const buffColor = buffColors[recipe.buffType as keyof typeof buffColors] || '#FFA500';
            const buffText = this.renderer.createText(x + 25, displayY + 108, `${buffEmoji} ${recipe.buffType.toUpperCase()} Buff`, 15, buffColor);
            buffText.setAttribute('font-weight', 'bold');
            this.renderer.append(buffText);

        } else {
            // Mysterious recipe (hints only) with better styling
            const questionMarks = '❓ ??? ❓';
            const hintName = this.renderer.createText(x + 25, displayY + 32, questionMarks, 20, '#777');
            hintName.setAttribute('font-weight', 'bold');
            this.renderer.append(hintName);

            // Rarity hint with badge
            const rarityHint = recipe.rarity.toUpperCase();
            const badgeWidth = 100;
            const badgeBg = this.renderer.createRect(x + cardWidth - badgeWidth - 15, displayY + 15, badgeWidth, 25, 'rgba(0, 0, 0, 0.5)');
            badgeBg.setAttribute('rx', '12');
            this.renderer.append(badgeBg);

            const rarityText = this.renderer.createText(x + cardWidth - 65, displayY + 32, rarityHint, 14, '#777');
            rarityText.setAttribute('text-anchor', 'middle');
            rarityText.setAttribute('font-weight', 'bold');
            this.renderer.append(rarityText);

            // Ingredient count hint
            const hint = this.renderer.createText(x + 25, displayY + 60, `🔒 Requires ${recipe.ingredients.length} ingredients`, 15, '#777');
            this.renderer.append(hint);

            // Discovery hint with better styling
            const discoveryHint = this.renderer.createText(x + 25, displayY + 80, '💡 Cook with 70%+ quality to discover this recipe', 13, '#999');
            discoveryHint.setAttribute('font-style', 'italic');
            this.renderer.append(discoveryHint);
        }

        return y + cardHeight + 25;
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
