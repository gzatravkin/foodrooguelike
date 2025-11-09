/**
 * DataLoader - Loads JSON data files and registers them with the EntityFactory
 * Add new data files to the imports and they'll be automatically loaded
 */

import { entityFactory } from '../entities/EntityFactory';
import enemiesData from '../data/enemies.json';
import ingredientsData from '../data/ingredients.json';
import cookingMethodsData from '../data/cookingMethods.json';
import equipmentData from '../data/equipment.json';
import weaponsData from '../data/weapons.json';
import recipesData from '../data/recipes.json';
import upgradesData from '../data/upgrades.json';

export class DataLoader {
    async loadAll(): Promise<void> {
        try {
            // Register templates
            entityFactory.registerTemplates(enemiesData);
            entityFactory.registerTemplates(ingredientsData);
            entityFactory.registerTemplates(cookingMethodsData);
            entityFactory.registerTemplates(equipmentData);
            entityFactory.registerTemplates(weaponsData);
            entityFactory.registerTemplates(recipesData);
            entityFactory.registerTemplates(upgradesData);

            console.log('All game data loaded successfully');
        } catch (error) {
            console.error('Failed to load game data:', error);
            throw error;
        }
    }
}

export const dataLoader = new DataLoader();
