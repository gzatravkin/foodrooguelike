/**
 * EntityFactory - Creates game entities from data
 * This is the main way to instantiate entities in the game
 */

import type { GameEntity, Enemy, Ingredient, Dish, Equipment, CookingMethod } from './types';

export class EntityFactory {
    private templates: Map<string, any> = new Map();

    registerTemplate(id: string, template: any): void {
        this.templates.set(id, template);
    }

    registerTemplates(templates: Record<string, any>): void {
        Object.entries(templates).forEach(([id, template]) => {
            this.registerTemplate(id, template);
        });
    }

    create(id: string, overrides?: Partial<any>): GameEntity | null {
        const template = this.templates.get(id);
        if (!template) {
            console.warn(`Template not found: ${id}`);
            return null;
        }

        return { ...template, ...overrides };
    }

    createEnemy(id: string): Enemy | null {
        return this.create(id) as Enemy;
    }

    createIngredient(id: string): Ingredient | null {
        return this.create(id) as Ingredient;
    }

    createDish(recipeId: string, ingredients: string[], cookingMethod: string, quality: number): Dish {
        // Calculate base value from ingredient worth
        let ingredientValue = 0;
        ingredients.forEach(ingId => {
            const template = this.getTemplate(ingId);
            if (template?.baseValue) {
                ingredientValue += template.baseValue;
            }
        });

        // Apply cooking multiplier (2.5x for profitability) and quality
        const cookingMethodTemplate = this.getTemplate(cookingMethod);
        const methodModifier = cookingMethodTemplate?.qualityModifier || 1.0;
        const baseValue = ingredientValue * 2.5 * quality * methodModifier;

        return {
            id: `dish_${Date.now()}`,
            type: 'dish',
            name: `${cookingMethod} Dish`,
            description: `Made with ${ingredients.join(', ')}`,
            ingredients,
            cookingMethod,
            quality,
            value: Math.floor(baseValue),
            effects: this.calculateDishEffects(quality)
        };
    }

    private calculateDishEffects(quality: number) {
        const baseEffect = Math.floor(quality * 10);
        return {
            health: baseEffect,
            attack: Math.floor(baseEffect * 0.5),
            defense: Math.floor(baseEffect * 0.3),
            duration: 3
        };
    }

    getTemplate(id: string): any {
        return this.templates.get(id);
    }

    getAllOfType(type: string): GameEntity[] {
        return Array.from(this.templates.values()).filter(t => t.type === type);
    }
}

export const entityFactory = new EntityFactory();
