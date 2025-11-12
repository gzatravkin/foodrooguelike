/**
 * CookingScreen - Keyboard-driven cooking interface
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import { CookingState } from './CookingState';
import { CookingInputHandler } from './CookingInputHandler';
import { CookingRenderer } from './CookingRenderer';

export class CookingScreen extends Screen {
    private state: CookingState;
    private inputHandler: CookingInputHandler;
    private cookingRenderer: CookingRenderer;

    constructor(renderer: SVGRenderer) {
        super(renderer);
        this.state = new CookingState();
        this.cookingRenderer = new CookingRenderer(renderer, this.state);
        this.inputHandler = new CookingInputHandler(
            this.state,
            () => this.render(),
            () => this.cook()
        );
        this.inputHandler.setup();
    }

    private cook(): void {
        const dish = cookingSystem.cook(
            this.state.getSelectedIngredients(),
            this.state.getSelectedMethod(),
            this.state.getCookingTime()
        );
        gameState.addDish(dish.id);
        entityFactory.registerTemplate(dish.id, dish);
        this.state.setLastDish(dish);
        this.state.clearSelection();
        this.render();
    }

    render(): void {
        // Re-setup keyboard controls if they were cleaned up
        this.inputHandler.setup();
        this.cookingRenderer.render();
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Keyboard-only interface
    }

    cleanup(): void {
        this.inputHandler.cleanup();
        this.state.reset();
    }
}

