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
import recipesCommon from '../data/recipes-common.json';
import recipesUncommon from '../data/recipes-uncommon.json';
import recipesRare from '../data/recipes-rare.json';
import recipesLegendary from '../data/recipes-legendary.json';
import upgradesData from '../data/upgrades.json';

// Import plugin registries
import { EnemyRegistry } from '../plugins/enemies';
import { WeaponRegistry } from '../plugins/weapons';

export class DataLoader {
    async loadAll(): Promise<void> {
        try {
            // Register templates from JSON files
            entityFactory.registerTemplates(enemiesData);
            entityFactory.registerTemplates(ingredientsData);
            entityFactory.registerTemplates(cookingMethodsData);
            entityFactory.registerTemplates(equipmentData);
            entityFactory.registerTemplates(weaponsData);

            // Load recipes from split files
            entityFactory.registerTemplates(recipesCommon);
            entityFactory.registerTemplates(recipesUncommon);
            entityFactory.registerTemplates(recipesRare);
            entityFactory.registerTemplates(recipesLegendary);

            entityFactory.registerTemplates(upgradesData);

            // Load plugin enemies and weapons
            console.log('Loading plugin entities...');
            EnemyRegistry.getAll().forEach(enemy => {
                entityFactory.registerTemplate(enemy.id, enemy);
            });
            WeaponRegistry.getAll().forEach(weapon => {
                entityFactory.registerTemplate(weapon.id, weapon);
            });

            console.log('All game data loaded successfully');
        } catch (error) {
            console.error('Failed to load game data:', error);
            throw error;
        }
    }
}

export const dataLoader = new DataLoader();
