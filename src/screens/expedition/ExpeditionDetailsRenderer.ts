/**
 * Renderer for the expedition details panel
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import type { ExpeditionLocation } from './expeditionTypes';
import { getExpeditionCost } from './expeditionUtils';

export class ExpeditionDetailsRenderer {
    constructor(
        private renderer: SVGRenderer,
        private expedition: ExpeditionLocation,
        private gold: number,
        private dishes: string[]
    ) {}

    render(
        x: number,
        y: number,
        selectedFoodBuff: string | null,
        onSelectFood: () => void,
        onStartExpedition: () => void
    ): void {
        const cost = getExpeditionCost(this.expedition);
        const canAfford = this.gold >= cost;

        // Details box
        const bg = this.renderer.createRect(x, y, 480, 300, '#2a2a2a');
        bg.setAttribute('rx', '8');
        bg.setAttribute('stroke', '#FFD700');
        bg.setAttribute('stroke-width', '2');
        this.renderer.append(bg);

        // Expedition name
        const nameText = this.renderer.createText(x + 15, y + 30, this.expedition.name, 24, '#FFD700');
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Description
        const descText = this.renderer.createText(x + 15, y + 60, this.expedition.description, 14, '#AAA');
        this.renderer.append(descText);

        // Details
        const details = [
            `Difficulty: ${'★'.repeat(this.expedition.difficulty)}`,
            `Cost: ${cost} gold`,
            `Enemies: ${this.expedition.enemyCount.min}-${this.expedition.enemyCount.max}`,
            `Loot Bonus: ${((this.expedition.lootMultiplier - 1) * 100).toFixed(0)}%`,
            `Time Limit: 60 seconds (hunger)`
        ];

        details.forEach((detail, index) => {
            const detailText = this.renderer.createText(x + 15, y + 95 + index * 25, detail, 14, '#FFF');
            this.renderer.append(detailText);
        });

        // Food buff selection
        this.renderFoodSelection(x, y + 240, selectedFoodBuff, onSelectFood);

        // Start expedition button
        this.renderStartButton(x, y + 320, canAfford, onStartExpedition);
    }

    private renderFoodSelection(
        x: number,
        foodY: number,
        selectedFoodBuff: string | null,
        onSelectFood: () => void
    ): void {
        const foodTitle = this.renderer.createText(x + 15, foodY, 'Pre-Expedition Food:', 16, '#FFF');
        foodTitle.setAttribute('font-weight', 'bold');
        this.renderer.append(foodTitle);

        if (this.dishes.length === 0) {
            const noDishesText = this.renderer.createText(x + 15, foodY + 25, 'No dishes available', 12, '#888');
            this.renderer.append(noDishesText);
        } else {
            const foodBtn = this.renderer.createButton(
                x + 15,
                foodY + 10,
                200,
                40,
                selectedFoodBuff ? 'Change Food' : 'Select Food',
                onSelectFood
            );
            this.renderer.append(foodBtn);

            if (selectedFoodBuff) {
                const selectedText = this.renderer.createText(
                    x + 225,
                    foodY + 35,
                    `Selected: ${selectedFoodBuff}`,
                    12,
                    '#90EE90'
                );
                this.renderer.append(selectedText);
            }
        }
    }

    private renderStartButton(
        x: number,
        startY: number,
        canAfford: boolean,
        onStartExpedition: () => void
    ): void {
        if (canAfford) {
            const startBtn = this.renderer.createButton(
                x + 140,
                startY,
                200,
                60,
                'START EXPEDITION',
                onStartExpedition
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
}
