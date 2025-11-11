/**
 * CookingInputHandler - Handles keyboard input for cooking screen
 */

import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { eventBus } from '../core/EventBus';
import { entityFactory } from '../entities/EntityFactory';
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
        const sections: Section[] = ['ingredients', 'methods', 'time', 'quickselect'];
        const currentIndex = sections.indexOf(this.state.getCurrentSection());
        this.state.setCurrentSection(sections[(currentIndex + 1) % sections.length]);
    }

    private moveCursor(delta: number): void {
        const currentSection = this.state.getCurrentSection();

        if (currentSection === 'ingredients') {
            const stackedIngredients = this.getStackedIngredients();
            const newCursor = Math.max(0, Math.min(stackedIngredients.length - 1, this.state.getIngredientCursor() + delta));
            this.state.setIngredientCursor(newCursor);
        } else if (currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            const newCursor = Math.max(0, Math.min(methods.length - 1, this.state.getMethodCursor() + delta));
            this.state.setMethodCursor(newCursor);
        } else if (currentSection === 'time') {
            const newCursor = Math.max(0, Math.min(this.state.timePresets.length - 1, this.state.getTimeCursor() + delta));
            this.state.setTimeCursor(newCursor);
            this.state.setCookingTime(this.state.timePresets[newCursor]);
        } else if (currentSection === 'quickselect') {
            const savedRecipes = gameState.getSavedRecipeConfigs();
            const newCursor = Math.max(0, Math.min(savedRecipes.length - 1, this.state.getQuickSelectCursor() + delta));
            this.state.setQuickSelectCursor(newCursor);
        }
    }

    private getStackedIngredients(): Array<{template: any, ids: string[], count: number}> {
        const allIngredients = cookingSystem.getAvailableIngredients();
        const ingredientStacks = new Map<string, {template: any, ids: string[], count: number}>();
        allIngredients.forEach(id => {
            const template = entityFactory.getTemplate(id);
            if (template) {
                const templateId = template.id;
                if (!ingredientStacks.has(templateId)) {
                    ingredientStacks.set(templateId, {
                        template: template,
                        ids: [],
                        count: 0
                    });
                }
                const stack = ingredientStacks.get(templateId)!;
                stack.ids.push(id);
                stack.count++;
            }
        });
        return Array.from(ingredientStacks.values()).slice(0, 8);
    }

    private selectCurrentItem(): void {
        const currentSection = this.state.getCurrentSection();

        if (currentSection === 'ingredients') {
            const stackedIngredients = this.getStackedIngredients();
            const stack = stackedIngredients[this.state.getIngredientCursor()];
            if (stack) {
                // Find first unselected ingredient of this type, or toggle first one
                const unselected = stack.ids.find(id => !this.state.getSelectedIngredients().includes(id));
                if (unselected) {
                    this.state.toggleIngredient(unselected);
                } else {
                    // All selected, toggle the first one off
                    this.state.toggleIngredient(stack.ids[0]);
                }
            }
        } else if (currentSection === 'methods') {
            const methods = cookingSystem.getAvailableMethods();
            const methodId = methods[this.state.getMethodCursor()];
            if (methodId) {
                this.state.setSelectedMethod(methodId);
            }
        } else if (currentSection === 'time') {
            this.state.setCookingTime(this.state.timePresets[this.state.getTimeCursor()]);
        } else if (currentSection === 'quickselect') {
            const savedRecipes = gameState.getSavedRecipeConfigs();
            const recipe = savedRecipes[this.state.getQuickSelectCursor()];
            if (recipe) {
                const availableIngredients = cookingSystem.getAvailableIngredients();
                const success = this.state.loadRecipeConfig(
                    recipe.ingredientTemplates,
                    recipe.methodId,
                    recipe.cookingTime,
                    availableIngredients
                );
                if (!success) {
                    // Show a message or indicator that ingredients are missing
                    console.log('Missing ingredients for recipe:', recipe.recipeName);
                }
            }
        }
    }
}
