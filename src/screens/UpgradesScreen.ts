/**
 * UpgradesScreen - Upgrade restaurant, kitchen, and character perks
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import { entityFactory } from '../entities/EntityFactory';
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
    effects: Record<string, number | string>;
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

        // Semi-transparent dark background overlay
        const bgOverlay = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(10, 15, 30, 0.95)');
        this.renderer.append(bgOverlay);

        // Title with shadow effect
        const titleShadow = this.renderer.createText(vb.width / 2 + 2, 62, '⭐ UPGRADES ⭐', 38, 'rgba(255, 215, 0, 0.3)');
        titleShadow.setAttribute('text-anchor', 'middle');
        titleShadow.setAttribute('font-weight', 'bold');
        this.renderer.append(titleShadow);

        const title = this.renderer.createText(vb.width / 2, 60, '⭐ UPGRADES ⭐', 38, '#FFD700');
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

        // Tab buttons
        this.renderTabs(vb.width / 2, 145);

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
        const tabs: { type: TabType; label: string; icon: string }[] = [
            { type: 'kitchen', label: 'KITCHEN', icon: '🍳' },
            { type: 'restaurant', label: 'RESTAURANT', icon: '🏪' },
            { type: 'character', label: 'CHARACTER', icon: '👤' }
        ];

        const tabWidth = 160;
        const tabSpacing = 15;
        const totalWidth = tabs.length * tabWidth + (tabs.length - 1) * tabSpacing;
        const startX = centerX - totalWidth / 2;

        tabs.forEach((tab, index) => {
            const x = startX + index * (tabWidth + tabSpacing);
            const isActive = this.currentTab === tab.type;

            // Tab background with shadow
            if (isActive) {
                const shadow = this.renderer.createRect(x + 2, y + 2, tabWidth, 45, 'rgba(0, 0, 0, 0.4)');
                shadow.setAttribute('rx', '10');
                this.renderer.append(shadow);
            }

            const btn = this.renderer.createButton(
                x,
                y,
                tabWidth,
                45,
                `${tab.icon} ${tab.label}`,
                () => {
                    this.currentTab = tab.type;
                    this.render();
                }
            );

            if (isActive) {
                btn.style.backgroundColor = '#FFD700';
                btn.style.color = '#000';
                btn.style.fontWeight = 'bold';
                btn.style.border = '2px solid #FFA500';
            } else {
                btn.style.backgroundColor = 'rgba(60, 60, 70, 0.8)';
                btn.style.color = '#B0BEC5';
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

        const startY = 230;
        const upgradeHeight = 100;
        const leftColumnX = 60;
        const rightColumnX = vb.width / 2 + 30;

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

        // Upgrade icon based on category and type
        const upgradeIcons: Record<string, string> = {
            'bakingQuality': '🥖',
            'grillingQuality': '🍖',
            'fryingQuality': '🍳',
            'globalQuality': '✨',
            'ingredientSave': '💾',
            'sellPrice': '💰',
            'maxHealth': '❤️',
            'attack': '⚔️',
            'defense': '🛡️',
            'dropRate': '💎'
        };
        const icon = upgradeIcons[upgrade.id] || '⭐';

        // Upgrade name with icon
        const nameText = this.renderer.createText(
            x + 20,
            y + 28,
            `${icon} ${upgrade.name}`,
            18,
            isMaxLevel ? '#FFD700' : '#FFFFFF'
        );
        nameText.setAttribute('font-weight', 'bold');
        this.renderer.append(nameText);

        // Level indicator with progress bar style
        const levelBg = this.renderer.createRect(x + 20, y + 35, 200, 4, 'rgba(50, 50, 50, 0.8)');
        levelBg.setAttribute('rx', '2');
        this.renderer.append(levelBg);

        const levelProgress = (currentLevel / upgrade.maxLevel) * 200;
        const levelFill = this.renderer.createRect(x + 20, y + 35, levelProgress, 4, isMaxLevel ? '#FFD700' : '#4FC3F7');
        levelFill.setAttribute('rx', '2');
        this.renderer.append(levelFill);

        const levelText = this.renderer.createText(
            x + 230,
            y + 37,
            `Lv ${currentLevel}/${upgrade.maxLevel}`,
            12,
            isMaxLevel ? '#FFD700' : '#B0BEC5'
        );
        this.renderer.append(levelText);

        // Description
        const descText = this.renderer.createText(x + 20, y + 56, upgrade.description, 13, '#B0BEC5');
        this.renderer.append(descText);

        // Effect display with icon
        const effectText = this.renderer.createText(
            x + 20,
            y + 75,
            `✨ ${this.formatEffect(upgrade.effects)}`,
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
                        this.purchaseUpgrade(upgrade, cost);
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

    private calculateCost(upgrade: UpgradeData, currentLevel: number): number {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    }

    private formatEffect(effects: Record<string, any>): string {
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
            dashCooldownReduction: 'Dash Cooldown',
            unlockMethod: 'Unlocks Cooking Method'
        };

        const entries = Object.entries(effects);
        if (entries.length === 0) return '';

        const [key, value] = entries[0];
        const name = effectNames[key] || key;

        // Handle cooking method unlocks
        if (key === 'unlockMethod') {
            return `Unlocks: ${value}`;
        }

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

            // Recalculate all character perk bonuses if this is a character perk
            if (upgrade.category === 'characterPerks') {
                gameState.recalculatePlayerStats();
            }

            // Unlock cooking method if this is a method unlock upgrade
            if (upgrade.type === 'cookingMethodUnlock' && upgrade.effects.unlockMethod) {
                this.unlockCookingMethod(String(upgrade.effects.unlockMethod));
            }

            this.render();
        }
    }

    private unlockCookingMethod(methodId: string): void {
        const method = entityFactory.getTemplate(methodId);
        if (method && method.type === 'cookingMethod') {
            (method as any).unlocked = true;
        }
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        // Reset to kitchen tab when leaving
        this.currentTab = 'kitchen';
    }
}
