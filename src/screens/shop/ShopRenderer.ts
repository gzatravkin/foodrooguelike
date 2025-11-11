/**
 * ShopRenderer - Handles all shop rendering logic
 */

import { shopSystem } from '../../systems/ShopSystem';
import type { SVGRenderer } from '../../rendering/SVGRenderer';
import type { Weapon, Equipment, Dish } from '../../entities/types';
import type { ShopState } from './ShopStateManager';

export class ShopRenderer {
    // Pagination constants
    private readonly WEAPONS_PER_PAGE = 6;
    private readonly EQUIPMENT_PER_PAGE = 5;
    private readonly DISHES_PER_PAGE = 5;

    constructor(
        private renderer: SVGRenderer,
        private getState: () => ShopState,
        private getDishes: () => Dish[],
        private onBuyWeapon: (weapon: Weapon) => void,
        private onBuyEquipment: (item: Equipment) => void,
        private onSellDish: (dish: Dish) => void,
        private onEatDish: (dish: Dish) => void
    ) {}

    render(messageText: string, messageTimer: number): void {
        this.renderer.clear();
        const vb = this.renderer.getViewBox();

        this.renderHeader(vb.width);

        const colWidth = (vb.width - 80) / 3;
        this.renderWeaponsSection(40, 120, colWidth);
        this.renderEquipmentSection(40 + colWidth + 20, 120, colWidth);
        this.renderDishesSection(40 + (colWidth + 20) * 2, 120, colWidth);

        if (messageText && messageTimer > 0) {
            this.renderMessage(vb.width, vb.height, messageText);
        }

        this.renderFooter(vb.width, vb.height);
    }

    private renderHeader(width: number): void {
        const title = this.renderer.createText(width / 2, 40, 'SHOP', 36, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        const gold = this.renderer.createText(width / 2, 80, `Gold: ${this.getState().gold}`, 24, '#FFD700');
        gold.id = 'shop-gold';
        gold.setAttribute('text-anchor', 'middle');
        this.renderer.append(gold);
    }

    private renderWeaponsSection(x: number, y: number, width: number): void {
        const weapons = shopSystem.getWeaponInventory();
        const state = this.getState();

        const title = this.renderer.createText(x + width / 2, y, 'Weapons', 22, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        const startIdx = state.weaponPage * this.WEAPONS_PER_PAGE;
        const endIdx = Math.min(startIdx + this.WEAPONS_PER_PAGE, weapons.length);
        const displayWeapons = weapons.slice(startIdx, endIdx);

        displayWeapons.forEach((weapon, i) => {
            this.renderWeaponItem(weapon, x, y + 40 + i * 80, width);
        });

        if (weapons.length > this.WEAPONS_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.WEAPONS_PER_PAGE * 80,
                width,
                state.weaponPage,
                Math.ceil(weapons.length / this.WEAPONS_PER_PAGE),
                (page) => {
                    state.weaponPage = page;
                    this.render('', 0);
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

        const btn = this.renderer.createButton(
            x,
            y,
            width - 10,
            35,
            `${icon} ${weapon.name}`,
            () => this.onBuyWeapon(weapon)
        );
        btn.style.borderColor = color;
        btn.style.borderWidth = '2px';
        this.renderer.append(btn);

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
        const state = this.getState();

        const title = this.renderer.createText(x + width / 2, y, 'Equipment', 22, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        const startIdx = state.equipmentPage * this.EQUIPMENT_PER_PAGE;
        const endIdx = Math.min(startIdx + this.EQUIPMENT_PER_PAGE, equipment.length);
        const displayEquipment = equipment.slice(startIdx, endIdx);

        displayEquipment.forEach((item, i) => {
            this.renderEquipmentItem(item, x, y + 40 + i * 60, width);
        });

        if (equipment.length > this.EQUIPMENT_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.EQUIPMENT_PER_PAGE * 60,
                width,
                state.equipmentPage,
                Math.ceil(equipment.length / this.EQUIPMENT_PER_PAGE),
                (page) => {
                    state.equipmentPage = page;
                    this.render('', 0);
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
            () => this.onBuyEquipment(item)
        );
        this.renderer.append(btn);

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
        const state = this.getState();

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

        const startIdx = state.dishPage * this.DISHES_PER_PAGE;
        const endIdx = Math.min(startIdx + this.DISHES_PER_PAGE, dishes.length);
        const displayDishes = dishes.slice(startIdx, endIdx);

        displayDishes.forEach((dish, i) => {
            this.renderDishItem(dish, x, y + 40 + i * 70, width);
        });

        if (dishes.length > this.DISHES_PER_PAGE) {
            this.renderPaginationControls(
                x,
                y + 40 + this.DISHES_PER_PAGE * 70,
                width,
                state.dishPage,
                Math.ceil(dishes.length / this.DISHES_PER_PAGE),
                (page) => {
                    state.dishPage = page;
                    this.render('', 0);
                }
            );
        }
    }

    private renderDishItem(dish: Dish, x: number, y: number, width: number): void {
        const name = this.renderer.createText(
            x + width / 2,
            y + 10,
            `${dish.name} (${dish.value}g)`,
            14,
            '#FFD700'
        );
        name.setAttribute('text-anchor', 'middle');
        this.renderer.append(name);

        const sellBtn = this.renderer.createButton(
            x + 5,
            y + 20,
            (width - 20) / 2,
            30,
            'SELL',
            () => this.onSellDish(dish)
        );
        sellBtn.style.background = '#4CAF50';
        this.renderer.append(sellBtn);

        const eatBtn = this.renderer.createButton(
            x + width / 2 + 5,
            y + 20,
            (width - 20) / 2,
            30,
            'EAT',
            () => this.onEatDish(dish)
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

        const pageText = this.renderer.createText(
            x + width / 2,
            y + 20,
            `${currentPage + 1} / ${totalPages}`,
            12,
            '#aaa'
        );
        pageText.setAttribute('text-anchor', 'middle');
        this.renderer.append(pageText);

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

    private renderMessage(width: number, height: number, messageText: string): void {
        const msg = this.renderer.createText(
            width / 2,
            height - 100,
            messageText,
            18,
            '#90EE90'
        );
        msg.setAttribute('text-anchor', 'middle');
        msg.id = 'shop-message';
        this.renderer.append(msg);
    }

    private renderFooter(width: number, height: number): void {
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
}
