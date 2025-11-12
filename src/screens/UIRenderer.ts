/**
 * UIRenderer - Handles all UI rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Corpse } from '../entities/Corpse';
import { GameMode } from './GameModeManager';
import { Weapon } from '../entities/types';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';

export class UIRenderer {
  constructor(private renderer: CanvasRenderer) {}

  renderUI(
    player: Player,
    mode: GameMode,
    enemies: Enemy[],
    corpses: Corpse[],
    showInteractionPrompt: boolean,
    interactionPromptText: string,
    combatLog: Array<{text: string; timestamp: number; color: string}> = [],
    inventory: string[] = []
  ): void {
    const canvas = this.renderer.getCanvas();

    // Player stats
    this.renderer.drawUIRectWithBorder(10, 10, 300, 150, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);
    this.renderer.drawUIText(`HP: ${player.stats.health}/${player.stats.maxHealth}`, 20, 35, '#fff', 18);
    this.renderer.drawUIText(`Gold: ${player.gold}`, 20, 60, '#FFD700', 18);
    this.renderer.drawUIText(`ATK: ${player.getAttackDamage()} | DEF: ${player.getTotalDefense()}`, 20, 85, '#fff', 16);

    const weaponName = player.weapon?.name || 'Fists';
    const weaponType = player.isRangedWeapon() ? '🔫' : '⚔️';
    this.renderer.drawUIText(`${weaponType} ${weaponName}`, 20, 110, '#FFD700', 16);

    // Active buffs
    const activeBuffs = gameState.getState().activeBuffs;
    if (activeBuffs.length > 0) {
      let buffY = 170;
      this.renderer.drawUIRectWithBorder(10, buffY, 300, 30 + (activeBuffs.length * 25), 'rgba(138, 43, 226, 0.3)', '#BA68C8', 2);
      this.renderer.drawUIText('ACTIVE BUFFS:', 20, buffY + 20, '#FFD700', 14, 'left');

      activeBuffs.forEach((buff, i) => {
        const buffEmoji = buff.name.includes('health') ? '❤️' : buff.name.includes('attack') ? '⚔️' : '🛡️';
        const buffText = `${buffEmoji} ${buff.name} (${Math.ceil(buff.duration / 60)}s)`;
        this.renderer.drawUIText(buffText, 20, buffY + 45 + (i * 25), '#90EE90', 14);
      });
    }

    // Dash cooldown
    const dashCooldownPercent = Math.max(0, player.dashCooldown / 1.0);
    const dashColor = player.canDash() ? '#4CAF50' : '#666';
    this.renderer.drawUIText('💨 Dash:', 20, 135, dashColor, 14);

    const dashBarWidth = 80;
    this.renderer.drawUIRect(100, 123, dashBarWidth, 14, '#222');
    if (!player.canDash()) {
      const fillWidth = dashBarWidth * (1 - dashCooldownPercent);
      this.renderer.drawUIRect(100, 123, fillWidth, 14, '#4CAF50');
    } else {
      this.renderer.drawUIRect(100, 123, dashBarWidth, 14, '#4CAF50');
    }

    // Weapon cooldown
    const weaponCooldownMax = player.weapon?.attackSpeed || 0.5;
    const weaponCooldownPercent = Math.max(0, Math.min(1, player.attackCooldown / weaponCooldownMax));
    const weaponColor = player.canAttack() ? '#FFD700' : '#666';
    const weaponIcon = player.isRangedWeapon() ? '🔫' : '⚔️';
    this.renderer.drawUIText(`${weaponIcon} Weapon:`, 200, 135, weaponColor, 14);

    const weaponBarWidth = 80;
    this.renderer.drawUIRect(285, 123, weaponBarWidth, 14, '#222');
    if (!player.canAttack()) {
      const fillWidth = weaponBarWidth * (1 - weaponCooldownPercent);
      this.renderer.drawUIRect(285, 123, fillWidth, 14, '#FFD700');
    } else {
      this.renderer.drawUIRect(285, 123, weaponBarWidth, 14, '#FFD700');
    }

    // Mode indicator
    this.renderer.drawUIText(mode === 'base' ? 'BASE CAMP' : 'EXPEDITION', canvas.width / 2, 30, '#fff', 24, 'center');

    // Controls
    this.renderer.drawUIRectWithBorder(10, canvas.height - 195, 380, 185, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
    this.renderer.drawUIText('WASD/Arrows: Move', 20, canvas.height - 170, '#fff', 14);
    this.renderer.drawUIText('Shift: Dash (dodge)', 20, canvas.height - 150, '#4CAF50', 14);
    this.renderer.drawUIText('Space/Click: Attack', 20, canvas.height - 130, '#fff', 14);
    this.renderer.drawUIText('Dash + Shoot: SUPER SHOT! 💥', 20, canvas.height - 110, '#00FFFF', 14);
    this.renderer.drawUIText('  (2x DMG, 3x bullets, faster!)', 20, canvas.height - 95, '#00FFFF', 12);
    this.renderer.drawUIText('1-9: Switch weapons', 20, canvas.height - 75, '#FFD700', 14);
    this.renderer.drawUIText('E: Interact | F: Loot', 20, canvas.height - 55, '#fff', 14);
    this.renderer.drawUIText('🎯 Aim: Mouse/Movement', 20, canvas.height - 35, '#fff', 14);

    // Interaction prompt
    if (showInteractionPrompt) {
      const promptWidth = 350;
      const promptX = canvas.width / 2 - promptWidth / 2;
      const promptY = canvas.height - 180;

      this.renderer.drawUIRectWithBorder(promptX, promptY, promptWidth, 50, 'rgba(0, 0, 0, 0.9)', '#FFD700', 3);
      this.renderer.drawUIText(interactionPromptText, canvas.width / 2, promptY + 32, '#FFD700', 20, 'center');
    }

    // Enemy and corpse count in expedition
    if (mode === 'expedition') {
      const aliveEnemies = enemies.filter(e => e.alive).length;
      const lootableCorpses = corpses.filter(c => c.canLoot()).length;

      // Hunger timer
      const hungerTime = gameState.getState().expeditionState.hungerTimer;
      const hungerPercent = hungerTime / gameState.getState().expeditionState.maxHungerTime;
      const hungerColor = hungerPercent > 0.5 ? '#4CAF50' : hungerPercent > 0.25 ? '#FF8C00' : '#F44336';

      this.renderer.drawUIRectWithBorder(canvas.width - 210, 10, 200, 100, 'rgba(0, 0, 0, 0.7)', hungerColor, 2);
      this.renderer.drawUIText('🍖 HUNGER TIMER', canvas.width - 110, 30, hungerColor, 14, 'center');
      this.renderer.drawUIText(`${Math.ceil(hungerTime)}s`, canvas.width - 110, 52, hungerColor, 22, 'center');
      this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, canvas.width - 110, 75, '#F44336', 14, 'center');
      if (lootableCorpses > 0) {
        this.renderer.drawUIText(`Corpses: ${lootableCorpses}`, canvas.width - 110, 95, '#999', 12, 'center');
      }

      // Escape instruction in expedition mode
      this.renderer.drawUIRectWithBorder(canvas.width - 230, 90, 220, 60, 'rgba(139, 0, 0, 0.7)', '#FF6B6B', 2);
      this.renderer.drawUIText('ESC: Flee to Base', canvas.width - 120, 115, '#FFD700', 16, 'center');
      this.renderer.drawUIText('(No Gold Loss)', canvas.width - 120, 135, '#90EE90', 12, 'center');
    }

    // Combat log (bottom left) - ALWAYS SHOW with border even if empty
    const logX = 10;
    const logY = canvas.height - 240;
    const logEntries = combatLog.slice(0, 8);
    const logHeight = Math.max(80, logEntries.length * 22 + 40);

    this.renderer.drawUIRectWithBorder(logX, logY, 380, logHeight, 'rgba(0, 0, 0, 0.85)', '#FFD700', 2);
    this.renderer.drawUIText('Combat Log', logX + 10, logY + 22, '#FFD700', 16, 'left');

    if (logEntries.length > 0) {
      logEntries.forEach((entry, i) => {
        this.renderer.drawUIText(entry.text, logX + 10, logY + 48 + i * 22, entry.color, 14, 'left');
      });
    } else {
      this.renderer.drawUIText('No messages yet...', logX + 10, logY + 48, '#666', 12, 'left');
    }

    // Inventory (top right, below enemy count)
    if (inventory.length > 0) {
      const invStartY = mode === 'expedition' ? 170 : 90;
      const invHeight = Math.min(inventory.length * 20 + 30, 150);

      this.renderer.drawUIRectWithBorder(canvas.width - 230, invStartY, 220, invHeight, 'rgba(0, 0, 0, 0.7)', '#90EE90', 2);
      this.renderer.drawUIText('Inventory', canvas.width - 120, invStartY + 20, '#90EE90', 14, 'center');

      // Show inventory items
      inventory.slice(0, 6).forEach((itemId, i) => {
        const template = entityFactory.getTemplate(itemId);
        const itemName = template?.name || itemId;
        const displayName = itemName.length > 18 ? itemName.substring(0, 15) + '...' : itemName;
        this.renderer.drawUIText(displayName, canvas.width - 220, invStartY + 40 + i * 20, '#FFF', 12, 'left');
      });

      if (inventory.length > 6) {
        this.renderer.drawUIText(`+${inventory.length - 6} more...`, canvas.width - 220, invStartY + 40 + 6 * 20, '#AAA', 11, 'left');
      }
    }
  }
}
