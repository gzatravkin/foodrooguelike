/**
 * ShopScreen - Clean, new shop implementation
 * Buy weapons, equipment, and manage dishes
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { shopSystem } from '../systems/ShopSystem';
import { entityFactory } from '../entities/EntityFactory';
import { eventBus } from '../core/EventBus';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import type { Dish, Weapon, Equipment } from '../entities/types';

interface ShopState {
    gold: number;
    inventory: string[];
    weaponPage: number;
    equipmentPage: number;
    dishPage: number;
}

export class ShopScreen extends Screen {
    private state: ShopState;
    private messageText: string = '';
    private messageTimer: number = 0;
    private keyListener: ((e: KeyboardEvent) => void) | null = null;

    // Pagination constants
    private readonly WEAPONS_PER_PAGE = 6;
    private readonly EQUIPMENT_PER_PAGE = 5;
    private readonly DISHES_PER_PAGE = 5;

    constructor(renderer: SVGRenderer) {
        super(renderer);

        const gameData = gameState.getState();
        this.state = {
            gold: gameData.gold,
            inventory: [...gameData.inventory],
            weaponPage: 0,
            equipmentPage: 0,
            dishPage: 0
        };

        this.setupEventListeners();
        this.setupKeyboardControls();
    }

    private setupEventListeners(): void {
        eventBus.on('gold:changed', (gold: number) => {
            this.state.gold = gold;
            this.updateGoldDisplay();
        });

        eventBus.on('inventory:changed', () => {
            this.state.inventory = [...gameState.getState().inventory];
            this.render();
        });
    }

    private setupKeyboardControls(): void {
        this.keyListener = (e: KeyboardEvent) => {
            // Don't handle if not visible
            if (gameState.getState().currentScreen !== 'shop') return;

            // Close shop with Escape - return to gameplay
            if (e.key === 'Escape') {
                e.preventDefault();
                // Close the shop UI by returning to game
                const currentState = gameState.getState();
                if (currentState.currentScreen === 'shop') {
                    // Hide the UI overlay by setting to game screen
                    (gameState as any).state.currentScreen = 'game';
                    eventBus.emit('screen:changed', 'game');
                }
                return;
            }
        };

        window.addEventListener('keydown', this.keyListener);
    }

    render(): void {
        // Re-setup keyboard controls if they were cleaned up
        if (!this.keyListener) {
            this.setupKeyboardControls();
        }

        this.renderer.clear();
        const vb = this.renderer.getViewBox();

        // Header
        this.renderHeader(vb.width);

        // Three columns: Weapons | Equipment | Dishes
        const colWidth = (vb.width - 80) / 3;
        this.renderWeaponsSection(40, 120, colWidth);
        this.renderEquipmentSection(40 + colWidth + 20, 120, colWidth);
        this.renderDishesSection(40 + (colWidth + 20) * 2, 120, colWidth);

        // Message area
        if (this.messageText && this.messageTimer > 0) {
            this.renderMessage(vb.width, vb.height);
        }

        // Footer with back button
        this.renderFooter(vb.width, vb.height);
    }

    private renderHeader(width: number): void {
        // Title
        const title = this.renderer.createText(width / 2, 40, 'SHOP', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const gold = this.renderer.createText(width / 2, 80, `Gold: ${this.state.gold}`, 24, '#FFD700');
        gold.id = 'shop-gold';
        gold.setAttribute('text-anchor', 'middle');
        this.renderer.append(gold);
    }

    private renderWeaponsSection(x: number, y: number, width: number): void {
        const weapons = shopSystem.getWeaponInventory();

        // Section title
        const title = this.renderer.createText(x + width / 2, y, 'Weapons', 22, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Calculate pagination
        const startIdx = this.state.weaponPage * this.WEAPONS_PER_PAGE;
        const endIdx = Math.min(startIdx + this.WEAPONS_PER_PAGE, weapons.length);
        const displayWeapons = weapons.slice(startIdx, endIdx);

        // Render weapons
        displayWeapons.forEach((weapon, i) => {
            this.renderWeaponItem(weapon, x, y + 40 + i * 80, width);
        });

        // Pagination controls
        if (weapons.length > this.WEAPONS_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.WEAPONS_PER_PAGE * 80,
                width,
                this.state.weaponPage,
                Math.ceil(weapons.length / this.WEAPONS_PER_PAGE),
                (page) => {
                    this.state.weaponPage = page;
                    this.render();
                }
            );
        }
    }

    private renderWeaponItem(weapon: Weapon, x: number, y: number, width: number): void {
        const rarityColors: Record<string, string> = {
            legendary: '#FF6B00',
            rare: '#9C27B0',
            uncommon: '#2196F3',
            common: '#888'
        };

        const color = rarityColors[weapon.rarity] || '#888';
        const icon = weapon.weaponType === 'ranged' ? '🔫' : '⚔️';

        // Weapon button
        const btn = this.renderer.createButton(
            x,
            y,
            width - 10,
            35,
            `${icon} ${weapon.name}`,
            () => this.buyWeapon(weapon)
        );
        btn.style.borderColor = color;
        btn.style.borderWidth = '2px';
        this.renderer.append(btn);

        // Stats and price
        const stats = this.renderer.createText(
            x + 5,
            y + 50,
            `DMG: ${weapon.damage} | SPD: ${weapon.attackSpeed.toFixed(1)}s | ${weapon.cost}g`,
            11,
            '#aaa'
        );
        this.renderer.append(stats);
    }

    private renderEquipmentSection(x: number, y: number, width: number): void {
        const equipment = shopSystem.getShopInventory();

        // Section title
        const title = this.renderer.createText(x + width / 2, y, 'Equipment', 22, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Calculate pagination
        const startIdx = this.state.equipmentPage * this.EQUIPMENT_PER_PAGE;
        const endIdx = Math.min(startIdx + this.EQUIPMENT_PER_PAGE, equipment.length);
        const displayEquipment = equipment.slice(startIdx, endIdx);

        // Render equipment
        displayEquipment.forEach((item, i) => {
            this.renderEquipmentItem(item, x, y + 40 + i * 60, width);
        });

        // Pagination controls
        if (equipment.length > this.EQUIPMENT_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.EQUIPMENT_PER_PAGE * 60,
                width,
                this.state.equipmentPage,
                Math.ceil(equipment.length / this.EQUIPMENT_PER_PAGE),
                (page) => {
                    this.state.equipmentPage = page;
                    this.render();
                }
            );
        }
    }

    private renderEquipmentItem(item: Equipment, x: number, y: number, width: number): void {
        const btn = this.renderer.createButton(
            x,
            y,
            width - 10,
            35,
            `${item.name} - ${item.cost}g`,
            () => this.buyEquipment(item)
        );
        this.renderer.append(btn);

        // Description
        if (item.description) {
            const desc = this.renderer.createText(
                x + 5,
                y + 50,
                item.description.substring(0, 30),
                10,
                '#aaa'
            );
            this.renderer.append(desc);
        }
    }

    private renderDishesSection(x: number, y: number, width: number): void {
        const dishes = this.getDishes();

        // Section title
        const title = this.renderer.createText(x + width / 2, y, 'Your Dishes', 22, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (dishes.length === 0) {
            const noDishes = this.renderer.createText(
                x + width / 2,
                y + 60,
                'No dishes to sell',
                14,
                '#888'
            );
            noDishes.setAttribute('text-anchor', 'middle');
            this.renderer.append(noDishes);
            return;
        }

        // Calculate pagination
        const startIdx = this.state.dishPage * this.DISHES_PER_PAGE;
        const endIdx = Math.min(startIdx + this.DISHES_PER_PAGE, dishes.length);
        const displayDishes = dishes.slice(startIdx, endIdx);

        // Render dishes
        displayDishes.forEach((dish, i) => {
            this.renderDishItem(dish, x, y + 40 + i * 70, width);
        });

        // Pagination controls
        if (dishes.length > this.DISHES_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.DISHES_PER_PAGE * 70,
                width,
                this.state.dishPage,
                Math.ceil(dishes.length / this.DISHES_PER_PAGE),
                (page) => {
                    this.state.dishPage = page;
                    this.render();
                }
            );
        }
    }

    private renderDishItem(dish: Dish, x: number, y: number, width: number): void {
        // Dish name and value
        const name = this.renderer.createText(
            x + width / 2,
            y + 10,
            `${dish.name} (${dish.value}g)`,
            14,
            '#FFD700'
        );
        name.setAttribute('text-anchor', 'middle');
        this.renderer.append(name);

        // Sell button
        const sellBtn = this.renderer.createButton(
            x + 5,
            y + 20,
            (width - 20) / 2,
            30,
            'SELL',
            () => this.sellDish(dish)
        );
        sellBtn.style.background = '#4CAF50';
        this.renderer.append(sellBtn);

        // Eat button
        const eatBtn = this.renderer.createButton(
            x + width / 2 + 5,
            y + 20,
            (width - 20) / 2,
            30,
            'EAT',
            () => this.eatDish(dish)
        );
        eatBtn.style.background = '#2196F3';
        this.renderer.append(eatBtn);
    }

    private renderPaginationControls(
        x: number,
        y: number,
        width: number,
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    ): void {
        const btnWidth = 60;
        const spacing = 10;

        // Previous button
        if (currentPage > 0) {
            const prevBtn = this.renderer.createButton(
                x,
                y,
                btnWidth,
                30,
                '< Prev',
                () => onPageChange(currentPage - 1)
            );
            this.renderer.append(prevBtn);
        }

        // Page indicator
        const pageText = this.renderer.createText(
            x + width / 2,
            y + 20,
            `${currentPage + 1} / ${totalPages}`,
            12,
            '#aaa'
        );
        pageText.setAttribute('text-anchor', 'middle');
        this.renderer.append(pageText);

        // Next button
        if (currentPage < totalPages - 1) {
            const nextBtn = this.renderer.createButton(
                x + width - btnWidth,
                y,
                btnWidth,
                30,
                'Next >',
                () => onPageChange(currentPage + 1)
            );
            this.renderer.append(nextBtn);
        }
    }

    private renderMessage(width: number, height: number): void {
        const msg = this.renderer.createText(
            width / 2,
            height - 100,
            this.messageText,
            18,
            '#90EE90'
        );
        msg.setAttribute('text-anchor', 'middle');
        msg.id = 'shop-message';
        this.renderer.append(msg);
    }

    private renderFooter(width: number, height: number): void {
        // Show ESC instruction instead of BACK button
        const escText = this.renderer.createText(
            width / 2,
            height - 40,
            'Press ESC to close shop',
            18,
            '#AAA'
        );
        escText.setAttribute('text-anchor', 'middle');
        this.renderer.append(escText);
    }

    private updateGoldDisplay(): void {
        const goldElement = document.getElementById('shop-gold');
        if (goldElement && goldElement instanceof SVGTextElement) {
            goldElement.textContent = `Gold: ${this.state.gold}`;
        }
    }

    private getDishes(): Dish[] {
        return this.state.inventory
            .map(id => entityFactory.getTemplate(id))
            .filter(item => item?.type === 'dish') as Dish[];
    }

    private showMessage(msg: string): void {
        this.messageText = msg;
        this.messageTimer = 3000;
        this.render();
    }

    private buyWeapon(weapon: Weapon): void {
        if (this.state.gold < weapon.cost) {
            this.showMessage('Not enough gold!');
            return;
        }

        const success = shopSystem.buyWeapon(weapon.id);
        if (success) {
            this.showMessage(`Purchased ${weapon.name}! Equipped automatically.`);
        } else {
            this.showMessage('Purchase failed!');
        }
    }

    private buyEquipment(item: Equipment): void {
        if (this.state.gold < item.cost) {
            this.showMessage('Not enough gold!');
            return;
        }

        const success = shopSystem.buyEquipment(item.id);
        if (success) {
            this.showMessage(`Purchased ${item.name}!`);
        } else {
            this.showMessage('Purchase failed!');
        }
    }

    private sellDish(dish: Dish): void {
        shopSystem.sellDish(dish);
        gameState.removeFromInventory(dish.id);
        this.showMessage(`Sold ${dish.name} for ${dish.value}g!`);
    }

    private eatDish(dish: Dish): void {
        shopSystem.eatDish(dish);
        gameState.removeFromInventory(dish.id);

        let msg = `Ate ${dish.name}!`;
        if (dish.effects?.health) {
            msg += ` +${dish.effects.health} HP`;
        }
        if (dish.effects?.attack || dish.effects?.defense) {
            msg += ' Buffs applied!';
        }

        this.showMessage(msg);
    }

    update(deltaTime: number): void {
        if (this.messageTimer > 0) {
            this.messageTimer -= deltaTime * 1000;
            if (this.messageTimer <= 0) {
                this.messageText = '';
                // Update message display
                const msgElement = document.getElementById('shop-message');
                if (msgElement) {
                    msgElement.remove();
                }
            }
        }
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by button callbacks
    }

    cleanup(): void {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
            this.keyListener = null;
        }
        this.messageText = '';
        this.messageTimer = 0;
        this.state.weaponPage = 0;
        this.state.equipmentPage = 0;
        this.state.dishPage = 0;
    }
}
