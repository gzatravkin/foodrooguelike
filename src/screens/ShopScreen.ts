/**
 * ShopScreen - Clean, new shop implementation
 * Buy weapons, equipment, and manage dishes
 *
 * Refactored to use modular components for better maintainability
 */

import { Screen } from '../rendering/Screen';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import { ShopStateManager } from './shop/ShopStateManager';
import { ShopRenderer } from './shop/ShopRenderer';
import { ShopPurchaseHandler } from './shop/ShopPurchaseHandler';

export class ShopScreen extends Screen {
    private stateManager: ShopStateManager;
    private shopRenderer: ShopRenderer;
    private purchaseHandler: ShopPurchaseHandler;

    constructor(renderer: SVGRenderer) {
        super(renderer);

        // Initialize state manager with render callback
        this.stateManager = new ShopStateManager(() => this.render());

        // Initialize purchase handler
        this.purchaseHandler = new ShopPurchaseHandler(this.stateManager);

        // Initialize renderer with all necessary callbacks
        this.shopRenderer = new ShopRenderer(
            this.renderer,
            () => this.stateManager.getState(),
            () => this.stateManager.getDishes(),
            (weapon) => this.purchaseHandler.buyWeapon(weapon),
            (equipment) => this.purchaseHandler.buyEquipment(equipment),
            (dish) => this.purchaseHandler.sellDish(dish),
            (dish) => this.purchaseHandler.eatDish(dish)
        );
    }

    render(): void {
        // Re-setup keyboard controls if they were cleaned up
        this.stateManager.setupKeyboardControls();

        // Delegate rendering to the shop renderer
        const { text, timer } = this.stateManager.getMessage();
        this.shopRenderer.render(text, timer);
    }

    update(deltaTime: number): void {
        this.stateManager.updateMessageTimer(deltaTime);
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by button callbacks
    }

    cleanup(): void {
        this.stateManager.cleanup();
    }
}
