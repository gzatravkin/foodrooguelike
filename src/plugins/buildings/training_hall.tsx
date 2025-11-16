/**
 * Training Hall Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { useGold } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import trainingData from '../../data/training.json';
import { ScreenContainer, ScreenHeader, GridLayout, FlexRow } from '../../components/common/Layout';
import { GoldDisplay } from '../../components/common/Display';
import { CloseButton } from '../../components/common/Button';
import { Card, CardTitle, CardEffect } from '../../components/common/Card';
import { formatEffect, calculateUpgradeCost } from '../../utils/formatting';
import { TileType } from '../../systems/MapSystem';

// =============================================================================
// SCREEN COMPONENT
// =============================================================================

interface TrainingSkill {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    maxLevel: number;
    requiredRestaurantLocation?: string;
    effect: {
        stat: string;
        amount: number;
    };
}

interface SkillCardProps {
    skill: TrainingSkill;
}

function SkillCard({ skill }: SkillCardProps) {
    const gold = useGold();
    const currentLevel = gameState.getTrainingSkillLevel(skill.id);
    const cost = calculateUpgradeCost(skill.baseCost, currentLevel, skill.costMultiplier);
    const canAfford = gold >= cost;
    const isMaxLevel = currentLevel >= skill.maxLevel;

    const purchaseSkill = () => {
        if (canAfford && !isMaxLevel && gameState.spendGold(cost)) {
            gameState.purchaseTrainingSkill(skill.id);

            // Recalculate player stats if necessary
            const effect = skill.effect;
            if (effect.stat === 'attack' || effect.stat === 'defense' || effect.stat === 'maxHealth') {
                gameState.recalculatePlayerStats();
            }
        }
    };

    return (
        <Card isMaxLevel={isMaxLevel}>
            <CardTitle level={{ current: currentLevel, max: skill.maxLevel }}>
                {skill.name}
            </CardTitle>
            <p>{skill.description}</p>
            <CardEffect>{formatEffect(skill.effect)}</CardEffect>
            <FlexRow>
                <div></div>
                {isMaxLevel ? (
                    <span class="max-badge">MAX</span>
                ) : (
                    <button
                        class="button"
                        onClick={purchaseSkill}
                        disabled={!canAfford}
                    >
                        {cost}g
                    </button>
                )}
            </FlexRow>
        </Card>
    );
}

export function TrainingScreen() {
    const allSkills = Object.values(trainingData as Record<string, TrainingSkill>);
    const restaurantLocation = gameState.getRestaurantLocation();

    // Define location progression order
    const locationOrder = [
        'starter_kitchen',
        'forest_outskirts',
        'dark_cave',
        'goblin_camp',
        'orc_stronghold',
        'frozen_wasteland',
        'volcano_depths',
        'demon_realm'
    ];
    const currentLocationIndex = locationOrder.indexOf(restaurantLocation);

    // Filter skills based on restaurant location progression
    const skills = allSkills.filter(skill => {
        if (!skill.requiredRestaurantLocation) return true; // No requirement, always available
        const requiredIndex = locationOrder.indexOf(skill.requiredRestaurantLocation);
        return requiredIndex <= currentLocationIndex; // Show if we've reached or passed required location
    });

    return (
        <ScreenContainer>
            <ScreenHeader
                title="TRAINING HALL"
                emoji="⚔️"
                subtitle="Train your skills and become stronger!"
            />
            <GoldDisplay />

            <GridLayout>
                {skills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
            </GridLayout>

            <CloseButton />
        </ScreenContainer>
    );
}

// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const TrainingHallBuilding: BuildingPlugin = {
  id: 'training_hall',
  name: 'Training Hall',
  description: 'Train your skills and improve your combat abilities',

  tileType: TileType.TRAINING_HALL,

  tile: {
    color: '#CD853F',
    walkable: true,
    blocksLight: false,
  },

  interaction: {
    prompt: 'Press E to enter Training Hall',
    interactKey: 'E',
  },

  screen: {
    id: 'training',
    component: TrainingScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 3, y: 16 },  // Fixed: was swapped
    size: { width: 2, height: 2 },
    priority: 90,
  },
};
