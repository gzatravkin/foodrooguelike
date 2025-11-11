/**
 * CookingInputHandler - Handles keyboard input for cooking screen
 */

import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { eventBus } from '../core/EventBus';
import { CookingState, Section } from './CookingState';

export class CookingInputHandler {
    private keyListener: ((e: KeyboardEvent) => void) | null = null;
    private state: CookingState;
    private onRender: () => void;
    private onCook: () => void;

    constructor(state: CookingState, onRender: () => void, onCook: () => void) {
        this.state = state;
        this.onRender = onRender;
        this.onCook = onCook;
    }

    setup(): void {
        this.keyListener = (e: KeyboardEvent) => {
            // Don't handle if not visible
            if (gameState.getState().currentScreen !== 'cooking') return;

            e.preventDefault();

            // Section switching with Tab
            if (e.key === 'Tab') {
                this.cycleSection();
                this.onRender();
                return;
            }

            // Go back with Escape - close the UI and return to gameplay
            if (e.key === 'Escape') {
                const currentState = gameState.getState();
                if (currentState.currentScreen === 'cooking') {
                    (gameState as any).state.currentScreen = 'game';
                    eventBus.emit('screen:changed', 'game');
                }
                return;
            }

            // Cook with C key
            if (e.key === 'c' || e.key === 'C') {
                if (this.state.canCook()) {
                    this.onCook();
                }
                return;
            }

            // Recipe book with R key
            if (e.key === 'r' || e.key === 'R') {
                gameState.setCurrentScreen('recipebook');
                return;
            }

            // Navigation
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.moveCursor(-1);
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.moveCursor(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.moveCursor(-1);
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.moveCursor(1);
            }

            // Selection with Enter or Space
            if (e.key === 'Enter' || e.key === ' ') {
                this.selectCurrentItem();
            }

            // Number keys for quick time selection
            const num = parseInt(e.key);
            if (!isNaN(num) && num >= 1 && num <= 8) {
                this.state.setTimeCursor(num - 1);
                this.state.setCookingTime(this.state.timePresets[num - 1]);
                this.onRender();
            }

            this.onRender();
        };

        window.addEventListener('keydown', this.keyListener);
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
    }

    private cycleSection(): void {
        const sections: Section[] = ['ingredients', 'methods', 'time'];
        const currentIndex = sections.indexOf(this.state.getCurrentSection());
        this.state.setCurrentSection(sections[(currentIndex + 1) % sections.length]);
    }

    private moveCursor(delta: number): void {
        const currentSection = this.state.getCurrentSection();

        if (currentSection === 'ingredients') {
            const ingredients = cookingSystem.getAvailableIngredients().slice(0, 8);
            const newCursor = Math.max(0, Math.min(ingredients.length - 1, this.state.getIngredientCursor() + delta));
            this.state.setIngredientCursor(newCursor);
        } else if (currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            const newCursor = Math.max(0, Math.min(methods.length - 1, this.state.getMethodCursor() + delta));
            this.state.setMethodCursor(newCursor);
        } else if (currentSection === 'time') {
            const newCursor = Math.max(0, Math.min(this.state.timePresets.length - 1, this.state.getTimeCursor() + delta));
            this.state.setTimeCursor(newCursor);
            this.state.setCookingTime(this.state.timePresets[newCursor]);
        }
    }

    private selectCurrentItem(): void {
        const currentSection = this.state.getCurrentSection();

        if (currentSection === 'ingredients') {
            const ingredients = cookingSystem.getAvailableIngredients().slice(0, 8);
            const ingredientId = ingredients[this.state.getIngredientCursor()];
            if (ingredientId) {
                this.state.toggleIngredient(ingredientId);
            }
        } else if (currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            const methodId = methods[this.state.getMethodCursor()];
            if (methodId) {
                this.state.setSelectedMethod(methodId);
            }
        } else if (currentSection === 'time') {
            this.state.setCookingTime(this.state.timePresets[this.state.getTimeCursor()]);
        }
    }
}
