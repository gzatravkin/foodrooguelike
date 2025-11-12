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

        // Dark background overlay
        const bgOverlay = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(10, 15, 30, 0.95)');
        this.renderer.append(bgOverlay);

        this.renderHeader(vb.width);

        const colWidth = (vb.width - 120) / 3;
        const colSpacing = 30;
        this.renderWeaponsSection(60, 150, colWidth);
        this.renderEquipmentSection(60 + colWidth + colSpacing, 150, colWidth);
        this.renderDishesSection(60 + (colWidth + colSpacing) * 2, 150, colWidth);

        if (messageText && messageTimer > 0) {
            this.renderMessage(vb.width, vb.height, messageText);
        }

        this.renderFooter(vb.width, vb.height);
    }

    private renderHeader(width: number): void {
        // Title with shadow effect
        const titleShadow = this.renderer.createText(width / 2 + 2, 47, '🏪 SHOP', 38, 'rgba(255, 215, 0, 0.3)');
        titleShadow.setAttribute('text-anchor', 'middle');
        titleShadow.setAttribute('font-weight', 'bold');
        this.renderer.append(titleShadow);

        const title = this.renderer.createText(width / 2, 45, '🏪 SHOP', 38, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display with background
        const goldPanelBg = this.renderer.createRect(width / 2 - 120, 65, 240, 40, 'rgba(30, 30, 40, 0.9)');
        goldPanelBg.setAttribute('rx', '8');
        goldPanelBg.setAttribute('stroke', '#FFD700');
        goldPanelBg.setAttribute('stroke-width', '2');
        this.renderer.append(goldPanelBg);

        const gold = this.renderer.createText(width / 2, 90, `💰 ${this.getState().gold} Gold`, 22, '#FFD700');
        gold.id = 'shop-gold';
        gold.setAttribute('text-anchor', 'middle');
        gold.setAttribute('font-weight', 'bold');
        this.renderer.append(gold);
    }

    private renderWeaponsSection(x: number, y: number, width: number): void {
        const weapons = shopSystem.getWeaponInventory();
        const state = this.getState();

        // Section header with background
        const headerBg = this.renderer.createRect(x, y - 20, width, 40, 'rgba(255, 69, 0, 0.2)');
        headerBg.setAttribute('rx', '10');
        headerBg.setAttribute('stroke', '#FF6B35');
        headerBg.setAttribute('stroke-width', '2');
        this.renderer.append(headerBg);

        const title = this.renderer.createText(x + width / 2, y + 5, '⚔️ WEAPONS', 22, '#FF6B35');
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
            legendary: '#FF9800',
            rare: '#9C27B0',
            uncommon: '#2196F3',
            common: '#78909C'
        };

        const color = rarityColors[weapon.rarity] || '#888';
        const icon = weapon.weaponType === 'ranged' ? '🔫' : '⚔️';

        // Item background card
        const cardBg = this.renderer.createRect(x, y, width - 10, 70, 'rgba(30, 35, 45, 0.9)');
        cardBg.setAttribute('rx', '8');
        cardBg.setAttribute('stroke', color);
        cardBg.setAttribute('stroke-width', '2');
        this.renderer.append(cardBg);

        const btn = this.renderer.createButton(
            x + 5,
            y + 5,
            width - 20,
            30,
            `${icon} ${weapon.name}`,
            () => this.onBuyWeapon(weapon)
        );
        btn.style.borderColor = color;
        btn.style.borderWidth = '2px';
        btn.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
        this.renderer.append(btn);

        const stats = this.renderer.createText(
            x + 10,
            y + 52,
            `⚡ ${weapon.damage} DMG | ⏱️ ${weapon.attackSpeed.toFixed(1)}s`,
            11,
            '#B0BEC5'
        );
        this.renderer.append(stats);

        const cost = this.renderer.createText(
            x + 10,
            y + 65,
            `💰 ${weapon.cost}g`,
            11,
            '#FFD700'
        );
        cost.setAttribute('font-weight', 'bold');
        this.renderer.append(cost);
    }

    private renderEquipmentSection(x: number, y: number, width: number): void {
        const equipment = shopSystem.getShopInventory();
        const state = this.getState();

        // Section header with background
        const headerBg = this.renderer.createRect(x, y - 20, width, 40, 'rgba(33, 150, 243, 0.2)');
        headerBg.setAttribute('rx', '10');
        headerBg.setAttribute('stroke', '#2196F3');
        headerBg.setAttribute('stroke-width', '2');
        this.renderer.append(headerBg);

        const title = this.renderer.createText(x + width / 2, y + 5, '🛡️ EQUIPMENT', 22, '#4FC3F7');
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

        // Section header with background
        const headerBg = this.renderer.createRect(x, y - 20, width, 40, 'rgba(76, 175, 80, 0.2)');
        headerBg.setAttribute('rx', '10');
        headerBg.setAttribute('stroke', '#4CAF50');
        headerBg.setAttribute('stroke-width', '2');
        this.renderer.append(headerBg);

        const title = this.renderer.createText(x + width / 2, y + 5, '🍽️ YOUR DISHES', 22, '#8BC34A');
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
        // Footer with background
        const footerBg = this.renderer.createRect(width / 2 - 150, height - 60, 300, 35, 'rgba(30, 30, 40, 0.8)');
        footerBg.setAttribute('rx', '8');
        this.renderer.append(footerBg);

        const escText = this.renderer.createText(
            width / 2,
            height - 37,
            '⌨️ Press ESC to close shop',
            18,
            '#B0BEC5'
        );
        escText.setAttribute('text-anchor', 'middle');
        this.renderer.append(escText);
    }
}
