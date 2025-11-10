/**
 * EntityFactory - Creates game entities from data
 * This is the main way to instantiate entities in the game
 */

import type { GameEntity, Enemy, Ingredient, Dish, Equipment, CookingMethod, Weapon } from './types';

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

    createWeapon(id: string): Weapon | null {
        return this.create(id) as Weapon;
    }

    // Deprecated: Dish creation is now handled by CookingSystem
    createDish(recipeId: string, ingredients: string[], cookingMethod: string, quality: number): Dish {
        console.warn('EntityFactory.createDish is deprecated. Use CookingSystem.cook instead.');

        let ingredientValue = 0;
        ingredients.forEach(ingId => {
            const template = this.getTemplate(ingId);
            if (template?.baseValue) {
                ingredientValue += template.baseValue;
            }
        });

        const cookingMethodTemplate = this.getTemplate(cookingMethod);
        const methodModifier = cookingMethodTemplate?.qualityModifier || 1.0;
        const baseValue = ingredientValue * 2.5 * quality * methodModifier;
        const baseEffect = Math.floor(quality * 10);

        return {
            id: `dish_${Date.now()}`,
            type: 'dish',
            recipeId: recipeId || 'unknown_dish',
            name: `${cookingMethod} Dish`,
            description: `Made with ${ingredients.join(', ')}`,
            ingredients,
            cookingMethod,
            cookingTime: 0,
            quality,
            value: Math.floor(baseValue),
            rarity: 'common',
            buffType: 'health',
            effects: {
                health: baseEffect,
                attack: Math.floor(baseEffect * 0.5),
                defense: Math.floor(baseEffect * 0.3),
                duration: 3
            }
        };
    }

    getTemplate(id: string): any {
        return this.templates.get(id);
    }

    getAllOfType(type: string): GameEntity[] {
        return Array.from(this.templates.values()).filter(t => t.type === type);
    }

    getAllRecipes(): any[] {
        return Array.from(this.templates.values()).filter(t => t.type === 'recipe');
    }

    getIngredients(ingredientIds: string[]): Ingredient[] {
        return ingredientIds
            .map(id => this.createIngredient(id))
            .filter(ing => ing !== null) as Ingredient[];
    }
}

export const entityFactory = new EntityFactory();
