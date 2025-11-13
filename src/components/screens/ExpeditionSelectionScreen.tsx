/**
 * ExpeditionSelectionScreen - Preact component for expedition selection
 */

import { useState, useEffect } from 'preact/hooks';
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
    const expeditionIds = Object.keys(expeditions);

    // Initialize with preselected expedition if available
    const getInitialExpeditionIndex = () => {
        try {
            const preselected = localStorage.getItem('preselectedExpedition');
            if (preselected) {
                const expedition = JSON.parse(preselected) as ExpeditionLocation;
                localStorage.removeItem('preselectedExpedition');
                const index = expeditionIds.indexOf(expedition.id);
                return index >= 0 ? index : 0;
            }
        } catch (error) {
            console.error('Failed to load preselected expedition:', error);
        }
        return 0;
    };

    const [currentExpeditionIndex, setCurrentExpeditionIndex] = useState(getInitialExpeditionIndex);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [selectedFoodBuff, setSelectedFoodBuff] = useState<string | undefined>(undefined);

    const expedition = expeditions[expeditionIds[currentExpeditionIndex]];
    const progress = expedition ? gameState.getExpeditionProgress(expedition.id) : null;
    const isUnlocked = expedition ? gameState.isLocationUnlocked(expedition.id) : false;

    // Update selected level when expedition changes
    useEffect(() => {
        if (progress) {
            setSelectedLevel(progress.currentLevel);
        }
    }, [currentExpeditionIndex, progress?.currentLevel]);

    const getCost = (level: number) => {
        if (!expedition) return 0;
        const levelMultiplier = 1 + (level - 1) * 0.1;
        return Math.floor(expedition.cost * levelMultiplier);
    };

    const unlockExpedition = () => {
        if (!expedition) return;
        gameState.unlockExpedition(expedition.id, expedition.unlockCost);
    };

    const startExpedition = () => {
        if (!expedition || !isUnlocked) return;

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

    const goToPreviousExpedition = () => {
        if (currentExpeditionIndex > 0) {
            const newIndex = currentExpeditionIndex - 1;
            setCurrentExpeditionIndex(newIndex);
            const newProgress = gameState.getExpeditionProgress(expeditionIds[newIndex]);
            setSelectedLevel(newProgress.currentLevel);
        }
    };

    const goToNextExpedition = () => {
        if (currentExpeditionIndex < expeditionIds.length - 1) {
            const newIndex = currentExpeditionIndex + 1;
            setCurrentExpeditionIndex(newIndex);
            const newProgress = gameState.getExpeditionProgress(expeditionIds[newIndex]);
            setSelectedLevel(newProgress.currentLevel);
        }
    };

    return (
        <ScreenContainer>
            <ScreenHeader title="EXPEDITIONS" emoji="⚔️" />
            <GoldDisplay />

            <div style="width: 100%; max-width: 600px; margin-top: 20px;">
                {/* Expedition Navigation */}
                <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                    <ActionButton
                        onClick={goToPreviousExpedition}
                        disabled={currentExpeditionIndex === 0}
                        style="padding: 8px 15px; min-width: 80px;"
                    >
                        ← Previous
                    </ActionButton>
                    <div style="flex: 1; text-align: center; color: #FFD700; font-weight: bold;">
                        {currentExpeditionIndex + 1} / {expeditionIds.length}
                    </div>
                    <ActionButton
                        onClick={goToNextExpedition}
                        disabled={currentExpeditionIndex === expeditionIds.length - 1}
                        style="padding: 8px 15px; min-width: 80px;"
                    >
                        Next →
                    </ActionButton>
                </div>

                {/* Expedition Details */}
                {expedition && progress && (
                    <Card style="padding: 15px;">
                        <CardTitle style="font-size: 20px;">
                            {expedition.name} {!isUnlocked && '🔒'}
                        </CardTitle>
                        <p style="font-size: 14px; margin: 8px 0;">{expedition.description}</p>
                        <CardEffect style="font-size: 13px;">Difficulty: {expedition.difficulty}</CardEffect>

                        {!isUnlocked ? (
                            <>
                                <p style={`color: ${colors.textMuted}; font-size: 14px; margin: 10px 0;`}>
                                    This expedition is locked. Unlock it to begin your adventure!
                                </p>
                                <ActionButton
                                    onClick={unlockExpedition}
                                    disabled={gold < expedition.unlockCost}
                                    style="width: 100%; margin-top: 15px; padding: 12px; font-size: 15px; background: #9C27B0;"
                                >
                                    🔓 UNLOCK EXPEDITION ({formatGold(expedition.unlockCost)})
                                </ActionButton>
                            </>
                        ) : (
                            <>
                                <p style={`color: ${colors.textMuted}; font-size: 13px; margin: 5px 0;`}>
                                    Progress: Level {selectedLevel} / 50
                                </p>
                                <p style={`color: ${colors.textMuted}; font-size: 13px; margin: 5px 0;`}>
                                    Highest Completed: Level {progress.highestLevelCompleted}
                                </p>

                                <div style="margin: 15px 0;">
                                    <label style="font-size: 14px;">Select Level:</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max={progress.currentLevel}
                                        value={selectedLevel}
                                        onInput={(e) => setSelectedLevel(parseInt((e.target as HTMLInputElement).value))}
                                        style="width: 100%; margin-top: 8px;"
                                    />
                                    <p style="font-size: 13px; margin-top: 5px;">Level: {selectedLevel} (Cost: {formatGold(getCost(selectedLevel))})</p>
                                </div>

                                {dishes.length > 0 && (
                                    <div style="margin: 15px 0;">
                                        <label style="font-size: 14px;">Select Food Buff (Optional):</label>
                                        <select
                                            value={selectedFoodBuff || ''}
                                            onChange={(e) => setSelectedFoodBuff((e.target as HTMLSelectElement).value || undefined)}
                                            style={`width: 100%; padding: 8px; margin-top: 8px; font-size: 13px; background: ${colors.bgMedium}; color: white; border: 1px solid ${colors.borderDark}; border-radius: 5px;`}
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
                                    style="width: 100%; margin-top: 15px; padding: 12px; font-size: 15px;"
                                >
                                    START EXPEDITION ({formatGold(getCost(selectedLevel))})
                                </ActionButton>
                            </>
                        )}
                    </Card>
                )}
            </div>

            <CloseButton />
        </ScreenContainer>
    );
}
