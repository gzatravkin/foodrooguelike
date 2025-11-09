/**
 * GameScreenRenderer - Handles all rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { GameMap, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { GameMode } from './GameScreen';
import { Weapon } from '../entities/types';

export class GameScreenRenderer {
  constructor(private renderer: CanvasRenderer) {}

  clear(): void {
    this.renderer.clear();
  }

  setCamera(x: number, y: number): void {
    this.renderer.setCamera(x, y);
  }

  renderMap(map: GameMap | null): void {
    if (!map) return;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tileType = map.tiles[y][x];
        const worldX = x * map.tileSize;
        const worldY = y * map.tileSize;
        const size = map.tileSize;

        this.renderTile(tileType, worldX, worldY, size, x, y);
      }
    }
  }

  private renderTile(tileType: TileType, worldX: number, worldY: number, size: number, x: number, y: number): void {
    if (tileType === TileType.FLOOR) {
      this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');

      const seed = x * 7 + y * 13;
      if (seed % 5 === 0) {
        this.renderer.drawCircle(worldX + size * 0.3, worldY + size * 0.3, 1, 'rgba(255, 255, 255, 0.05)');
      }
      if (seed % 7 === 0) {
        this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.6, 1.5, 'rgba(0, 0, 0, 0.1)');
      }

      this.renderer.drawLine(worldX, worldY, worldX + size, worldY, '#0a0a0a', 1);
      this.renderer.drawLine(worldX, worldY, worldX, worldY + size, '#0a0a0a', 1);

    } else if (tileType === TileType.WALL) {
      this.renderWall(worldX, worldY, size, y);
    } else if (tileType === TileType.DOOR) {
      this.renderDoor(worldX, worldY, size);
    } else if (tileType === TileType.COOKING_STATION) {
      this.renderCookingStation(worldX, worldY, size);
    } else if (tileType === TileType.SHOP) {
      this.renderShopTile(worldX, worldY, size);
    } else if (tileType === TileType.EXPEDITION_PORTAL) {
      this.renderExpeditionPortal(worldX, worldY, size);
    }
  }

  private renderWall(worldX: number, worldY: number, size: number, y: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#3a3a3a');
    this.renderer.drawRect(worldX, worldY, size, size * 0.2, 'rgba(70, 70, 70, 0.8)');
    this.renderer.drawRect(worldX, worldY + size * 0.8, size, size * 0.2, 'rgba(20, 20, 20, 0.8)');

    const brickWidth = size / 2;
    const brickHeight = size / 3;
    const offsetX = y % 2 === 0 ? 0 : brickWidth / 2;

    for (let by = 0; by < 3; by++) {
      for (let bx = 0; bx < 2; bx++) {
        const brickX = worldX + bx * brickWidth + offsetX;
        const brickY = worldY + by * brickHeight;

        if (brickX >= worldX && brickX + brickWidth <= worldX + size) {
          this.renderer.drawLine(brickX, brickY, brickX + brickWidth, brickY, '#2a2a2a', 0.5);
          this.renderer.drawLine(brickX, brickY, brickX, brickY + brickHeight, '#2a2a2a', 0.5);
        }
      }
    }

    this.renderer.drawLine(worldX + size, worldY, worldX + size, worldY + size, '#1a1a1a', 2);
    this.renderer.drawLine(worldX, worldY + size, worldX + size, worldY + size, '#1a1a1a', 2);
  }

  private renderDoor(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#654321');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.1, size * 0.6, size * 0.8, '#8b6f47');
    this.renderer.drawCircle(worldX + size * 0.7, worldY + size * 0.5, 2, '#FFD700');
  }

  private renderCookingStation(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#ff6b35');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.2, '#ff9f5e');
  }

  private renderShopTile(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawRect(worldX + size * 0.2, worldY + size * 0.2, size * 0.6, size * 0.6, '#4ecdc4');
    this.renderer.drawText('$', worldX + size / 2, worldY + size / 2 + 5, '#FFD700', 16, 'center');
  }

  private renderExpeditionPortal(worldX: number, worldY: number, size: number): void {
    this.renderer.drawRect(worldX, worldY, size, size, '#1a1a1a');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.4, '#9b59b6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.25, '#bb79d6');
    this.renderer.drawCircle(worldX + size / 2, worldY + size / 2, size * 0.1, '#e0aaff');
  }

  renderCorpses(corpses: Corpse[]): void {
    for (const corpse of corpses) {
      const opacity = corpse.looted ? 0.3 : 0.6;
      const size = corpse.size;

      this.renderer.drawCircle(corpse.x, corpse.y, size / 2, `rgba(60, 40, 30, ${opacity})`);

      const skullColor = corpse.looted ? '#555' : '#999';
      this.renderer.drawText('💀', corpse.x, corpse.y + 4, skullColor, 16, 'center');
    }
  }

  renderEnemies(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      const spriteKey = enemy.enemyData.id;
      const spriteSize = enemy.size * 1.5;
      this.renderer.drawCachedSVG(spriteKey, enemy.x, enemy.y, spriteSize, spriteSize, 0);

      if (enemy.isRangedWeapon()) {
        const gunLength = 15;
        const endX = enemy.x + Math.cos(enemy.facingAngle) * gunLength;
        const endY = enemy.y + Math.sin(enemy.facingAngle) * gunLength;
        this.renderer.drawLine(enemy.x, enemy.y, endX, endY, '#FF5722', 3);
        this.renderer.drawCircle(endX, endY, 2, '#FFD700');
      }

      this.drawHealthBar(enemy.x, enemy.y - enemy.size, enemy.stats.health, enemy.stats.maxHealth);
    }
  }

  renderProjectiles(projectiles: Projectile[]): void {
    for (const proj of projectiles) {
      const projSize = proj.size * 3;

      this.renderer.drawCircle(proj.x, proj.y, projSize, 'rgba(255, 215, 0, 0.3)');
      this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);

      const trailLength = 15;
      const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
      const normalizedVx = proj.vx / speed;
      const normalizedVy = proj.vy / speed;
      const trailX = proj.x - normalizedVx * trailLength;
      const trailY = proj.y - normalizedVy * trailLength;
      this.renderer.drawLine(trailX, trailY, proj.x, proj.y, proj.color, 3);
    }
  }

  renderPlayer(player: Player): void {
    // Dash trail
    if (player.isDashing) {
      for (let i = 1; i <= 5; i++) {
        const trailX = player.x - player.dashDirection.x * i * 10;
        const trailY = player.y - player.dashDirection.y * i * 10;
        const opacity = (6 - i) * 0.15;
        this.renderer.drawCircle(trailX, trailY, player.size / 2, `rgba(76, 175, 80, ${opacity})`);
      }
    }

    // Player sprite
    const playerSize = player.size * 1.5;
    this.renderer.drawCachedSVG('player', player.x, player.y, playerSize, playerSize, 0);

    if (player.isDashing) {
      this.renderer.drawCircle(player.x, player.y, playerSize * 0.8, 'rgba(76, 175, 80, 0.4)');
    }

    // Weapon indicator
    if (player.isRangedWeapon()) {
      const gunLength = 18;
      const endX = player.x + Math.cos(player.facingAngle) * gunLength;
      const endY = player.y + Math.sin(player.facingAngle) * gunLength;
      this.renderer.drawLine(player.x, player.y, endX, endY, '#FFD700', 4);
      this.renderer.drawCircle(endX, endY, 2.5, '#FF5722');
    } else {
      const angle = player.facingAngle;
      const indicatorLength = player.size / 2 + 10;
      const endX = player.x + Math.cos(angle) * indicatorLength;
      const endY = player.y + Math.sin(angle) * indicatorLength;
      this.renderer.drawLine(player.x, player.y, endX, endY, '#E0E0E0', 4);
      this.renderer.drawCircle(endX, endY, 3, '#FFF');
    }

    // Attack visualization
    if (player.attackCooldown > 0.3 && !player.isRangedWeapon()) {
      const hitbox = player.getAttackHitbox();
      this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius, 'rgba(255, 255, 255, 0.3)');
    }
  }

  renderUI(
    player: Player,
    mode: GameMode,
    enemies: Enemy[],
    corpses: Corpse[],
    showInteractionPrompt: boolean,
    interactionPromptText: string
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

      this.renderer.drawUIText(`Enemies: ${aliveEnemies}`, canvas.width - 150, 30, '#F44336', 18);
      if (lootableCorpses > 0) {
        this.renderer.drawUIText(`Corpses: ${lootableCorpses}`, canvas.width - 150, 55, '#999', 16);
      }
    }
  }

  private drawHealthBar(x: number, y: number, health: number, maxHealth: number): void {
    const barWidth = 40;
    const barHeight = 6;
    const healthPercent = health / maxHealth;

    this.renderer.drawRect(x - barWidth / 2, y, barWidth, barHeight, '#333');

    const healthWidth = barWidth * healthPercent;
    const healthColor = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
    this.renderer.drawRect(x - barWidth / 2, y, healthWidth, barHeight, healthColor);

    this.renderer.drawLine(x - barWidth / 2, y, x + barWidth / 2, y, '#000', 1);
    this.renderer.drawLine(x - barWidth / 2, y + barHeight, x + barWidth / 2, y + barHeight, '#000', 1);
  }

  renderShop(availableWeapons: Weapon[], playerGold: number, currentWeapon: Weapon | null): void {
    const canvas = this.renderer.getCanvas();

    this.renderer.drawUIRect(0, 0, canvas.width, canvas.height, 'rgba(0, 0, 0, 0.7)');

    const panelWidth = 700;
    const panelHeight = 600;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2;

    this.renderer.drawUIRectWithBorder(panelX, panelY, panelWidth, panelHeight, 'rgba(20, 20, 20, 0.95)', '#4CAF50', 3);

    this.renderer.drawUIText('WEAPON SHOP', canvas.width / 2, panelY + 40, '#4CAF50', 32, 'center');
    this.renderer.drawUIText(`Gold: ${playerGold}`, canvas.width / 2, panelY + 75, '#FFD700', 20, 'center');

    let yPos = panelY + 110;
    availableWeapons.slice(0, 8).forEach((weapon, i) => {
      const type = weapon.weaponType === 'ranged' ? '🔫' : '⚔️';
      const canAfford = playerGold >= weapon.cost;
      const color = canAfford ? '#fff' : '#666';
      const rarityColor = weapon.rarity === 'legendary' ? '#FF6B00' :
                         weapon.rarity === 'rare' ? '#9C27B0' :
                         weapon.rarity === 'uncommon' ? '#2196F3' : '#888';

      this.renderer.drawUIRectWithBorder(
        panelX + 20,
        yPos,
        panelWidth - 40,
        55,
        canAfford ? 'rgba(50, 50, 50, 0.8)' : 'rgba(30, 30, 30, 0.5)',
        rarityColor,
        2
      );

      this.renderer.drawUIText(`[${i + 1}]`, panelX + 40, yPos + 20, '#FFD700', 18);
      this.renderer.drawUIText(`${type} ${weapon.name}`, panelX + 80, yPos + 20, color, 18);

      const stats = `DMG: ${weapon.damage} | SPD: ${weapon.attackSpeed.toFixed(1)}s | RNG: ${weapon.range}`;
      this.renderer.drawUIText(stats, panelX + 80, yPos + 40, color, 14);

      this.renderer.drawUIText(`${weapon.cost}g`, panelX + panelWidth - 80, yPos + 30, canAfford ? '#FFD700' : '#666', 20, 'right');

      yPos += 60;
    });

    this.renderer.drawUIText('Press number key to buy weapon | ESC to close', canvas.width / 2, panelY + panelHeight - 30, '#aaa', 16, 'center');

    if (currentWeapon) {
      this.renderer.drawUIText(`Equipped: ${currentWeapon.name}`, canvas.width / 2, panelY + panelHeight - 60, '#4CAF50', 16, 'center');
    }
  }
}
