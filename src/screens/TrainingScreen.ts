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

        // Semi-transparent dark background overlay
        const bgOverlay = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(10, 15, 30, 0.95)');
        this.renderer.append(bgOverlay);

        // Title with shadow effect
        const titleShadow = this.renderer.createText(vb.width / 2 + 2, 62, '⚔️ TRAINING ACADEMY ⚔️', 38, 'rgba(255, 215, 0, 0.3)');
        titleShadow.setAttribute('text-anchor', 'middle');
        titleShadow.setAttribute('font-weight', 'bold');
        this.renderer.append(titleShadow);

        const title = this.renderer.createText(vb.width / 2, 60, '⚔️ TRAINING ACADEMY ⚔️', 38, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display with background panel
        const goldPanelBg = this.renderer.createRect(vb.width / 2 - 120, 85, 240, 40, 'rgba(30, 30, 40, 0.8)');
        goldPanelBg.setAttribute('rx', '8');
        goldPanelBg.setAttribute('stroke', '#FFD700');
        goldPanelBg.setAttribute('stroke-width', '2');
        this.renderer.append(goldPanelBg);

        const goldText = this.renderer.createText(vb.width / 2, 110, `💰 ${state.gold} Gold`, 20, '#FFD700');
        goldText.setAttribute('text-anchor', 'middle');
        goldText.setAttribute('font-weight', 'bold');
        this.renderer.append(goldText);

        // Description
        const desc = this.renderer.createText(
            vb.width / 2,
            150,
            'Train your abilities to gain permanent stat bonuses',
            18,
            '#B0BEC5'
        );
        desc.setAttribute('text-anchor', 'middle');
        this.renderer.append(desc);

        // Render skills in a grid
        const skills = Object.values(this.skills);
        const startY = 190;
        const skillHeight = 100;
        const leftColumnX = 60;
        const rightColumnX = vb.width / 2 + 30;

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

        // Drop shadow
        const shadow = this.renderer.createRect(x + 3, y + 3, 440, 90, 'rgba(0, 0, 0, 0.4)');
        shadow.setAttribute('rx', '12');
        this.renderer.append(shadow);

        // Glow effect for max level
        if (isMaxLevel) {
            const glow = this.renderer.createRect(x - 2, y - 2, 444, 94, 'rgba(255, 215, 0, 0.3)');
            glow.setAttribute('rx', '14');
            this.renderer.append(glow);
        }

        // Background with gradient-like effect
        const bgColor = isMaxLevel ? 'rgba(50, 40, 10, 0.9)' : 'rgba(30, 35, 45, 0.9)';
        const bg = this.renderer.createRect(x, y, 440, 90, bgColor);
        bg.setAttribute('rx', '12');
        bg.setAttribute('stroke', isMaxLevel ? '#FFD700' : canAfford ? '#4FC3F7' : '#555');
        bg.setAttribute('stroke-width', isMaxLevel ? '3' : '2');
        this.renderer.append(bg);

        // Skill icon/emoji based on skill type
        const skillIcons: Record<string, string> = {
            strength: '💪',
            endurance: '🛡️',
            resilience: '❤️',
            agility: '⚡',
            lootMastery: '💎',
            culinaryArts: '👨‍🍳',
            tradeMaster: '💰',
            expeditionDiscount: '🗺️'
        };
        const icon = skillIcons[skill.id] || '⭐';

        // Skill name with icon
        const nameText = this.renderer.createText(
            x + 20,
            y + 28,
            `${icon} ${skill.name}`,
            18,
            isMaxLevel ? '#FFD700' : '#FFFFFF'
        );
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Level indicator with progress bar style
        const levelBg = this.renderer.createRect(x + 20, y + 35, 200, 4, 'rgba(50, 50, 50, 0.8)');
        levelBg.setAttribute('rx', '2');
        this.renderer.append(levelBg);

        const levelProgress = (currentLevel / skill.maxLevel) * 200;
        const levelFill = this.renderer.createRect(x + 20, y + 35, levelProgress, 4, isMaxLevel ? '#FFD700' : '#4FC3F7');
        levelFill.setAttribute('rx', '2');
        this.renderer.append(levelFill);

        const levelText = this.renderer.createText(
            x + 230,
            y + 37,
            `Lv ${currentLevel}/${skill.maxLevel}`,
            12,
            isMaxLevel ? '#FFD700' : '#B0BEC5'
        );
        this.renderer.append(levelText);

        // Description
        const descText = this.renderer.createText(x + 20, y + 56, skill.description, 13, '#B0BEC5');
        this.renderer.append(descText);

        // Effect display with icon
        const effectText = this.renderer.createText(
            x + 20,
            y + 75,
            `✨ ${this.formatEffect(skill.effect)}`,
            13,
            '#8BC34A'
        );
        effectText.setAttribute('font-weight', 'bold');
        this.renderer.append(effectText);

        // Purchase button or status
        if (isMaxLevel) {
            // MAX badge
            const maxBadgeBg = this.renderer.createRect(x + 350, y + 25, 70, 40, 'rgba(255, 215, 0, 0.2)');
            maxBadgeBg.setAttribute('rx', '8');
            maxBadgeBg.setAttribute('stroke', '#FFD700');
            maxBadgeBg.setAttribute('stroke-width', '2');
            this.renderer.append(maxBadgeBg);

            const maxText = this.renderer.createText(x + 385, y + 50, 'MAX', 18, '#FFD700');
            maxText.setAttribute('text-anchor', 'middle');
            maxText.setAttribute('font-weight', 'bold');
            this.renderer.append(maxText);
        } else {
            const btn = this.renderer.createButton(
                x + 330,
                y + 25,
                100,
                40,
                `${cost}💰`,
                () => {
                    if (canAfford) {
                        this.purchaseSkill(skill.id, cost);
                    }
                }
            );
            if (!canAfford) {
                btn.style.cursor = 'not-allowed';
                btn.style.opacity = '0.4';
                btn.style.filter = 'grayscale(80%)';
            } else {
                btn.style.backgroundColor = '#4CAF50';
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
