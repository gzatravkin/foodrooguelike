/**
 * TrainingScreen - School/Academy where players can improve their abilities
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import trainingData from '../data/training.json';

interface TrainingSkill {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    maxLevel: number;
    effect: {
        stat: string;
        amount: number;
    };
}

export class TrainingScreen extends Screen {
    private skills: Record<string, TrainingSkill> = trainingData;

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();
        const state = gameState.getState();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, '⚔️ TRAINING ACADEMY ⚔️', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const goldText = this.renderer.createText(vb.width / 2, 100, `Gold: ${state.gold}`, 20, '#FFD700');
        goldText.setAttribute('text-anchor', 'middle');
        this.renderer.append(goldText);

        // Description
        const desc = this.renderer.createText(
            vb.width / 2,
            140,
            'Spend gold to permanently improve your abilities',
            18,
            '#AAA'
        );
        desc.setAttribute('text-anchor', 'middle');
        this.renderer.append(desc);

        // Render skills in a grid
        const skills = Object.values(this.skills);
        const startY = 180;
        const skillHeight = 90;
        const leftColumnX = 50;
        const rightColumnX = vb.width / 2 + 20;

        skills.forEach((skill, index) => {
            const isLeftColumn = index % 2 === 0;
            const x = isLeftColumn ? leftColumnX : rightColumnX;
            const y = startY + Math.floor(index / 2) * skillHeight;

            this.renderSkill(skill, x, y);
        });

        // Back button
        const backBtn = this.renderer.createButton(
            vb.width / 2 - 100,
            vb.height - 100,
            200,
            60,
            'BACK TO BASE',
            () => {
                gameState.setScreen('base');
            }
        );
        this.renderer.append(backBtn);
    }

    private renderSkill(skill: TrainingSkill, x: number, y: number): void {
        const state = gameState.getState();
        const currentLevel = gameState.getTrainingSkillLevel(skill.id);
        const cost = this.calculateCost(skill, currentLevel);
        const canAfford = state.gold >= cost;
        const isMaxLevel = currentLevel >= skill.maxLevel;

        // Background
        const bg = this.renderer.createRect(x, y, 450, 80, '#2a2a2a');
        bg.setAttribute('rx', '8');
        bg.setAttribute('stroke', isMaxLevel ? '#FFD700' : '#444');
        bg.setAttribute('stroke-width', '2');
        this.renderer.append(bg);

        // Skill name
        const nameText = this.renderer.createText(
            x + 15,
            y + 25,
            `${skill.name} (Lv ${currentLevel}/${skill.maxLevel})`,
            18,
            isMaxLevel ? '#FFD700' : '#FFF'
        );
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Description
        const descText = this.renderer.createText(x + 15, y + 48, skill.description, 14, '#AAA');
        this.renderer.append(descText);

        // Effect display
        const effectText = this.renderer.createText(
            x + 15,
            y + 68,
            this.formatEffect(skill.effect),
            14,
            '#90EE90'
        );
        this.renderer.append(effectText);

        // Purchase button or status
        if (isMaxLevel) {
            const maxText = this.renderer.createText(x + 350, y + 40, 'MAX', 20, '#FFD700');
            maxText.setAttribute('font-weight', 'bold');
            this.renderer.append(maxText);
        } else {
            const btn = this.renderer.createButton(
                x + 320,
                y + 20,
                120,
                45,
                `${cost}g`,
                () => {
                    if (canAfford) {
                        this.purchaseSkill(skill.id, cost);
                    }
                }
            );
            if (!canAfford) {
                btn.style.cursor = 'not-allowed';
                btn.style.opacity = '0.5';
            }
            this.renderer.append(btn);
        }
    }

    private calculateCost(skill: TrainingSkill, currentLevel: number): number {
        return Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
    }

    private formatEffect(effect: { stat: string; amount: number }): string {
        const statNames: Record<string, string> = {
            attack: 'Attack',
            defense: 'Defense',
            maxHealth: 'Max HP',
            speed: 'Speed',
            lootChance: 'Loot Chance',
            cookingBonus: 'Cooking Quality',
            sellBonus: 'Sell Value',
            expeditionDiscount: 'Expedition Cost'
        };

        const statName = statNames[effect.stat] || effect.stat;

        if (effect.stat.includes('Chance') || effect.stat.includes('Bonus') || effect.stat.includes('Discount')) {
            return `+${(effect.amount * 100).toFixed(0)}% ${statName}`;
        }

        return `+${effect.amount} ${statName}`;
    }

    private purchaseSkill(skillId: string, cost: number): void {
        const state = gameState.getState();
        const skill = this.skills[skillId];
        const currentLevel = gameState.getTrainingSkillLevel(skillId);

        if (currentLevel >= skill.maxLevel) {
            return;
        }

        if (gameState.spendGold(cost)) {
            gameState.purchaseTrainingSkill(skillId);

            // Recalculate all player stats from upgrades and training
            const effect = skill.effect;
            if (effect.stat === 'attack' || effect.stat === 'defense' || effect.stat === 'maxHealth') {
                gameState.recalculatePlayerStats();
            }
            // Other effects (speed, loot chance, etc.) are applied when needed

            this.render();
        }
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        // Nothing to clean up
    }
}
