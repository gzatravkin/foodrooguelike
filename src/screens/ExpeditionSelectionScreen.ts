/**
 * ExpeditionSelectionScreen - Select expedition location and food buffs before departing
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import expeditionsData from '../data/expeditions.json';
import type { ExpeditionLocation } from './expedition/expeditionTypes';
import { getExpeditionCost, canAffordAnyExpedition } from './expedition/expeditionUtils';
import { ExpeditionListRenderer } from './expedition/ExpeditionListRenderer';
import { ExpeditionDetailsRenderer } from './expedition/ExpeditionDetailsRenderer';
import { FoodBuffManager } from './expedition/FoodBuffManager';
import { GameOverRenderer } from './expedition/GameOverRenderer';

export class ExpeditionSelectionScreen extends Screen {
    private expeditions: Record<string, ExpeditionLocation> = expeditionsData;
    private selectedExpedition: string | null = null;
    private selectedLevel: number = 1;
    private foodBuffManager: FoodBuffManager;

    constructor(renderer: SVGRenderer) {
        super(renderer);
        this.foodBuffManager = new FoodBuffManager();
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();
        const state = gameState.getState();

        // Add semi-transparent background to catch all clicks and prevent interaction with elements below
        const background = this.renderer.createRect(0, 0, vb.width, vb.height, 'rgba(0, 0, 0, 0.85)');
        this.renderer.append(background);

        // Check if coming from world map with preselected expedition
        this.handlePreselectedExpedition();

        // Render header
        this.renderHeader(vb.width / 2, state.gold);

        // Check for game over
        if (!canAffordAnyExpedition(this.expeditions, state.gold) && state.gold < 10) {
            const gameOverRenderer = new GameOverRenderer(this.renderer);
            gameOverRenderer.render(vb.width / 2, vb.height / 2);
            return;
        }

        // Render expedition locations (left side)
        const listRenderer = new ExpeditionListRenderer(this.renderer, this.expeditions, state.gold);
        listRenderer.render(50, 120, this.selectedExpedition, (expeditionId) => {
            // Only reset level when switching to a DIFFERENT expedition
            if (expeditionId !== this.selectedExpedition) {
                this.selectedExpedition = expeditionId;
                // Reset selected level to current progress when changing expedition
                if (expeditionId) {
                    const progress = gameState.getExpeditionProgress(expeditionId);
                    this.selectedLevel = progress.currentLevel;
                }
            }
            this.render();
        });

        // Render selected expedition details and food selection (right side)
        if (this.selectedExpedition) {
            const expedition = this.expeditions[this.selectedExpedition];
            const progress = gameState.getExpeditionProgress(this.selectedExpedition);
            const detailsRenderer = new ExpeditionDetailsRenderer(
                this.renderer,
                expedition,
                state.gold,
                state.dishes
            );
            detailsRenderer.render(
                vb.width / 2 + 50,
                120,
                this.foodBuffManager.getSelectedFoodBuff(),
                () => this.handleFoodSelection(state.dishes),
                () => this.startExpedition(),
                this.selectedLevel,
                progress,
                (newLevel) => {
                    this.selectedLevel = newLevel;
                    this.render();
                }
            );
        } else {
            this.renderSelectionHint(vb.width / 2 + 250, vb.height / 2);
        }

        // Back button
        this.renderBackButton(50, vb.height - 100);
    }

    private handlePreselectedExpedition(): void {
        const preselected = localStorage.getItem('preselectedExpedition');
        if (preselected && !this.selectedExpedition) {
            const expedition = JSON.parse(preselected);
            this.selectedExpedition = expedition.id;
            localStorage.removeItem('preselectedExpedition');
        }
    }

    private renderHeader(cx: number, gold: number): void {
        // Title
        const title = this.renderer.createText(cx, 50, '⚔️ EXPEDITION CENTER ⚔️', 32, '#FFD700');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        // Gold display
        const goldText = this.renderer.createText(cx, 85, `Gold: ${gold}`, 18, '#FFD700');
        goldText.setAttribute('text-anchor', 'middle');
        this.renderer.append(goldText);
    }

    private renderSelectionHint(cx: number, cy: number): void {
        const hint = this.renderer.createText(
            cx,
            cy,
            'Select an expedition to begin',
            20,
            '#888'
        );
        hint.setAttribute('text-anchor', 'middle');
        this.renderer.append(hint);
    }

    private renderBackButton(x: number, y: number): void {
        const backBtn = this.renderer.createButton(
            x,
            y,
            180,
            60,
            'BACK',
            () => {
                this.cleanup();
                gameState.setScreen('worldmap');
            }
        );
        this.renderer.append(backBtn);
    }

    private handleFoodSelection(dishes: string[]): void {
        this.foodBuffManager.selectNextDish(dishes);
        this.render();
    }

    private startExpedition(): void {
        if (!this.selectedExpedition) return;

        const expedition = this.expeditions[this.selectedExpedition];
        const cost = getExpeditionCost(expedition);
        const state = gameState.getState();

        if (state.gold < cost) return;

        // Spend gold
        if (!gameState.spendGold(cost)) return;

        // Apply food buff if selected
        this.foodBuffManager.applySelectedBuff();

        // Reset hunger timer
        gameState.resetHungerTimer();

        // Set current expedition and level in game state
        gameState.setCurrentExpedition(this.selectedExpedition, this.selectedLevel);

        // Store selected expedition with level in a way GameScreen can access it
        const expeditionWithLevel = { ...expedition, level: this.selectedLevel };
        localStorage.setItem('selectedExpedition', JSON.stringify(expeditionWithLevel));

        // Navigate to game screen (expedition mode)
        gameState.setScreen('game');

        this.cleanup();
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.selectedExpedition = null;
        this.selectedLevel = 1;
        this.foodBuffManager.reset();
    }
}
