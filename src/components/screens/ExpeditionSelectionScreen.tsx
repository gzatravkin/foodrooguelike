/**
 * ExpeditionSelectionScreen - Preact component for expedition selection
 */

import { useState, useEffect } from 'preact/hooks';
import { useGold, useDishes, useGameState } from '../../hooks/useGameState';
import { gameState } from '../../core/GameState';
import expeditionsData from '../../data/expeditions.json';
import type { ExpeditionLocation } from '../../types/expedition';

export function ExpeditionSelectionScreen() {
    const gold = useGold();
    const dishes = useDishes();
    const expeditions = expeditionsData as Record<string, ExpeditionLocation>;
    const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState(1);
    const [selectedFoodBuff, setSelectedFoodBuff] = useState<string | undefined>(undefined);

    const expedition = selectedExpedition ? expeditions[selectedExpedition] : null;
    const progress = expedition ? gameState.getExpeditionProgress(expedition.id) : null;

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

    const startExpedition = () => {
        if (!expedition) return;

        const baseCost = expedition.cost;
        const levelMultiplier = 1 + (selectedLevel - 1) * 0.1;
        const cost = Math.floor(baseCost * levelMultiplier);

        if (gold >= cost && gameState.spendGold(cost)) {
            if (selectedFoodBuff) {
                gameState.setSelectedFoodBuff(selectedFoodBuff);
                gameState.removeDish(selectedFoodBuff);
            }

            gameState.setCurrentExpedition(expedition.id, selectedLevel);
            gameState.setScreen('game');
        }
    };

    const getCost = (level: number) => {
        if (!expedition) return 0;
        const levelMultiplier = 1 + (level - 1) * 0.1;
        return Math.floor(expedition.cost * levelMultiplier);
    };

    return (
        <div class="screen">
            <h1>⚔️ EXPEDITIONS</h1>
            <p>Gold: {gold}</p>

            <div style="display: flex; width: 100%; max-width: 1200px; gap: 20px; margin-top: 30px;">
                {/* Expeditions List */}
                <div style="flex: 1;">
                    <h2 style="color: #FFD700;">Select Expedition</h2>
                    {Object.values(expeditions).map(exp => {
                        const expProgress = gameState.getExpeditionProgress(exp.id);
                        const cost = getCost(expProgress.currentLevel);
                        const canAfford = gold >= cost;

                        return (
                            <div
                                key={exp.id}
                                class="card"
                                onClick={() => {
                                    setSelectedExpedition(exp.id);
                                    setSelectedLevel(expProgress.currentLevel);
                                }}
                                style={`cursor: pointer; ${selectedExpedition === exp.id ? 'border-color: #FFD700;' : ''}`}
                            >
                                <h3>{exp.name}</h3>
                                <p>{exp.description}</p>
                                <p style="color: #90EE90;">Difficulty: {exp.difficulty}</p>
                                <p style="color: #AAA;">Current Level: {expProgress.currentLevel}</p>
                                <p style={canAfford ? 'color: #FFD700;' : 'color: #D32F2F;'}>
                                    Cost: {cost}g
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Expedition Details */}
                {expedition && progress && (
                    <div style="flex: 1;">
                        <h2 style="color: #FFD700;">Expedition Details</h2>
                        <div class="card">
                            <h3>{expedition.name}</h3>
                            <p>{expedition.description}</p>
                            <p style="color: #90EE90;">Difficulty: {expedition.difficulty}</p>
                            <p style="color: #AAA;">
                                Progress: Level {selectedLevel} / 50
                            </p>
                            <p style="color: #AAA;">
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
                                <p>Level: {selectedLevel} (Cost: {getCost(selectedLevel)}g)</p>
                            </div>

                            {dishes.length > 0 && (
                                <div style="margin: 20px 0;">
                                    <label>Select Food Buff (Optional):</label>
                                    <select
                                        value={selectedFoodBuff || ''}
                                        onChange={(e) => setSelectedFoodBuff((e.target as HTMLSelectElement).value || undefined)}
                                        style="width: 100%; padding: 10px; margin-top: 10px; background: #2a2a2a; color: white; border: 1px solid #444; border-radius: 5px;"
                                    >
                                        <option value="">None</option>
                                        {dishes.map(dishId => (
                                            <option key={dishId} value={dishId}>{dishId}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                class="button"
                                onClick={startExpedition}
                                disabled={gold < getCost(selectedLevel)}
                                style="width: 100%; margin-top: 20px;"
                            >
                                START EXPEDITION ({getCost(selectedLevel)}g)
                            </button>
                        </div>
                    </div>
                )}
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
