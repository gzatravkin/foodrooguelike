/**
 * ExpeditionSelectionScreen - Preact component for expedition selection
 */

import { useState } from 'preact/hooks';
import { useGold, useDishes } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import expeditionsData from '../../data/expeditions.json';
import type { ExpeditionLocation } from '../../types/expedition';
import { ScreenContainer, ScreenHeader } from '../common/Layout';
import { GoldDisplay, SectionTitle } from '../common/Display';
import { CloseButton, ActionButton } from '../common/Button';
import { Card, CardTitle, CardEffect } from '../common/Card';
import { formatGold } from '../../utils/formatting';
import { colors } from '../../styles/theme';

export function ExpeditionSelectionScreen() {
    const gold = useGold();
    const dishes = useDishes();
    const expeditions = expeditionsData as Record<string, ExpeditionLocation>;
    const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [selectedFoodBuff, setSelectedFoodBuff] = useState<string | undefined>(undefined);

    const expedition = selectedExpedition ? expeditions[selectedExpedition] : null;
    const progress = expedition ? gameState.getExpeditionProgress(expedition.id) : null;

    const getCost = (level: number) => {
        if (!expedition) return 0;
        const levelMultiplier = 1 + (level - 1) * 0.1;
        return Math.floor(expedition.cost * levelMultiplier);
    };

    const startExpedition = () => {
        if (!expedition) return;

        const cost = getCost(selectedLevel);

        if (gold >= cost && gameState.spendGold(cost)) {
            if (selectedFoodBuff) {
                gameState.setSelectedFoodBuff(selectedFoodBuff);
                gameState.removeDish(selectedFoodBuff);
            }

            // Store expedition data to localStorage so GameModeManager can load it
            const expeditionData = {
                ...expedition,
                level: selectedLevel
            };
            localStorage.setItem('selectedExpedition', JSON.stringify(expeditionData));

            gameState.setCurrentExpedition(expedition.id, selectedLevel);
            gameState.setScreen('game');
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="EXPEDITIONS" emoji="⚔️" />
            <GoldDisplay />

            <div style="display: flex; width: 100%; max-width: 1200px; gap: 20px; margin-top: 30px;">
                {/* Expeditions List */}
                <div style="flex: 1;">
                    <SectionTitle>Select Expedition</SectionTitle>
                    {Object.values(expeditions).map(exp => {
                        const expProgress = gameState.getExpeditionProgress(exp.id);
                        const cost = getCost(expProgress.currentLevel);
                        const canAfford = gold >= cost;
                        const isSelected = selectedExpedition === exp.id;

                        return (
                            <Card
                                key={exp.id}
                                isSelected={isSelected}
                                onClick={() => {
                                    setSelectedExpedition(exp.id);
                                    setSelectedLevel(expProgress.currentLevel);
                                }}
                                style={isSelected ? `border-color: ${colors.gold};` : ''}
                            >
                                <CardTitle>{exp.name}</CardTitle>
                                <p>{exp.description}</p>
                                <CardEffect>Difficulty: {exp.difficulty}</CardEffect>
                                <p style={`color: ${colors.textMuted};`}>Current Level: {expProgress.currentLevel}</p>
                                <p style={canAfford ? `color: ${colors.gold};` : `color: ${colors.danger};`}>
                                    Cost: {formatGold(cost)}
                                </p>
                            </Card>
                        );
                    })}
                </div>

                {/* Expedition Details */}
                {expedition && progress && (
                    <div style="flex: 1;">
                        <SectionTitle>Expedition Details</SectionTitle>
                        <Card>
                            <CardTitle>{expedition.name}</CardTitle>
                            <p>{expedition.description}</p>
                            <CardEffect>Difficulty: {expedition.difficulty}</CardEffect>
                            <p style={`color: ${colors.textMuted};`}>
                                Progress: Level {selectedLevel} / 50
                            </p>
                            <p style={`color: ${colors.textMuted};`}>
                                Highest Completed: Level {progress.highestLevelCompleted}
                            </p>

                            <div style="margin: 20px 0;">
                                <label>Select Level:</label>
                                <input
                                    type="range"
                                    min="1"
                                    max={progress.currentLevel}
                                    value={selectedLevel}
                                    onInput={(e) => setSelectedLevel(parseInt((e.target as HTMLInputElement).value))}
                                    style="width: 100%; margin-top: 10px;"
                                />
                                <p>Level: {selectedLevel} (Cost: {formatGold(getCost(selectedLevel))})</p>
                            </div>

                            {dishes.length > 0 && (
                                <div style="margin: 20px 0;">
                                    <label>Select Food Buff (Optional):</label>
                                    <select
                                        value={selectedFoodBuff || ''}
                                        onChange={(e) => setSelectedFoodBuff((e.target as HTMLSelectElement).value || undefined)}
                                        style={`width: 100%; padding: 10px; margin-top: 10px; background: ${colors.bgMedium}; color: white; border: 1px solid ${colors.borderDark}; border-radius: 5px;`}
                                    >
                                        <option value="">None</option>
                                        {dishes.map(dishId => (
                                            <option key={dishId} value={dishId}>{dishId}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <ActionButton
                                onClick={startExpedition}
                                disabled={gold < getCost(selectedLevel)}
                                style="width: 100%; margin-top: 20px;"
                            >
                                START EXPEDITION ({formatGold(getCost(selectedLevel))})
                            </ActionButton>
                        </Card>
                    </div>
                )}
            </div>

            <CloseButton />
        </ScreenContainer>
    );
}
