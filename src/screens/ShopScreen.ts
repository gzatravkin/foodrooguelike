/**
 * ShopScreen - Where players buy equipment and sell/eat dishes
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { shopSystem } from '../systems/ShopSystem';
import { entityFactory } from '../entities/EntityFactory';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import type { Dish, Weapon } from '../entities/types';

export class ShopScreen extends Screen {
    private message: string = '';

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'SHOP', 36, '#4CAF50');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const gold = this.renderer.createText(vb.width - 150, 60, `Gold: ${gameState.getState().gold}`, 20, '#FFD700');
        this.renderer.append(gold);

        // Weapons for sale
        this.renderWeapons(50, 120);

        // Equipment for sale
        this.renderEquipment(350, 120);

        // Player's dishes
        this.renderDishes(650, 120);

        // Message
        if (this.message) {
            const msg = this.renderer.createText(vb.width / 2, vb.height - 150, this.message, 18, '#90EE90');
            msg.setAttribute('text-anchor', 'middle');
            this.renderer.append(msg);
        }

        // Back button
        const backBtn = this.renderer.createButton(50, vb.height - 100, 150, 50, 'BACK', () => {
            gameState.setScreen('base');
        });
        this.renderer.append(backBtn);
    }

    private renderWeapons(x: number, y: number): void {
        const weapons = shopSystem.getWeaponInventory();

        const label = this.renderer.createText(x, y, 'Weapons:', 20, '#FFD700');
        this.renderer.append(label);

        weapons.slice(0, 8).forEach((weapon, i) => {
            const type = weapon.weaponType === 'ranged' ? '🔫' : '⚔️';
            const rarity = weapon.rarity;
            const rarityColor = rarity === 'legendary' ? '#FF6B00' :
                               rarity === 'rare' ? '#9C27B0' :
                               rarity === 'uncommon' ? '#2196F3' : '#888';

            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 50,
                280,
                45,
                `${type} ${weapon.name} - ${weapon.cost}g`,
                () => this.buyWeapon(weapon.id)
            );
            btn.style.borderColor = rarityColor;
            btn.style.borderWidth = '2px';
            this.renderer.append(btn);

            // Weapon stats
            const stats = this.renderer.createText(
                x + 10,
                y + 75 + i * 50,
                `DMG: ${weapon.damage} | SPD: ${weapon.attackSpeed.toFixed(1)}s`,
                12,
                '#aaa'
            );
            this.renderer.append(stats);
        });
    }

    private renderEquipment(x: number, y: number): void {
        const equipment = shopSystem.getShopInventory();

        const label = this.renderer.createText(x, y, 'Equipment:', 20, '#FFD700');
        this.renderer.append(label);

        equipment.slice(0, 6).forEach((item, i) => {
            const btn = this.renderer.createButton(
                x,
                y + 40 + i * 40,
                250,
                35,
                `${item.name} (${item.cost}g)`,
                () => this.buyEquipment(item.id)
            );
            this.renderer.append(btn);
        });
    }

    private renderDishes(x: number, y: number): void {
        const dishes = gameState.getState().inventory
            .map(id => entityFactory.getTemplate(id))
            .filter(item => item?.type === 'dish') as Dish[];

        const label = this.renderer.createText(x, y, 'Your Dishes:', 20, '#FFD700');
        this.renderer.append(label);

        dishes.slice(0, 6).forEach((dish, i) => {
            const yPos = y + 40 + i * 60;

            // Dish info
            const info = this.renderer.createText(x, yPos, `${dish.name} (${dish.value}g)`, 16);
            this.renderer.append(info);

            // Sell button
            const sellBtn = this.renderer.createButton(x, yPos + 10, 80, 30, 'SELL', () => {
                this.sellDish(dish);
            });
            this.renderer.append(sellBtn);

            // Eat button
            const eatBtn = this.renderer.createButton(x + 90, yPos + 10, 80, 30, 'EAT', () => {
                this.eatDish(dish);
            });
            this.renderer.append(eatBtn);
        });
    }

    private buyWeapon(id: string): void {
        const success = shopSystem.buyWeapon(id);
        if (success) {
            this.message = 'Weapon purchased! Equip it from your inventory.';
        } else {
            this.message = 'Not enough gold!';
        }
        this.render();
    }

    private buyEquipment(id: string): void {
        const success = shopSystem.buyEquipment(id);
        if (success) {
            this.message = 'Purchase successful!';
        } else {
            this.message = 'Not enough gold!';
        }
        this.render();
    }

    private sellDish(dish: Dish): void {
        shopSystem.sellDish(dish);
        gameState.removeFromInventory(dish.id);
        this.message = `Sold for ${dish.value} gold!`;
        this.render();
    }

    private eatDish(dish: Dish): void {
        shopSystem.eatDish(dish);
        gameState.removeFromInventory(dish.id);
        this.message = `Ate ${dish.name}! Buffs applied!`;
        this.render();
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.message = '';
    }
}
