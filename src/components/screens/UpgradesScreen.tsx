/**
 * UpgradesScreen - Preact component for upgrades
 */

import { useState } from 'preact/hooks';
import { useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';
import upgradesData from '../../data/upgrades.json';
import { ScreenContainer, ScreenHeader, GridLayout, FlexRow } from '../common/Layout';
import { GoldDisplay } from '../common/Display';
import { CloseButton, ActionButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { formatEffect, calculateUpgradeCost } from '../../utils/formatting';
import { colors, commonStyles } from '../../styles/theme';

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
    const cost = calculateUpgradeCost(upgrade.baseCost, currentLevel, upgrade.costMultiplier);
    const canAfford = gold >= cost;
    const isMaxLevel = currentLevel >= upgrade.maxLevel;

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
        <Card isMaxLevel={isMaxLevel}>
            <CardTitle level={{ current: currentLevel, max: upgrade.maxLevel }}>
                {upgrade.name}
            </CardTitle>
            <p>{upgrade.description}</p>
            <CardEffect>{formatEffect(upgrade.effects)}</CardEffect>
            <FlexRow>
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
            </FlexRow>
        </Card>
    );
}

export function UpgradesScreen() {
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

    return (
        <ScreenContainer>
            <ScreenHeader title="UPGRADES" emoji="⭐" />
            <GoldDisplay />

            <div style="display: flex; gap: 5px; margin: 10px 0;">
                {tabs.map(tab => (
                    <ActionButton
                        key={tab.type}
                        onClick={() => setCurrentTab(tab.type)}
                        style={currentTab === tab.type ? commonStyles.activeTab : ''}
                    >
                        {tab.label}
                    </ActionButton>
                ))}
            </div>

            <GridLayout>
                {upgrades.map(upgrade => (
                    <UpgradeCard key={upgrade.id} upgrade={upgrade} />
                ))}
            </GridLayout>

            <CloseButton />
        </ScreenContainer>
    );
}
