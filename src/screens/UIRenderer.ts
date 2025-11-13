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
    inventory: string[] = [],
    isMobile: boolean = false
  ): void {
    const canvas = this.renderer.getCanvas();
    const isTinyScreen = canvas.width < 400 || canvas.height < 600;

    // Player stats - more compact on mobile
    if (isMobile) {
      // Mobile: extra compact stats panel
      this.renderer.drawUIRectWithBorder(8, 8, 160, 80, 'rgba(0, 0, 0, 0.6)', '#4CAF50', 1.5);
      this.renderer.drawUIText(`❤️ ${player.stats.health}/${player.stats.maxHealth}`, 16, 22, '#fff', 11);
      this.renderer.drawUIText(`💰 ${player.gold}`, 16, 38, '#FFD700', 11);
      this.renderer.drawUIText(`⚔️${player.getAttackDamage()} 🛡️${player.getTotalDefense()}`, 16, 54, '#fff', 10);

      const weaponName = player.weapon?.name || 'Fists';
      const weaponType = player.isRangedWeapon() ? '🔫' : '⚔️';
      const shortWeaponName = weaponName.length > 10 ? weaponName.substring(0, 8) + '..' : weaponName;
      this.renderer.drawUIText(`${weaponType} ${shortWeaponName}`, 16, 70, '#FFD700', 10);
    } else {
      // Desktop: full stats panel
      this.renderer.drawUIRectWithBorder(10, 10, 300, 150, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);
      this.renderer.drawUIText(`HP: ${player.stats.health}/${player.stats.maxHealth}`, 20, 35, '#fff', 18);
      this.renderer.drawUIText(`Gold: ${player.gold}`, 20, 60, '#FFD700', 18);
      this.renderer.drawUIText(`ATK: ${player.getAttackDamage()} | DEF: ${player.getTotalDefense()}`, 20, 85, '#fff', 16);

      const weaponName = player.weapon?.name || 'Fists';
      const weaponType = player.isRangedWeapon() ? '🔫' : '⚔️';
      this.renderer.drawUIText(`${weaponType} ${weaponName}`, 20, 110, '#FFD700', 16);
    }

    // Active buffs
    const activeBuffs = gameState.getState().activeBuffs;
    if (activeBuffs.length > 0) {
      if (isMobile) {
        // Mobile: extra compact buffs below stats panel
        let buffY = 96;
        const buffWidth = 160;
        this.renderer.drawUIRectWithBorder(8, buffY, buffWidth, 20 + (activeBuffs.length * 16), 'rgba(138, 43, 226, 0.25)', '#BA68C8', 1.5);
        this.renderer.drawUIText('Buffs:', 16, buffY + 13, '#FFD700', 10, 'left');

        activeBuffs.forEach((buff, i) => {
          const buffEmoji = buff.name.includes('health') ? '❤️' : buff.name.includes('attack') ? '⚔️' : '🛡️';
          const buffName = buff.name.length > 10 ? buff.name.substring(0, 8) + '..' : buff.name;
          const buffText = `${buffEmoji} ${buffName} ${Math.ceil(buff.duration / 60)}s`;
          this.renderer.drawUIText(buffText, 16, buffY + 28 + (i * 16), '#90EE90', 9);
        });
      } else {
        // Desktop: full buffs display
        let buffY = 170;
        this.renderer.drawUIRectWithBorder(10, buffY, 300, 30 + (activeBuffs.length * 25), 'rgba(138, 43, 226, 0.3)', '#BA68C8', 2);
        this.renderer.drawUIText('ACTIVE BUFFS:', 20, buffY + 20, '#FFD700', 14, 'left');

        activeBuffs.forEach((buff, i) => {
          const buffEmoji = buff.name.includes('health') ? '❤️' : buff.name.includes('attack') ? '⚔️' : '🛡️';
          const buffText = `${buffEmoji} ${buff.name} (${Math.ceil(buff.duration / 60)}s)`;
          this.renderer.drawUIText(buffText, 20, buffY + 45 + (i * 25), '#90EE90', 14);
        });
      }
    }

    // Cooldown indicators - simplified on mobile (shown as visual cues on buttons)
    if (!isMobile) {
      // Desktop only: show cooldown bars
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
    }

    // Mode indicator - smaller on mobile
    const modeText = mode === 'base' ? 'BASE CAMP' : 'EXPEDITION';
    const modeFontSize = isMobile ? 16 : 24;
    const modeY = isMobile ? 20 : 30;
    this.renderer.drawUIText(modeText, canvas.width / 2, modeY, '#fff', modeFontSize, 'center');

    // Controls - ONLY show on desktop, hide on mobile (they see visual controls)
    if (!isMobile) {
      this.renderer.drawUIRectWithBorder(10, canvas.height - 195, 380, 185, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
      this.renderer.drawUIText('WASD/Arrows: Move', 20, canvas.height - 170, '#fff', 14);
      this.renderer.drawUIText('Shift: Dash (dodge)', 20, canvas.height - 150, '#4CAF50', 14);
      this.renderer.drawUIText('Space/Click: Attack', 20, canvas.height - 130, '#fff', 14);
      this.renderer.drawUIText('Dash + Shoot: SUPER SHOT! 💥', 20, canvas.height - 110, '#00FFFF', 14);
      this.renderer.drawUIText('  (2x DMG, 3x bullets, faster!)', 20, canvas.height - 95, '#00FFFF', 12);
      this.renderer.drawUIText('1-9: Switch weapons', 20, canvas.height - 75, '#FFD700', 14);
      this.renderer.drawUIText('E: Interact | F: Loot', 20, canvas.height - 55, '#fff', 14);
      this.renderer.drawUIText('🎯 Aim: Mouse/Movement', 20, canvas.height - 35, '#fff', 14);
    }

    // Interaction prompt - adjust position on mobile to avoid joystick overlap
    if (showInteractionPrompt) {
      const promptWidth = isMobile ? 220 : 350;
      const promptHeight = isMobile ? 40 : 50;
      const promptX = canvas.width / 2 - promptWidth / 2;
      // On mobile, position higher to avoid joystick (joystick is at ~height-140)
      const promptY = isMobile ? canvas.height / 2 : canvas.height - 180;
      const fontSize = isMobile ? 13 : 20;

      this.renderer.drawUIRectWithBorder(promptX, promptY, promptWidth, promptHeight, 'rgba(0, 0, 0, 0.85)', '#FFD700', isMobile ? 2 : 3);
      this.renderer.drawUIText(interactionPromptText, canvas.width / 2, promptY + promptHeight / 2 + 2, '#FFD700', fontSize, 'center');
    }

    // Enemy and corpse count in expedition
    if (mode === 'expedition') {
      const aliveEnemies = enemies.filter(e => e.alive).length;
      const lootableCorpses = corpses.filter(c => c.canLoot()).length;

      // Hunger timer - more compact on mobile
      const hungerTime = gameState.getState().expeditionState.hungerTimer;
      const hungerPercent = hungerTime / gameState.getState().expeditionState.maxHungerTime;
      const hungerColor = hungerPercent > 0.5 ? '#4CAF50' : hungerPercent > 0.25 ? '#FF8C00' : '#F44336';

      if (isMobile) {
        // Mobile: extra compact hunger display
        const boxWidth = 130;
        const boxX = canvas.width - boxWidth - 8;
        this.renderer.drawUIRectWithBorder(boxX, 8, boxWidth, 70, 'rgba(0, 0, 0, 0.6)', hungerColor, 1.5);
        this.renderer.drawUIText('🍖 Hunger', boxX + boxWidth/2, 22, hungerColor, 10, 'center');
        this.renderer.drawUIText(`${Math.ceil(hungerTime)}s`, boxX + boxWidth/2, 38, hungerColor, 16, 'center');
        this.renderer.drawUIText(`👾 ${aliveEnemies}`, boxX + boxWidth/2, 55, '#F44336', 10, 'center');
        if (lootableCorpses > 0) {
          this.renderer.drawUIText(`💀 ${lootableCorpses}`, boxX + boxWidth/2, 68, '#999', 9, 'center');
        }
      } else {
        // Desktop: full hunger display
        this.renderer.drawUIRectWithBorder(canvas.width - 210, 10, 200, 100, 'rgba(0, 0, 0, 0.7)', hungerColor, 2);
        this.renderer.drawUIText('🍖 HUNGER TIMER', canvas.width - 110, 30, hungerColor, 14, 'center');
        this.renderer.drawUIText(`${Math.ceil(hungerTime)}s`, canvas.width - 110, 52, hungerColor, 22, 'center');
        this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, canvas.width - 110, 75, '#F44336', 14, 'center');
        if (lootableCorpses > 0) {
          this.renderer.drawUIText(`Corpses: ${lootableCorpses}`, canvas.width - 110, 95, '#999', 12, 'center');
        }

        // Escape instruction in expedition mode (desktop only, mobile uses ESC key or back button)
        this.renderer.drawUIRectWithBorder(canvas.width - 230, 90, 220, 60, 'rgba(139, 0, 0, 0.7)', '#FF6B6B', 2);
        this.renderer.drawUIText('ESC: Flee to Base', canvas.width - 120, 115, '#FFD700', 16, 'center');
        this.renderer.drawUIText('(No Gold Loss)', canvas.width - 120, 135, '#90EE90', 12, 'center');
      }
    }

    // Combat log - position based on mobile/desktop
    // On mobile: smaller, at top-left below player stats to avoid joystick
    // On desktop: bottom-left as before
    const logEntries = combatLog.slice(0, isMobile ? 4 : 8); // Fewer entries on mobile

    if (isMobile) {
      // Mobile: extra compact log at top-left, below player stats and buffs
      const logX = 8;
      const statsHeight = 80; // Mobile stats panel height
      const buffHeight = activeBuffs.length > 0 ? (20 + activeBuffs.length * 16) : 0;
      const spacing = 8;
      const logY = 8 + statsHeight + buffHeight + spacing;
      const logWidth = 160;
      const logHeight = Math.max(40, logEntries.length * 14 + 24);

      this.renderer.drawUIRectWithBorder(logX, logY, logWidth, logHeight, 'rgba(0, 0, 0, 0.7)', '#FFD700', 1.5);
      this.renderer.drawUIText('Log', logX + 8, logY + 13, '#FFD700', 10, 'left');

      if (logEntries.length > 0) {
        logEntries.forEach((entry, i) => {
          const text = entry.text.length > 20 ? entry.text.substring(0, 18) + '...' : entry.text;
          this.renderer.drawUIText(text, logX + 8, logY + 26 + i * 14, entry.color, 8, 'left');
        });
      }
    } else {
      // Desktop: full log at bottom-left
      const logX = 10;
      const logY = canvas.height - 240;
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
    }

    // Inventory (top right, below enemy count) - more compact on mobile
    if (inventory.length > 0) {
      if (isMobile) {
        // Mobile: extra compact inventory
        const invStartY = mode === 'expedition' ? 86 : 8;
        const invWidth = 115;
        const maxItems = 3;
        const invHeight = Math.min(inventory.length * 14 + 22, maxItems * 14 + 22);

        this.renderer.drawUIRectWithBorder(canvas.width - invWidth - 8, invStartY, invWidth, invHeight, 'rgba(0, 0, 0, 0.6)', '#90EE90', 1.5);
        this.renderer.drawUIText('Inv', canvas.width - invWidth/2 - 8, invStartY + 12, '#90EE90', 10, 'center');

        inventory.slice(0, maxItems).forEach((itemId, i) => {
          const template = entityFactory.getTemplate(itemId);
          const itemName = template?.name || itemId;
          const displayName = itemName.length > 10 ? itemName.substring(0, 8) + '..' : itemName;
          this.renderer.drawUIText(displayName, canvas.width - invWidth - 4, invStartY + 24 + i * 14, '#FFF', 8, 'left');
        });

        if (inventory.length > maxItems) {
          this.renderer.drawUIText(`+${inventory.length - maxItems}`, canvas.width - invWidth/2 - 8, invStartY + 24 + maxItems * 14, '#AAA', 8, 'center');
        }
      } else {
        // Desktop: full inventory
        const invStartY = mode === 'expedition' ? 170 : 90;
        const invHeight = Math.min(inventory.length * 20 + 30, 150);

        this.renderer.drawUIRectWithBorder(canvas.width - 230, invStartY, 220, invHeight, 'rgba(0, 0, 0, 0.7)', '#90EE90', 2);
        this.renderer.drawUIText('Inventory', canvas.width - 120, invStartY + 20, '#90EE90', 14, 'center');

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
}
