/**
 * ExpeditionScreen - Where players fight monsters for ingredients
 */

import { Screen } from '../rendering/Screen';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { combatSystem } from '../systems/CombatSystem';
import type { SVGRenderer } from '../rendering/SVGRenderer';
import type { Enemy } from '../entities/types';

export class ExpeditionScreen extends Screen {
    private currentEnemy: Enemy | null = null;
    private combatLog: string[] = [];

    constructor(renderer: SVGRenderer) {
        super(renderer);
    }

    render(): void {
        this.renderer.clear();

        const vb = this.renderer.getViewBox();

        // Title
        const title = this.renderer.createText(vb.width / 2, 60, 'EXPEDITION', 36, '#FF6B6B');
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-weight', 'bold');
        this.renderer.append(title);

        if (!this.currentEnemy) {
            this.renderEnemySelection(vb.width / 2, 200);
        } else {
            this.renderCombat(vb.width / 2, 200);
        }

        // Back button
        const backBtn = this.renderer.createButton(50, vb.height - 100, 150, 50, 'BACK TO BASE', () => {
            gameState.setScreen('base');
        });
        this.renderer.append(backBtn);
    }

    private renderEnemySelection(cx: number, y: number): void {
        const enemies = entityFactory.getAllOfType('enemy');

        const text = this.renderer.createText(cx, y - 20, 'Choose an enemy to fight:', 24);
        text.setAttribute('text-anchor', 'middle');
        this.renderer.append(text);

        enemies.forEach((enemy, i) => {
            const e = enemy as Enemy;
            const btn = this.renderer.createButton(
                cx - 150,
                y + 60 + i * 80,
                300,
                60,
                `${e.name} (HP: ${e.health})`,
                () => this.startCombat(e)
            );
            this.renderer.append(btn);
        });
    }

    private renderCombat(cx: number, y: number): void {
        if (!this.currentEnemy) return;

        // Enemy display
        const enemyGroup = this.renderer.createGroup();
        const enemyCircle = this.renderer.createCircle(cx, y + 100, 50, '#FF4444');
        const enemyText = this.renderer.createText(cx, y + 180, this.currentEnemy.name, 20);
        enemyText.setAttribute('text-anchor', 'middle');

        enemyGroup.appendChild(enemyCircle);
        enemyGroup.appendChild(enemyText);
        this.renderer.append(enemyGroup);

        // Attack button
        const attackBtn = this.renderer.createButton(cx - 100, y + 250, 200, 60, 'ATTACK', () => {
            this.performAttack();
        });
        this.renderer.append(attackBtn);

        // Combat log
        this.renderCombatLog(50, 450);
    }

    private renderCombatLog(x: number, y: number): void {
        this.combatLog.slice(-5).forEach((log, i) => {
            const text = this.renderer.createText(x, y + i * 25, log, 16, '#aaa');
            this.renderer.append(text);
        });
    }

    private startCombat(enemy: Enemy): void {
        this.currentEnemy = { ...enemy };
        this.combatLog = [`Encountered ${enemy.name}!`];
        this.render();
    }

    private performAttack(): void {
        if (!this.currentEnemy) return;

        const result = combatSystem.fight(this.currentEnemy);

        if (result.victory) {
            this.combatLog.push(`Victory! Gained ${result.rewards?.gold} gold`);
            result.rewards?.loot.forEach(item => {
                this.combatLog.push(`Found: ${item}`);
            });
            this.currentEnemy = null;
        } else {
            this.combatLog.push('Defeated! Return to base to recover.');
            this.currentEnemy = null;
        }

        this.render();
    }

    handleInput(event: MouseEvent | TouchEvent): void {
        // Handled by buttons
    }

    cleanup(): void {
        this.currentEnemy = null;
        this.combatLog = [];
    }
}
