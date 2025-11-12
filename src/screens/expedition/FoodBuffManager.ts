/**
 * Manager for food buff selection and application
 */

import { gameState } from '../../core/GameState';
import { entityFactory } from '../../entities/EntityFactory';

export class FoodBuffManager {
    private selectedFoodBuff: string | null = null;

    getSelectedFoodBuff(): string | null {
        return this.selectedFoodBuff;
    }

    setSelectedFoodBuff(dishId: string | null): void {
        this.selectedFoodBuff = dishId;
    }

    /**
     * Cycle to the next available dish
     */
    selectNextDish(dishes: string[]): void {
        if (dishes.length === 0) return;

        const currentIndex = this.selectedFoodBuff
            ? dishes.indexOf(this.selectedFoodBuff)
            : -1;

        const nextIndex = (currentIndex + 1) % dishes.length;
        this.selectedFoodBuff = dishes[nextIndex];
    }

    /**
     * Apply the selected food buff and remove the dish from inventory
     */
    applySelectedBuff(): void {
        if (!this.selectedFoodBuff) return;

        const dish = entityFactory.getTemplate(this.selectedFoodBuff);

        if (dish && 'effects' in dish) {
            const effects = dish.effects;
            if (effects) {
                // Apply instant health restoration
                if (effects.health && effects.health > 0) {
                    const state = gameState.getState();
                    const newHealth = Math.min(
                        state.player.maxHealth,
                        state.player.health + effects.health
                    );
                    gameState.updatePlayer({ health: newHealth });
                }

                // Apply buffs for attack/defense
                if (effects.attack || effects.defense) {
                    gameState.addBuff({
                        name: dish.name,
                        duration: effects.duration || 60,
                        effects: {
                            attack: effects.attack,
                            defense: effects.defense
                        }
                    });
                }
            }
        }

        gameState.setSelectedFoodBuff(this.selectedFoodBuff);
        gameState.removeDish(this.selectedFoodBuff);
    }

    /**
     * Reset food buff selection
     */
    reset(): void {
        this.selectedFoodBuff = null;
    }
}
