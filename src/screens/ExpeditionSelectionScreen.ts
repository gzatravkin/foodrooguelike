/**
 * ExpeditionSelectionScreen - Select expedition location and food buffs before departing
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import expeditionsData from '../data/expeditions.json';
import { entityFactory } from '../entities/EntityFactory';

interface ExpeditionLocation {
    id: string;
    name: string;
    description: string;
    cost: number;
    difficulty: number;
    enemyTypes: string[];
    enemyCount: { min: number; max: number };
    lootMultiplier: number;
    theme: string;
}

export class ExpeditionSelectionScreen extends Screen {
    private expeditions: Record<string, ExpeditionLocation> = expeditionsData;
    private selectedExpedition: string | null = null;
    private selectedFoodBuff: string | null = null;

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();
        const state = gameState.getState();

        // Add semi-transparent background to catch all clicks and prevent interaction with elements below
        const background = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(0, 0, 0, 0.85)');
        this.renderer.append(background);

        // Check if coming from world map with preselected expedition
        const preselected = localStorage.getItem('preselectedExpedition');
        if (preselected && !this.selectedExpedition) {
            const expedition = JSON.parse(preselected);
            this.selectedExpedition = expedition.id;
            localStorage.removeItem('preselectedExpedition');
        }

        // Title
        const title = this.renderer.createText(vb.width / 2, 50, '⚔️ EXPEDITION CENTER ⚔️', 32, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const goldText = this.renderer.createText(vb.width / 2, 85, `Gold: ${state.gold}`, 18, '#FFD700');
        goldText.setAttribute('text-anchor', 'middle');
        this.renderer.append(goldText);

        // Check for game over
        const canAffordAny = Object.values(this.expeditions).some(exp => {
            const cost = this.getExpeditionCost(exp);
            return state.gold >= cost;
        });

        if (!canAffordAny && state.gold < 10) {
            this.renderGameOver(vb.width / 2, vb.height / 2);
            return;
        }

        // Render expedition locations (left side)
        this.renderExpeditionList(50, 120);

        // Render selected expedition details and food selection (right side)
        if (this.selectedExpedition) {
            this.renderExpeditionDetails(vb.width / 2 + 50, 120);
        } else {
            const hint = this.renderer.createText(
                vb.width / 2 + 250,
                vb.height / 2,
                'Select an expedition to begin',
                20,
                '#888'
            );
            hint.setAttribute('text-anchor', 'middle');
            this.renderer.append(hint);
        }

        // Back button
        const backBtn = this.renderer.createButton(
            50,
            vb.height - 100,
            180,
            60,
            'BACK',
            () => {
                this.cleanup();
                // Go back to world map (players now access expeditions through world map)
                gameState.setScreen('worldmap');
            }
        );
        this.renderer.append(backBtn);
    }

    private renderExpeditionList(x: number, y: number): void {
        const state = gameState.getState();

        const listTitle = this.renderer.createText(x, y - 10, 'Available Expeditions:', 18, '#FFF');
        listTitle.setAttribute('font-weight', 'bold');
        this.renderer.append(listTitle);

        const expeditions = Object.values(this.expeditions);
        expeditions.forEach((expedition, index) => {
            const yPos = y + 20 + index * 90;
            const cost = this.getExpeditionCost(expedition);
            const canAfford = state.gold >= cost;
            const isSelected = this.selectedExpedition === expedition.id;

            // Background
            const bgColor = isSelected ? '#3a3a3a' : '#2a2a2a';
            const bg = this.renderer.createRect(x, yPos, 400, 80, bgColor);
            bg.setAttribute('rx', '8');
            bg.setAttribute('stroke', isSelected ? '#FFD700' : canAfford ? '#4CAF50' : '#555');
            bg.setAttribute('stroke-width', isSelected ? '3' : '2');

            if (canAfford && !isSelected) {
                bg.style.cursor = 'pointer';
                bg.addEventListener('click', () => {
                    this.selectedExpedition = expedition.id;
                    this.render();
                });
            }

            this.renderer.append(bg);

            // Expedition name
            const nameColor = canAfford ? '#FFF' : '#888';
            const nameText = this.renderer.createText(x + 15, yPos + 25, expedition.name, 18, nameColor);
            nameText.setAttribute('font-weight', 'bold');
            this.renderer.append(nameText);

            // Difficulty stars
            const difficultyText = this.renderer.createText(
                x + 15,
                yPos + 48,
                `${'★'.repeat(expedition.difficulty)}${'☆'.repeat(7 - expedition.difficulty)}`,
                14,
                '#FFD700'
            );
            this.renderer.append(difficultyText);

            // Cost
            const costColor = canAfford ? '#4CAF50' : '#F44336';
            const costText = this.renderer.createText(x + 320, yPos + 40, `${cost}g`, 20, costColor);
            costText.setAttribute('font-weight', 'bold');
            this.renderer.append(costText);

            // Lock icon if can't afford
            if (!canAfford) {
                const lockText = this.renderer.createText(x + 365, yPos + 40, '🔒', 20);
                this.renderer.append(lockText);
            }
        });
    }

    private renderExpeditionDetails(x: number, y: number): void {
        if (!this.selectedExpedition) return;

        const expedition = this.expeditions[this.selectedExpedition];
        const state = gameState.getState();
        const cost = this.getExpeditionCost(expedition);
        const canAfford = state.gold >= cost;

        // Details box
        const bg = this.renderer.createRect(x, y, 480, 300, '#2a2a2a');
        bg.setAttribute('rx', '8');
        bg.setAttribute('stroke', '#FFD700');
        bg.setAttribute('stroke-width', '2');
        this.renderer.append(bg);

        // Expedition name
        const nameText = this.renderer.createText(x + 15, y + 30, expedition.name, 24, '#FFD700');
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Description
        const descText = this.renderer.createText(x + 15, y + 60, expedition.description, 14, '#AAA');
        this.renderer.append(descText);

        // Details
        const details = [
            `Difficulty: ${'★'.repeat(expedition.difficulty)}`,
            `Cost: ${cost} gold`,
            `Enemies: ${expedition.enemyCount.min}-${expedition.enemyCount.max}`,
            `Loot Bonus: ${((expedition.lootMultiplier - 1) * 100).toFixed(0)}%`,
            `Time Limit: 60 seconds (hunger)`
        ];

        details.forEach((detail, index) => {
            const detailText = this.renderer.createText(x + 15, y + 95 + index * 25, detail, 14, '#FFF');
            this.renderer.append(detailText);
        });

        // Food buff selection
        const foodY = y + 240;
        const foodTitle = this.renderer.createText(x + 15, foodY, 'Pre-Expedition Food:', 16, '#FFF');
        foodTitle.setAttribute('font-weight', 'bold');
        this.renderer.append(foodTitle);

        const dishes = state.dishes;
        if (dishes.length === 0) {
            const noDishesText = this.renderer.createText(x + 15, foodY + 25, 'No dishes available', 12, '#888');
            this.renderer.append(noDishesText);
        } else {
            const foodBtn = this.renderer.createButton(
                x + 15,
                foodY + 10,
                200,
                40,
                this.selectedFoodBuff ? 'Change Food' : 'Select Food',
                () => {
                    this.showFoodSelection();
                }
            );
            this.renderer.append(foodBtn);

            if (this.selectedFoodBuff) {
                const dishName = this.selectedFoodBuff;
                const selectedText = this.renderer.createText(
                    x + 225,
                    foodY + 35,
                    `Selected: ${dishName}`,
                    12,
                    '#90EE90'
                );
                this.renderer.append(selectedText);
            }
        }

        // Start expedition button
        const startY = y + 320;
        if (canAfford) {
            const startBtn = this.renderer.createButton(
                x + 140,
                startY,
                200,
                60,
                'START EXPEDITION',
                () => {
                    this.startExpedition();
                }
            );
            this.renderer.append(startBtn);
        } else {
            const insufficientText = this.renderer.createText(
                x + 240,
                startY + 35,
                'Insufficient Gold',
                18,
                '#F44336'
            );
            insufficientText.setAttribute('text-anchor', 'middle');
            insufficientText.setAttribute('font-weight', 'bold');
            this.renderer.append(insufficientText);
        }
    }

    private showFoodSelection(): void {
        const state = gameState.getState();
        const dishes = state.dishes;

        if (dishes.length === 0) return;

        // Create simple food selection overlay (in a real app, this would be a modal)
        // For now, just cycle through available dishes
        const currentIndex = this.selectedFoodBuff
            ? dishes.indexOf(this.selectedFoodBuff)
            : -1;

        const nextIndex = (currentIndex + 1) % dishes.length;
        this.selectedFoodBuff = dishes[nextIndex];

        this.render();
    }

    private getExpeditionCost(expedition: ExpeditionLocation): number {
        const state = gameState.getState();
        const discount = gameState.getTrainingSkillLevel('expedition_efficiency') * 0.1;
        return Math.floor(expedition.cost * (1 - discount));
    }

    private startExpedition(): void {
        if (!this.selectedExpedition) return;

        const expedition = this.expeditions[this.selectedExpedition];
        const cost = this.getExpeditionCost(expedition);
        const state = gameState.getState();

        if (state.gold < cost) return;

        // Spend gold
        if (!gameState.spendGold(cost)) return;

        // Apply food buff if selected
        if (this.selectedFoodBuff) {
            this.applyFoodBuff(this.selectedFoodBuff);
            gameState.removeDish(this.selectedFoodBuff);
        }

        // Reset hunger timer
        gameState.resetHungerTimer();

        // Store selected expedition in a way GameScreen can access it
        // We'll use localStorage for this temporary data
        localStorage.setItem('selectedExpedition', JSON.stringify(expedition));

        // Navigate to game screen (expedition mode)
        gameState.setScreen('game');

        this.cleanup();
    }

    private applyFoodBuff(dishId: string): void {
        // Get dish data from entityFactory
        const dish = entityFactory.getTemplate(dishId);

        if (dish && 'effects' in dish) {
            const effects = dish.effects;
            if (effects) {
                gameState.addBuff({
                    name: dish.name,
                    duration: effects.duration || 60,
                    effects: {
                        health: effects.health,
                        attack: effects.attack,
                        defense: effects.defense
                    }
                });
            }
        }

        gameState.setSelectedFoodBuff(dishId);
    }

    private renderGameOver(cx: number, cy: number): void {
        // Game over background
        const bg = this.renderer.createRect(cx - 300, cy - 150, 600, 300, '#1a1a1a');
        bg.setAttribute('rx', '10');
        bg.setAttribute('stroke', '#F44336');
        bg.setAttribute('stroke-width', '3');
        this.renderer.append(bg);

        // Game over text
        const gameOverText = this.renderer.createText(cx, cy - 80, 'GAME OVER', 48, '#F44336');
        gameOverText.setAttribute('text-anchor', 'middle');
        gameOverText.setAttribute('font-weight', 'bold');
        this.renderer.append(gameOverText);

        // Message
        const msgText = this.renderer.createText(
            cx,
            cy - 20,
            'You don\'t have enough gold for any expedition!',
            18,
            '#FFF'
        );
        msgText.setAttribute('text-anchor', 'middle');
        this.renderer.append(msgText);

        const msg2Text = this.renderer.createText(
            cx,
            cy + 10,
            'Sell dishes or restart the game.',
            18,
            '#AAA'
        );
        msg2Text.setAttribute('text-anchor', 'middle');
        this.renderer.append(msg2Text);

        // Restart button
        const restartBtn = this.renderer.createButton(
            cx - 100,
            cy + 60,
            200,
            50,
            'RESTART GAME',
            () => {
                if (confirm('Are you sure you want to restart? All progress will be lost.')) {
                    gameState.reset();
                    location.reload();
                }
            }
        );
        this.renderer.append(restartBtn);

        // Back to base button
        const backBtn = this.renderer.createButton(
            cx - 100,
            cy + 120,
            200,
            50,
            'BACK TO BASE',
            () => {
                gameState.setScreen('base');
            }
        );
        this.renderer.append(backBtn);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.selectedExpedition = null;
        this.selectedFoodBuff = null;
    }
}
