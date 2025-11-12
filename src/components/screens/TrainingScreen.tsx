/**
 * TrainingScreen - Preact component for the Training Academy
 */

import { useEffect } from 'preact/hooks';
import { useGold, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import trainingData from '../../data/training.json';

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
    const cost = Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
    const canAfford = gold >= cost;
    const isMaxLevel = currentLevel >= skill.maxLevel;

    const formatEffect = (effect: { stat: string; amount: number }): string => {
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
    };

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
        <div class={`card ${isMaxLevel ? 'max-level' : ''}`}>
            <h3>{skill.name} (Lv {currentLevel}/{skill.maxLevel})</h3>
            <p>{skill.description}</p>
            <p class="effect">{formatEffect(skill.effect)}</p>
            <div class="flex-row">
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
            </div>
        </div>
    );
}

export function TrainingScreen() {
    const gold = useGold();
    const skills = Object.values(trainingData as Record<string, TrainingSkill>);

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
            <h1>⚔️ TRAINING ACADEMY ⚔️</h1>
            <p>Gold: {gold}</p>
            <p style="color: #AAA; margin-bottom: 20px;">
                Spend gold to permanently improve your abilities
            </p>

            <div class="grid-2col">
                {skills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
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
