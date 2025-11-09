/**
 * CookingScreen - Where players combine ingredients to create dishes
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { cookingSystem } from '../systems/CookingSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';

export class CookingScreen extends Screen {
    private selectedIngredients: string[] = [];
    private selectedMethod: string = '';
    private resultMessage: string = '';

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'COOKING', 36, '#FFA500');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Ingredients section
        this.renderIngredients(50, 120);

        // Cooking methods
        this.renderCookingMethods(550, 120);

        // Selected items
        this.renderSelection(50, 450);

        // Cook button
        if (this.selectedIngredients.length > 0 && this.selectedMethod) {
            const cookBtn = this.renderer.createButton(vb.width / 2 - 100, 550, 200, 60, 'COOK!', () => {
                this.cook();
            });
            this.renderer.append(cookBtn);
        }

        // Result message
        if (this.resultMessage) {
            const msg = this.renderer.createText(vb.width / 2, 650, this.resultMessage, 18, '#90EE90');
            msg.setAttribute('text-anchor', 'middle');
            this.renderer.append(msg);
        }

        // Back button
        const backBtn = this.renderer.createButton(50, vb.height - 100, 150, 50, 'BACK', () => {
            gameState.setScreen('base');
        });
        this.renderer.append(backBtn);
    }

    private renderIngredients(x: number, y: number): void {
        const ingredients = cookingSystem.getAvailableIngredients();

        const label = this.renderer.createText(x, y, 'Available Ingredients:', 20, '#FFD700');
        this.renderer.append(label);

        ingredients.slice(0, 8).forEach((id, i) => {
            const ingredient = entityFactory.getTemplate(id);
            const isSelected = this.selectedIngredients.includes(id);

            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 35,
                200,
                30,
                ingredient?.name || id,
                () => this.toggleIngredient(id)
            );

            if (isSelected) {
                const rect = btn.querySelector('rect');
                if (rect) rect.setAttribute('fill', '#2E7D32');
            }

            this.renderer.append(btn);
        });
    }

    private renderCookingMethods(x: number, y: number): void {
        const methods = cookingSystem.getAvailableMethods();

        const label = this.renderer.createText(x, y, 'Cooking Methods:', 20, '#FFD700');
        this.renderer.append(label);

        methods.forEach((id, i) => {
            const method = entityFactory.getTemplate(id);
            const isSelected = this.selectedMethod === id;

            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 35,
                200,
                30,
                method?.name || id,
                () => this.selectMethod(id)
            );

            if (isSelected) {
                const rect = btn.querySelector('rect');
                if (rect) rect.setAttribute('fill', '#2E7D32');
            }

            this.renderer.append(btn);
        });
    }

    private renderSelection(x: number, y: number): void {
        const text = `Selected: ${this.selectedIngredients.length} ingredients, Method: ${this.selectedMethod || 'none'}`;
        const label = this.renderer.createText(x, y, text, 18, '#aaa');
        this.renderer.append(label);
    }

    private toggleIngredient(id: string): void {
        const index = this.selectedIngredients.indexOf(id);
        if (index > -1) {
            this.selectedIngredients.splice(index, 1);
        } else {
            this.selectedIngredients.push(id);
        }
        this.resultMessage = '';
        this.render();
    }

    private selectMethod(id: string): void {
        this.selectedMethod = id;
        this.resultMessage = '';
        this.render();
    }

    private cook(): void {
        const dish = cookingSystem.cook(this.selectedIngredients, this.selectedMethod);
        this.resultMessage = `Created ${dish.name}! Quality: ${Math.round(dish.quality * 100)}%`;

        gameState.addToInventory(dish.id);

        this.selectedIngredients = [];
        this.selectedMethod = '';

        this.render();
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.selectedIngredients = [];
        this.selectedMethod = '';
        this.resultMessage = '';
    }
}
