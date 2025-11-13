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
import { scaleSize } from '../utils/MobileUtils';

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
      // Mobile: extra compact stats panel with responsive sizing
      const panelWidth = scaleSize(240);
      const panelHeight = scaleSize(120);
      const padding = scaleSize(12);
      const fontSize1 = scaleSize(16);
      const fontSize2 = scaleSize(14);

      this.renderer.drawUIRectWithBorder(padding, padding, panelWidth, panelHeight, 'rgba(0, 0, 0, 0.6)', '#4CAF50', 1.5);
      this.renderer.drawUIText(`❤️ ${player.stats.health}/${player.stats.maxHealth}`, padding * 2, scaleSize(33), '#fff', fontSize1);
      this.renderer.drawUIText(`💰 ${player.gold}`, padding * 2, scaleSize(57), '#FFD700', fontSize1);
      this.renderer.drawUIText(`⚔️${player.getAttackDamage()} 🛡️${player.getTotalDefense()}`, padding * 2, scaleSize(81), '#fff', fontSize2);

      const weaponName = player.weapon?.name || 'Fists';
      const weaponType = player.isRangedWeapon() ? '🔫' : '⚔️';
      const shortWeaponName = weaponName.length > 10 ? weaponName.substring(0, 8) + '..' : weaponName;
      this.renderer.drawUIText(`${weaponType} ${shortWeaponName}`, padding * 2, scaleSize(105), '#FFD700', fontSize2);
    } else {
      // Desktop: full stats panel with responsive sizing
      const panelWidth = scaleSize(450);
      const panelHeight = scaleSize(225);
      const padding = scaleSize(15);
      const textPadding = scaleSize(30);
      const fontSize1 = scaleSize(27);
      const fontSize2 = scaleSize(24);

      this.renderer.drawUIRectWithBorder(padding, padding, panelWidth, panelHeight, 'rgba(0, 0, 0, 0.7)', '#4CAF50', 2);
      this.renderer.drawUIText(`HP: ${player.stats.health}/${player.stats.maxHealth}`, textPadding, scaleSize(52), '#fff', fontSize1);
      this.renderer.drawUIText(`Gold: ${player.gold}`, textPadding, scaleSize(90), '#FFD700', fontSize1);
      this.renderer.drawUIText(`ATK: ${player.getAttackDamage()} | DEF: ${player.getTotalDefense()}`, textPadding, scaleSize(128), '#fff', fontSize2);

      const weaponName = player.weapon?.name || 'Fists';
      const weaponType = player.isRangedWeapon() ? '🔫' : '⚔️';
      this.renderer.drawUIText(`${weaponType} ${weaponName}`, textPadding, scaleSize(165), '#FFD700', fontSize2);
    }

    // Active buffs
    const activeBuffs = gameState.getState().activeBuffs;
    if (activeBuffs.length > 0) {
      if (isMobile) {
        // Mobile: extra compact buffs below stats panel with responsive sizing
        const buffY = scaleSize(96);
        const buffWidth = scaleSize(160);
        const padding = scaleSize(8);
        const buffHeight = scaleSize(20 + (activeBuffs.length * 16));

        this.renderer.drawUIRectWithBorder(padding, buffY, buffWidth, buffHeight, 'rgba(138, 43, 226, 0.25)', '#BA68C8', 1.5);
        this.renderer.drawUIText('Buffs:', padding * 2, buffY + scaleSize(13), '#FFD700', scaleSize(10), 'left');

        activeBuffs.forEach((buff, i) => {
          const buffEmoji = buff.name.includes('health') ? '❤️' : buff.name.includes('attack') ? '⚔️' : '🛡️';
          const buffName = buff.name.length > 10 ? buff.name.substring(0, 8) + '..' : buff.name;
          const buffText = `${buffEmoji} ${buffName} ${Math.ceil(buff.duration / 60)}s`;
          this.renderer.drawUIText(buffText, padding * 2, buffY + scaleSize(28 + (i * 16)), '#90EE90', scaleSize(9));
        });
      } else {
        // Desktop: full buffs display with responsive sizing
        const buffY = scaleSize(255);
        const panelWidth = scaleSize(450);
        const panelHeight = scaleSize(45 + (activeBuffs.length * 38));
        const padding = scaleSize(15);
        const textPadding = scaleSize(30);

        this.renderer.drawUIRectWithBorder(padding, buffY, panelWidth, panelHeight, 'rgba(138, 43, 226, 0.3)', '#BA68C8', 2);
        this.renderer.drawUIText('ACTIVE BUFFS:', textPadding, buffY + scaleSize(30), '#FFD700', scaleSize(21), 'left');

        activeBuffs.forEach((buff, i) => {
          const buffEmoji = buff.name.includes('health') ? '❤️' : buff.name.includes('attack') ? '⚔️' : '🛡️';
          const buffText = `${buffEmoji} ${buff.name} (${Math.ceil(buff.duration / 60)}s)`;
          this.renderer.drawUIText(buffText, textPadding, buffY + scaleSize(68 + (i * 38)), '#90EE90', scaleSize(21));
        });
      }
    }

    // Cooldown indicators - simplified on mobile (shown as visual cues on buttons)
    if (!isMobile) {
      // Desktop only: show cooldown bars with responsive sizing
      const dashCooldownPercent = Math.max(0, player.dashCooldown / 1.0);
      const dashColor = player.canDash() ? '#4CAF50' : '#666';
      const textPadding = scaleSize(30);
      const textY = scaleSize(203);
      const barY = scaleSize(185);
      const barWidth = scaleSize(105);
      const barHeight = scaleSize(21);
      const fontSize = scaleSize(21);

      this.renderer.drawUIText('💨 Dash:', textPadding, textY, dashColor, fontSize);
      this.renderer.drawUIRect(scaleSize(143), barY, barWidth, barHeight, '#222');
      if (!player.canDash()) {
        const fillWidth = barWidth * (1 - dashCooldownPercent);
        this.renderer.drawUIRect(scaleSize(143), barY, fillWidth, barHeight, '#4CAF50');
      } else {
        this.renderer.drawUIRect(scaleSize(143), barY, barWidth, barHeight, '#4CAF50');
      }

      // Weapon cooldown
      const weaponCooldownMax = player.weapon?.attackSpeed || 0.5;
      const weaponCooldownPercent = Math.max(0, Math.min(1, player.attackCooldown / weaponCooldownMax));
      const weaponColor = player.canAttack() ? '#FFD700' : '#666';
      const weaponIcon = player.isRangedWeapon() ? '🔫' : '⚔️';
      this.renderer.drawUIText(`${weaponIcon} Wpn:`, scaleSize(270), textY, weaponColor, fontSize);

      this.renderer.drawUIRect(scaleSize(353), barY, barWidth, barHeight, '#222');
      if (!player.canAttack()) {
        const fillWidth = barWidth * (1 - weaponCooldownPercent);
        this.renderer.drawUIRect(scaleSize(353), barY, fillWidth, barHeight, '#FFD700');
      } else {
        this.renderer.drawUIRect(scaleSize(353), barY, barWidth, barHeight, '#FFD700');
      }
    }

    // Mode indicator - responsive sizing
    const modeText = mode === 'base' ? 'BASE CAMP' : 'EXPEDITION';
    const modeFontSize = isMobile ? scaleSize(24) : scaleSize(36);
    const modeY = isMobile ? scaleSize(30) : scaleSize(45);
    this.renderer.drawUIText(modeText, canvas.width / 2, modeY, '#fff', modeFontSize, 'center');

    // Controls - ONLY show on desktop, hide on mobile (they see visual controls)
    if (!isMobile) {
      const controlsWidth = scaleSize(570);
      const controlsHeight = scaleSize(278);
      const padding = scaleSize(15);
      const textPadding = scaleSize(30);
      const fontSize1 = scaleSize(21);
      const fontSize2 = scaleSize(18);

      this.renderer.drawUIRectWithBorder(padding, canvas.height - controlsHeight - scaleSize(15), controlsWidth, controlsHeight, 'rgba(0, 0, 0, 0.7)', '#fff', 2);
      this.renderer.drawUIText('WASD/Arrows: Move', textPadding, canvas.height - scaleSize(255), '#fff', fontSize1);
      this.renderer.drawUIText('Shift: Dash (dodge)', textPadding, canvas.height - scaleSize(225), '#4CAF50', fontSize1);
      this.renderer.drawUIText('Space/Click: Attack', textPadding, canvas.height - scaleSize(195), '#fff', fontSize1);
      this.renderer.drawUIText('Dash + Shoot: SUPER SHOT! 💥', textPadding, canvas.height - scaleSize(165), '#00FFFF', fontSize1);
      this.renderer.drawUIText('  (2x DMG, 3x bullets, faster!)', textPadding, canvas.height - scaleSize(143), '#00FFFF', fontSize2);
      this.renderer.drawUIText('1-9: Switch weapons', textPadding, canvas.height - scaleSize(113), '#FFD700', fontSize1);
      this.renderer.drawUIText('E: Interact | F: Loot', textPadding, canvas.height - scaleSize(83), '#fff', fontSize1);
      this.renderer.drawUIText('🎯 Aim: Mouse/Movement', textPadding, canvas.height - scaleSize(53), '#fff', fontSize1);
    }

    // Interaction prompt - adjust position on mobile to avoid joystick overlap with responsive sizing
    if (showInteractionPrompt) {
      const promptWidth = isMobile ? scaleSize(220) : scaleSize(350);
      const promptHeight = isMobile ? scaleSize(40) : scaleSize(50);
      const promptX = canvas.width / 2 - promptWidth / 2;
      // On mobile, position higher to avoid joystick (joystick is at ~height-140)
      const promptY = isMobile ? canvas.height / 2 : canvas.height - scaleSize(180);
      const fontSize = isMobile ? scaleSize(13) : scaleSize(20);

      this.renderer.drawUIRectWithBorder(promptX, promptY, promptWidth, promptHeight, 'rgba(0, 0, 0, 0.85)', '#FFD700', isMobile ? 2 : 3);
      this.renderer.drawUIText(interactionPromptText, canvas.width / 2, promptY + promptHeight / 2 + 2, '#FFD700', fontSize, 'center');
    }

    // Enemy and corpse count in expedition
    if (mode === 'expedition') {
      const aliveEnemies = enemies.filter(e => e.alive).length;
      const lootableCorpses = corpses.filter(c => c.canLoot()).length;

      // Hunger timer - more compact on mobile with responsive sizing
      const hungerTime = gameState.getState().expeditionState.hungerTimer;
      const hungerPercent = hungerTime / gameState.getState().expeditionState.maxHungerTime;
      const hungerColor = hungerPercent > 0.5 ? '#4CAF50' : hungerPercent > 0.25 ? '#FF8C00' : '#F44336';

      if (isMobile) {
        // Mobile: extra compact hunger display with responsive sizing
        const boxWidth = scaleSize(130);
        const boxHeight = scaleSize(70);
        const padding = scaleSize(8);
        const boxX = canvas.width - boxWidth - padding;

        this.renderer.drawUIRectWithBorder(boxX, padding, boxWidth, boxHeight, 'rgba(0, 0, 0, 0.6)', hungerColor, 1.5);
        this.renderer.drawUIText('🍖 Hunger', boxX + boxWidth/2, scaleSize(22), hungerColor, scaleSize(10), 'center');
        this.renderer.drawUIText(`${Math.ceil(hungerTime)}s`, boxX + boxWidth/2, scaleSize(38), hungerColor, scaleSize(16), 'center');
        this.renderer.drawUIText(`👾 ${aliveEnemies}`, boxX + boxWidth/2, scaleSize(55), '#F44336', scaleSize(10), 'center');
        if (lootableCorpses > 0) {
          this.renderer.drawUIText(`💀 ${lootableCorpses}`, boxX + boxWidth/2, scaleSize(68), '#999', scaleSize(9), 'center');
        }
      } else {
        // Desktop: full hunger display with responsive sizing
        const panelWidth = scaleSize(300);
        const panelHeight = scaleSize(150);
        const padding = scaleSize(15);
        const panelX = canvas.width - panelWidth - padding;

        this.renderer.drawUIRectWithBorder(panelX, padding, panelWidth, panelHeight, 'rgba(0, 0, 0, 0.7)', hungerColor, 2);
        this.renderer.drawUIText('🍖 HUNGER TIMER', panelX + panelWidth/2, scaleSize(45), hungerColor, scaleSize(21), 'center');
        this.renderer.drawUIText(`${Math.ceil(hungerTime)}s`, panelX + panelWidth/2, scaleSize(78), hungerColor, scaleSize(33), 'center');
        this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, panelX + panelWidth/2, scaleSize(113), '#F44336', scaleSize(21), 'center');
        if (lootableCorpses > 0) {
          this.renderer.drawUIText(`Corpses: ${lootableCorpses}`, panelX + panelWidth/2, scaleSize(143), '#999', scaleSize(18), 'center');
        }

        // Escape instruction in expedition mode (desktop only, mobile uses ESC key or back button)
        const escPanelWidth = scaleSize(330);
        const escPanelHeight = scaleSize(90);
        const escPanelX = canvas.width - escPanelWidth - padding;
        const escPanelY = scaleSize(135);

        this.renderer.drawUIRectWithBorder(escPanelX, escPanelY, escPanelWidth, escPanelHeight, 'rgba(139, 0, 0, 0.7)', '#FF6B6B', 2);
        this.renderer.drawUIText('ESC: Flee to Base', escPanelX + escPanelWidth/2, scaleSize(173), '#FFD700', scaleSize(24), 'center');
        this.renderer.drawUIText('(No Gold Loss)', escPanelX + escPanelWidth/2, scaleSize(203), '#90EE90', scaleSize(18), 'center');
      }
    }

    // Combat log - position based on mobile/desktop with responsive sizing
    // On mobile: smaller, at top-left below player stats to avoid joystick
    // On desktop: bottom-left as before
    const logEntries = combatLog.slice(0, isMobile ? 4 : 8); // Fewer entries on mobile

    if (isMobile) {
      // Mobile: extra compact log at top-left, below player stats and buffs with responsive sizing
      const padding = scaleSize(8);
      const statsHeight = scaleSize(80); // Mobile stats panel height
      const buffHeight = activeBuffs.length > 0 ? scaleSize(20 + activeBuffs.length * 16) : 0;
      const spacing = padding;
      const logY = padding + statsHeight + buffHeight + spacing;
      const logWidth = scaleSize(160);
      const logHeight = Math.max(scaleSize(40), logEntries.length * scaleSize(14) + scaleSize(24));

      this.renderer.drawUIRectWithBorder(padding, logY, logWidth, logHeight, 'rgba(0, 0, 0, 0.7)', '#FFD700', 1.5);
      this.renderer.drawUIText('Log', padding * 2, logY + scaleSize(13), '#FFD700', scaleSize(10), 'left');

      if (logEntries.length > 0) {
        logEntries.forEach((entry, i) => {
          const text = entry.text.length > 20 ? entry.text.substring(0, 18) + '...' : entry.text;
          this.renderer.drawUIText(text, padding * 2, logY + scaleSize(26 + i * 14), entry.color, scaleSize(8), 'left');
        });
      }
    } else {
      // Desktop: full log at bottom-left with responsive sizing
      // Position above the controls panel to avoid overlap
      const padding = scaleSize(15);
      const logWidth = scaleSize(570);
      const logBaseHeight = scaleSize(120);
      const entryHeight = scaleSize(33);
      const controlsHeight = scaleSize(278);
      const logY = canvas.height - controlsHeight - scaleSize(30) - scaleSize(300); // Position above controls with spacing
      const logHeight = Math.max(logBaseHeight, logEntries.length * entryHeight + scaleSize(60));

      this.renderer.drawUIRectWithBorder(padding, logY, logWidth, logHeight, 'rgba(0, 0, 0, 0.85)', '#FFD700', 2);
      this.renderer.drawUIText('Combat Log', padding * 2, logY + scaleSize(33), '#FFD700', scaleSize(24), 'left');

      if (logEntries.length > 0) {
        logEntries.forEach((entry, i) => {
          this.renderer.drawUIText(entry.text, padding * 2, logY + scaleSize(72) + i * entryHeight, entry.color, scaleSize(21), 'left');
        });
      } else {
        this.renderer.drawUIText('No messages yet...', padding * 2, logY + scaleSize(72), '#666', scaleSize(18), 'left');
      }
    }

    // Inventory (top right, below enemy count) - more compact on mobile with responsive sizing
    if (inventory.length > 0) {
      if (isMobile) {
        // Mobile: extra compact inventory with responsive sizing
        const invStartY = mode === 'expedition' ? scaleSize(86) : scaleSize(8);
        const invWidth = scaleSize(115);
        const maxItems = 3;
        const itemHeight = scaleSize(14);
        const headerHeight = scaleSize(22);
        const invHeight = Math.min(inventory.length * itemHeight + headerHeight, maxItems * itemHeight + headerHeight);
        const padding = scaleSize(8);

        this.renderer.drawUIRectWithBorder(canvas.width - invWidth - padding, invStartY, invWidth, invHeight, 'rgba(0, 0, 0, 0.6)', '#90EE90', 1.5);
        this.renderer.drawUIText('Inv', canvas.width - invWidth/2 - padding, invStartY + scaleSize(12), '#90EE90', scaleSize(10), 'center');

        inventory.slice(0, maxItems).forEach((itemId, i) => {
          const template = entityFactory.getTemplate(itemId);
          const itemName = template?.name || itemId;
          const displayName = itemName.length > 10 ? itemName.substring(0, 8) + '..' : itemName;
          this.renderer.drawUIText(displayName, canvas.width - invWidth - scaleSize(4), invStartY + scaleSize(24) + i * itemHeight, '#FFF', scaleSize(8), 'left');
        });

        if (inventory.length > maxItems) {
          this.renderer.drawUIText(`+${inventory.length - maxItems}`, canvas.width - invWidth/2 - padding, invStartY + scaleSize(24) + maxItems * itemHeight, '#AAA', scaleSize(8), 'center');
        }
      } else {
        // Desktop: full inventory with responsive sizing
        const invStartY = mode === 'expedition' ? scaleSize(255) : scaleSize(135);
        const invWidth = scaleSize(330);
        const itemHeight = scaleSize(30);
        const baseHeight = scaleSize(45);
        const maxHeight = scaleSize(225);
        const invHeight = Math.min(inventory.length * itemHeight + baseHeight, maxHeight);
        const padding = scaleSize(15);

        this.renderer.drawUIRectWithBorder(canvas.width - invWidth - padding, invStartY, invWidth, invHeight, 'rgba(0, 0, 0, 0.7)', '#90EE90', 2);
        this.renderer.drawUIText('Inventory', canvas.width - invWidth/2 - padding, invStartY + scaleSize(30), '#90EE90', scaleSize(21), 'center');

        inventory.slice(0, 6).forEach((itemId, i) => {
          const template = entityFactory.getTemplate(itemId);
          const itemName = template?.name || itemId;
          const displayName = itemName.length > 18 ? itemName.substring(0, 15) + '...' : itemName;
          this.renderer.drawUIText(displayName, canvas.width - invWidth, invStartY + scaleSize(60) + i * itemHeight, '#FFF', scaleSize(18), 'left');
        });

        if (inventory.length > 6) {
          this.renderer.drawUIText(`+${inventory.length - 6} more...`, canvas.width - invWidth, invStartY + scaleSize(60) + 6 * itemHeight, '#AAA', scaleSize(17), 'left');
        }
      }
    }
  }
}
