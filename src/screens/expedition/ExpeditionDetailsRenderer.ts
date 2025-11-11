/**
 * Renderer for the expedition details panel
 */

import type { SVGRenderer } from '../../rendering/SVGRenderer';
import type { ExpeditionLocation } from './expeditionTypes';
import { getExpeditionCost } from './expeditionUtils';
import type { ExpeditionProgress } from '../../core/GameState';
import { isBossLevel, getLevelMultipliers } from './expeditionTypes';

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
        onStartExpedition: () => void,
        selectedLevel: number = 1,
        progress?: ExpeditionProgress,
        onLevelChange?: (level: number) => void
    ): void {
        const cost = getExpeditionCost(this.expedition);
        const canAfford = this.gold >= cost;
        const multipliers = getLevelMultipliers(selectedLevel);
        const isBoss = isBossLevel(selectedLevel);

        // Details box (taller to fit level selection)
        const bg = this.renderer.createRect(x, y, 480, 400, '#2a2a2a');
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

        // Level selection and progress
        if (progress && onLevelChange) {
            this.renderLevelSelection(x + 15, y + 90, selectedLevel, progress, onLevelChange);
        }

        // Details with level scaling
        const baseEnemyCount = this.expedition.enemyCount.min + multipliers.count;
        const scaledLootBonus = ((this.expedition.lootMultiplier * multipliers.loot - 1) * 100).toFixed(0);

        const details = [
            `Difficulty: ${'★'.repeat(this.expedition.difficulty)} ${isBoss ? '👹 BOSS LEVEL' : ''}`,
            `Cost: ${cost} gold`,
            `Enemies: ${baseEnemyCount}+ (scaled by level)`,
            `Loot Bonus: ${scaledLootBonus}%`,
            `Time Limit: 60 seconds (hunger)`
        ];

        details.forEach((detail, index) => {
            const detailText = this.renderer.createText(x + 15, y + 180 + index * 25, detail, 14, '#FFF');
            if (isBoss && index === 0) {
                detailText.setAttribute('fill', '#FF4444');
                detailText.setAttribute('font-weight', 'bold');
            }
            this.renderer.append(detailText);
        });

        // Food buff selection
        this.renderFoodSelection(x, y + 300, selectedFoodBuff, onSelectFood);

        // Start expedition button
        this.renderStartButton(x, y + 380, canAfford, onStartExpedition);
    }

    private renderLevelSelection(
        x: number,
        y: number,
        selectedLevel: number,
        progress: ExpeditionProgress,
        onLevelChange: (level: number) => void
    ): void {
        // Level title
        const levelTitle = this.renderer.createText(x, y, `Level: ${selectedLevel} / 50`, 18, '#FFD700');
        levelTitle.setAttribute('font-weight', 'bold');
        this.renderer.append(levelTitle);

        // Progress info
        const progressText = this.renderer.createText(
            x,
            y + 22,
            `Highest Completed: ${progress.highestLevelCompleted}`,
            12,
            '#AAA'
        );
        this.renderer.append(progressText);

        // Level selection buttons
        const btnY = y + 40;
        const btnWidth = 60;
        const btnSpacing = 10;

        // Previous level button
        if (selectedLevel > 1) {
            const prevBtn = this.renderer.createButton(
                x,
                btnY,
                btnWidth,
                40,
                '◀ -1',
                () => onLevelChange(Math.max(1, selectedLevel - 1))
            );
            this.renderer.append(prevBtn);
        }

        // -5 levels button
        if (selectedLevel > 5) {
            const prev5Btn = this.renderer.createButton(
                x + btnWidth + btnSpacing,
                btnY,
                btnWidth,
                40,
                '-5',
                () => onLevelChange(Math.max(1, selectedLevel - 5))
            );
            this.renderer.append(prev5Btn);
        }

        // +5 levels button
        if (selectedLevel + 5 <= progress.currentLevel) {
            const next5Btn = this.renderer.createButton(
                x + (btnWidth + btnSpacing) * 2,
                btnY,
                btnWidth,
                40,
                '+5',
                () => onLevelChange(Math.min(progress.currentLevel, selectedLevel + 5))
            );
            this.renderer.append(next5Btn);
        }

        // Next level button
        if (selectedLevel < progress.currentLevel) {
            const nextBtn = this.renderer.createButton(
                x + (btnWidth + btnSpacing) * 3,
                btnY,
                btnWidth,
                40,
                '+1 ▶',
                () => onLevelChange(Math.min(progress.currentLevel, selectedLevel + 1))
            );
            this.renderer.append(nextBtn);
        }
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
