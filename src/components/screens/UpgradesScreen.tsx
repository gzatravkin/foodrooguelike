/**
 * UpgradesScreen - Preact component for upgrades
 */

import { useState, useEffect } from 'preact/hooks';
import { useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import upgradesData from '../../data/upgrades.json';

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

interface UpgradeCardProps {
    upgrade: UpgradeData;
}

function UpgradeCard({ upgrade }: UpgradeCardProps) {
    const gold = useGold();
    const upgrades = useGameState(state => state.upgrades);
    const currentLevel = gameState.getUpgradeLevel(upgrade.category, upgrade.id);
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    const canAfford = gold >= cost;
    const isMaxLevel = currentLevel >= upgrade.maxLevel;

    const formatEffect = (effects: Record<string, any>): string => {
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

        if (key === 'unlockMethod') {
            return `Unlocks: ${value}`;
        }

        if (
            key.includes('Bonus') ||
            key.includes('Multiplier') ||
            key.includes('Chance') ||
            key.includes('Reduction') ||
            key.includes('Rate')
        ) {
            const sign = key.includes('Reduction') ? '-' : '+';
            return `${sign}${(Number(value) * 100).toFixed(0)}% ${name}`;
        }

        return `+${value} ${name}`;
    };

    const purchaseUpgrade = () => {
        if (canAfford && !isMaxLevel && gameState.spendGold(cost)) {
            gameState.purchaseUpgrade(upgrade.category, upgrade.id);

            if (upgrade.category === 'characterPerks') {
                gameState.recalculatePlayerStats();
            }

            if (upgrade.type === 'cookingMethodUnlock' && upgrade.effects.unlockMethod) {
                const method = entityFactory.getTemplate(String(upgrade.effects.unlockMethod));
                if (method && method.type === 'cookingMethod') {
                    (method as any).unlocked = true;
                }
            }
        }
    };

    return (
        <div class={`card ${isMaxLevel ? 'max-level' : ''}`}>
            <h3>{upgrade.name} (Lv {currentLevel}/{upgrade.maxLevel})</h3>
            <p>{upgrade.description}</p>
            <p class="effect">{formatEffect(upgrade.effects)}</p>
            <div class="flex-row">
                <div></div>
                {isMaxLevel ? (
                    <span class="max-badge">MAX</span>
                ) : (
                    <button
                        class="button"
                        onClick={purchaseUpgrade}
                        disabled={!canAfford}
                    >
                        {cost}g
                    </button>
                )}
            </div>
        </div>
    );
}

export function UpgradesScreen() {
    const gold = useGold();
    const [currentTab, setCurrentTab] = useState<TabType>('kitchen');

    const categoryMap: Record<TabType, 'kitchen' | 'restaurantUpgrades' | 'characterPerks'> = {
        kitchen: 'kitchen',
        restaurant: 'restaurantUpgrades',
        character: 'characterPerks'
    };

    const category = categoryMap[currentTab];
    const upgrades = Object.values(upgradesData as Record<string, UpgradeData>)
        .filter(u => u.category === category);

    const tabs: { type: TabType; label: string }[] = [
        { type: 'kitchen', label: 'KITCHEN' },
        { type: 'restaurant', label: 'RESTAURANT' },
        { type: 'character', label: 'CHARACTER' }
    ];

    // Handle escape key to close screen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                gameState.setScreen('game');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div class="screen">
            <h1>⭐ UPGRADES ⭐</h1>
            <p>Gold: {gold}</p>

            <div style="display: flex; gap: 10px; margin: 20px 0;">
                {tabs.map(tab => (
                    <button
                        key={tab.type}
                        class="button"
                        onClick={() => setCurrentTab(tab.type)}
                        style={currentTab === tab.type
                            ? 'background: #FFD700; color: #000;'
                            : ''}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div class="grid-2col">
                {upgrades.map(upgrade => (
                    <UpgradeCard key={upgrade.id} upgrade={upgrade} />
                ))}
            </div>

            <button
                class="button"
                onClick={() => gameState.setScreen('game')}
                style="margin-top: 30px;"
            >
                ✕ CLOSE
            </button>
        </div>
    );
}
