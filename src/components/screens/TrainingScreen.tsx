/**
 * TrainingScreen - Preact component for the Training Academy
 */

import { useGold } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import trainingData from '../../data/training.json';
import { ScreenContainer, ScreenHeader, GridLayout, FlexRow } from '../common/Layout';
import { GoldDisplay } from '../common/Display';
import { CloseButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { formatEffect, calculateUpgradeCost } from '../../utils/formatting';

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
    const skills = Object.values(trainingData as Record<string, TrainingSkill>);

    return (
        <ScreenContainer>
            <ScreenHeader
                title="TRAINING ACADEMY"
                emoji="⚔️"
                subtitle="Spend gold to permanently improve your abilities"
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
