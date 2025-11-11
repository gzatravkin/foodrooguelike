/**
 * UpgradesScreen - Upgrade restaurant, kitchen, and character perks
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import upgradesData from '../data/upgrades.json';

interface UpgradeData {
    id: string;
    type: string;
    category: 'kitchen' | 'restaurantUpgrades' | 'characterPerks';
    name: string;
    description: string;
    maxLevel: number;
    baseCost: number;
    costMultiplier: number;
    effects: Record<string, number>;
}

type TabType = 'kitchen' | 'restaurant' | 'character';

export class UpgradesScreen extends Screen {
    private upgrades: Record<string, UpgradeData> = upgradesData as Record<string, UpgradeData>;
    private currentTab: TabType = 'kitchen';

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();
        const state = gameState.getState();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, '⭐ UPGRADES ⭐', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const goldText = this.renderer.createText(vb.width / 2, 100, `Gold: ${state.gold}`, 20, '#FFD700');
        goldText.setAttribute('text-anchor', 'middle');
        this.renderer.append(goldText);

        // Tab buttons
        this.renderTabs(vb.width / 2, 140);

        // Render upgrades based on current tab
        this.renderUpgrades(vb);

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

    private renderTabs(centerX: number, y: number): void {
        const tabs: { type: TabType; label: string }[] = [
            { type: 'kitchen', label: 'KITCHEN' },
            { type: 'restaurant', label: 'RESTAURANT' },
            { type: 'character', label: 'CHARACTER' }
        ];

        const tabWidth = 160;
        const tabSpacing = 10;
        const totalWidth = tabs.length * tabWidth + (tabs.length - 1) * tabSpacing;
        const startX = centerX - totalWidth / 2;

        tabs.forEach((tab, index) => {
            const x = startX + index * (tabWidth + tabSpacing);
            const isActive = this.currentTab === tab.type;

            const btn = this.renderer.createButton(
                x,
                y,
                tabWidth,
                50,
                tab.label,
                () => {
                    this.currentTab = tab.type;
                    this.render();
                }
            );

            if (isActive) {
                btn.style.backgroundColor = '#FFD700';
                btn.style.color = '#000';
            }

            this.renderer.append(btn);
        });
    }

    private renderUpgrades(vb: { width: number; height: number }): void {
        const categoryMap: Record<TabType, 'kitchen' | 'restaurantUpgrades' | 'characterPerks'> = {
            kitchen: 'kitchen',
            restaurant: 'restaurantUpgrades',
            character: 'characterPerks'
        };

        const category = categoryMap[this.currentTab];
        const upgrades = Object.values(this.upgrades).filter(u => u.category === category);

        const startY = 220;
        const upgradeHeight = 90;
        const leftColumnX = 50;
        const rightColumnX = vb.width / 2 + 20;

        upgrades.forEach((upgrade, index) => {
            const isLeftColumn = index % 2 === 0;
            const x = isLeftColumn ? leftColumnX : rightColumnX;
            const y = startY + Math.floor(index / 2) * upgradeHeight;

            this.renderUpgrade(upgrade, x, y);
        });
    }

    private renderUpgrade(upgrade: UpgradeData, x: number, y: number): void {
        const state = gameState.getState();
        const currentLevel = gameState.getUpgradeLevel(upgrade.category, upgrade.id);
        const cost = this.calculateCost(upgrade, currentLevel);
        const canAfford = state.gold >= cost;
        const isMaxLevel = currentLevel >= upgrade.maxLevel;

        // Background
        const bg = this.renderer.createRect(x, y, 450, 80, '#2a2a2a');
        bg.setAttribute('rx', '8');
        bg.setAttribute('stroke', isMaxLevel ? '#FFD700' : '#444');
        bg.setAttribute('stroke-width', '2');
        this.renderer.append(bg);

        // Upgrade name
        const nameText = this.renderer.createText(
            x + 15,
            y + 25,
            `${upgrade.name} (Lv ${currentLevel}/${upgrade.maxLevel})`,
            18,
            isMaxLevel ? '#FFD700' : '#FFF'
        );
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Description
        const descText = this.renderer.createText(x + 15, y + 48, upgrade.description, 14, '#AAA');
        this.renderer.append(descText);

        // Effect display
        const effectText = this.renderer.createText(
            x + 15,
            y + 68,
            this.formatEffect(upgrade.effects),
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
                        this.purchaseUpgrade(upgrade, cost);
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

    private calculateCost(upgrade: UpgradeData, currentLevel: number): number {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    }

    private formatEffect(effects: Record<string, number>): string {
        const effectNames: Record<string, string> = {
            bakingQualityBonus: 'Baking Quality',
            grillingQualityBonus: 'Grilling Quality',
            fryingQualityBonus: 'Frying Quality',
            globalQualityBonus: 'All Cooking Quality',
            ingredientSaveChance: 'Save Ingredients',
            sellPriceMultiplier: 'Sell Price',
            reputationMultiplier: 'Reputation',
            rareDropRateBonus: 'Rare Drop Rate',
            cookingTimeReduction: 'Cooking Time',
            maxHealthBonus: 'Max Health',
            attackBonus: 'Attack',
            defenseBonus: 'Defense',
            buffDurationMultiplier: 'Buff Duration',
            dropRateMultiplier: 'Drop Rate',
            dashCooldownReduction: 'Dash Cooldown'
        };

        const entries = Object.entries(effects);
        if (entries.length === 0) return '';

        const [key, value] = entries[0];
        const name = effectNames[key] || key;

        // Percentages
        if (
            key.includes('Bonus') ||
            key.includes('Multiplier') ||
            key.includes('Chance') ||
            key.includes('Reduction') ||
            key.includes('Rate')
        ) {
            const sign = key.includes('Reduction') ? '-' : '+';
            return `${sign}${(value * 100).toFixed(0)}% ${name}`;
        }

        // Flat values
        return `+${value} ${name}`;
    }

    private purchaseUpgrade(upgrade: UpgradeData, cost: number): void {
        const currentLevel = gameState.getUpgradeLevel(upgrade.category, upgrade.id);

        if (currentLevel >= upgrade.maxLevel) {
            return;
        }

        if (gameState.spendGold(cost)) {
            gameState.purchaseUpgrade(upgrade.category, upgrade.id);

            // Apply stat bonuses immediately if they're character perks
            if (upgrade.category === 'characterPerks') {
                this.applyCharacterPerkEffect(upgrade);
            }

            this.render();
        }
    }

    private applyCharacterPerkEffect(upgrade: UpgradeData): void {
        const state = gameState.getState();
        const effects = upgrade.effects;

        if (effects.maxHealthBonus) {
            gameState.updatePlayer({
                maxHealth: state.player.maxHealth + effects.maxHealthBonus,
                health: state.player.health + effects.maxHealthBonus
            });
        }

        if (effects.attackBonus) {
            gameState.updatePlayer({
                attack: state.player.attack + effects.attackBonus
            });
        }

        if (effects.defenseBonus) {
            gameState.updatePlayer({
                defense: state.player.defense + effects.defenseBonus
            });
        }

        // Other effects (drop rate, buff duration, dash cooldown) are applied when needed
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        // Reset to kitchen tab when leaving
        this.currentTab = 'kitchen';
    }
}
