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
import { Particle } from '../entities/Particle';

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
      // More varied floor colors based on position
      const seed = x * 7 + y * 13;
      const baseShade = 26 + (seed % 3) * 2; // Varies between #1a1a1a and #1e1e1e
      const floorColor = `rgb(${baseShade}, ${baseShade}, ${baseShade})`;
      this.renderer.drawRect(worldX, worldY, size, size, floorColor);

      // Add varied decorative elements with more randomization
      const hash1 = (x * 127 + y * 311) % 100;
      const hash2 = (x * 197 + y * 419) % 100;
      const hash3 = (x * 263 + y * 509) % 100;

      // Stone cracks and weathering
      if (hash1 < 15) {
        const crackX = worldX + (hash2 / 100) * size;
        const crackY = worldY + (hash3 / 100) * size;
        this.renderer.drawLine(crackX, crackY, crackX + size * 0.3, crackY + size * 0.2, 'rgba(0, 0, 0, 0.2)', 0.5);
      }

      // Small pebbles and debris
      if (hash2 < 20) {
        const pebbleX = worldX + ((hash1 * 13) % 100 / 100) * size;
        const pebbleY = worldY + ((hash3 * 17) % 100 / 100) * size;
        const pebbleSize = 0.5 + (hash1 % 3) * 0.3;
        this.renderer.drawCircle(pebbleX, pebbleY, pebbleSize, 'rgba(60, 60, 60, 0.3)');
      }

      // Darker spots (wear marks)
      if (hash3 < 12) {
        const spotX = worldX + ((hash2 * 19) % 100 / 100) * size;
        const spotY = worldY + ((hash1 * 23) % 100 / 100) * size;
        this.renderer.drawCircle(spotX, spotY, 2 + (hash3 % 3), 'rgba(0, 0, 0, 0.15)');
      }

      // Lighter highlights
      if (hash1 % 8 === 0) {
        const highlightX = worldX + ((hash3 * 29) % 100 / 100) * size;
        const highlightY = worldY + ((hash2 * 31) % 100 / 100) * size;
        this.renderer.drawCircle(highlightX, highlightY, 1, 'rgba(255, 255, 255, 0.08)');
      }

      // Subtle grid pattern with variation
      const gridOpacity = 0.15 + (seed % 3) * 0.05;
      this.renderer.drawLine(worldX, worldY, worldX + size, worldY, `rgba(10, 10, 10, ${gridOpacity})`, 1);
      this.renderer.drawLine(worldX, worldY, worldX, worldY + size, `rgba(10, 10, 10, ${gridOpacity})`, 1);

    } else if (tileType === TileType.WALL) {
      this.renderWall(worldX, worldY, size, x, y);
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

  private renderWall(worldX: number, worldY: number, size: number, x: number, y: number): void {
    // Varied wall base colors for more interesting look
    const seed = x * 11 + y * 17;
    const baseShade = 58 + (seed % 5) * 2;
    const wallColor = `rgb(${baseShade}, ${baseShade}, ${baseShade})`;
    this.renderer.drawRect(worldX, worldY, size, size, wallColor);

    // Enhanced lighting - top highlight and bottom shadow
    this.renderer.drawRect(worldX, worldY, size, size * 0.2, 'rgba(90, 90, 90, 0.7)');
    this.renderer.drawRect(worldX, worldY + size * 0.8, size, size * 0.2, 'rgba(20, 20, 20, 0.9)');

    // Brick pattern with offset
    const brickWidth = size / 2;
    const brickHeight = size / 3;
    const offsetX = y % 2 === 0 ? 0 : brickWidth / 2;

    for (let by = 0; by < 3; by++) {
      for (let bx = 0; bx < 2; bx++) {
        const brickX = worldX + bx * brickWidth + offsetX;
        const brickY = worldY + by * brickHeight;

        if (brickX >= worldX && brickX + brickWidth <= worldX + size) {
          // Mortar lines
          this.renderer.drawLine(brickX, brickY, brickX + brickWidth, brickY, '#2a2a2a', 1);
          this.renderer.drawLine(brickX, brickY, brickX, brickY + brickHeight, '#2a2a2a', 1);

          // Random brick damage/cracks
          const brickHash = (brickX * 13 + brickY * 19) % 100;
          if (brickHash < 8) {
            const crackStartX = brickX + brickWidth * 0.3;
            const crackStartY = brickY + brickHeight * 0.2;
            this.renderer.drawLine(crackStartX, crackStartY, crackStartX + brickWidth * 0.4, crackStartY + brickHeight * 0.6, 'rgba(0, 0, 0, 0.4)', 0.8);
          }

          // Brick texture variation
          if (brickHash % 7 === 0) {
            this.renderer.drawCircle(brickX + brickWidth * 0.5, brickY + brickHeight * 0.5, 1, 'rgba(0, 0, 0, 0.15)');
          }
        }
      }
    }

    // Stronger edge shadows for depth
    this.renderer.drawLine(worldX + size, worldY, worldX + size, worldY + size, '#1a1a1a', 2.5);
    this.renderer.drawLine(worldX, worldY + size, worldX + size, worldY + size, '#1a1a1a', 2.5);

    // Moss or weathering on some walls
    const wallHash = (x * 23 + y * 29) % 100;
    if (wallHash < 10) {
      const mossX = worldX + size * 0.7;
      const mossY = worldY + size * 0.6;
      this.renderer.drawCircle(mossX, mossY, 3, 'rgba(76, 175, 80, 0.15)');
    }
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

  renderParticles(particles: Particle[]): void {
    for (const particle of particles) {
      const alpha = particle.alpha;
      const color = particle.color.startsWith('#')
        ? this.hexToRgba(particle.color, alpha)
        : particle.color.replace(/[\d.]+\)$/g, `${alpha})`);

      this.renderer.drawCircle(particle.x, particle.y, particle.size, color);
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

      // Show attack indicator when enemy is attacking
      if (enemy.aiState === 'attack' && enemy.attackCooldown > 0.3) {
        // Attack warning flash
        const flashSize = enemy.size * 2;
        const flashAlpha = Math.sin(enemy.attackCooldown * 20) * 0.3 + 0.3;
        this.renderer.drawCircle(enemy.x, enemy.y, flashSize, `rgba(255, 69, 0, ${flashAlpha})`);

        // Attack arc visualization for melee
        if (!enemy.isRangedWeapon()) {
          const arcRadius = enemy.getAttackRange();
          const arcStartAngle = enemy.facingAngle - 0.5;
          const arcEndAngle = enemy.facingAngle + 0.5;

          // Draw attack arc
          for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const angle = arcStartAngle + (arcEndAngle - arcStartAngle) * t;
            const x = enemy.x + Math.cos(angle) * arcRadius;
            const y = enemy.y + Math.sin(angle) * arcRadius;
            this.renderer.drawCircle(x, y, 2, `rgba(255, 69, 0, ${0.6 - t * 0.4})`);
          }
        }
      }

      const spriteKey = enemy.enemyData.id;
      const spriteSize = enemy.size * 1.5;
      this.renderer.drawCachedSVG(spriteKey, enemy.x, enemy.y, spriteSize, spriteSize, 0);

      // Render enemy weapon
      if (enemy.isRangedWeapon()) {
        const gunLength = 15;
        const endX = enemy.x + Math.cos(enemy.facingAngle) * gunLength;
        const endY = enemy.y + Math.sin(enemy.facingAngle) * gunLength;
        this.renderer.drawLine(enemy.x, enemy.y, endX, endY, '#FF5722', 3);
        this.renderer.drawCircle(endX, endY, 2, '#FFD700');
      } else if (enemy.weapon) {
        // Show melee weapon for enemies too
        const weaponDist = 12;
        const weaponX = enemy.x + Math.cos(enemy.facingAngle) * weaponDist;
        const weaponY = enemy.y + Math.sin(enemy.facingAngle) * weaponDist;
        const weaponLen = 15;
        const endX = weaponX + Math.cos(enemy.facingAngle) * weaponLen;
        const endY = weaponY + Math.sin(enemy.facingAngle) * weaponLen;
        this.renderer.drawLine(weaponX, weaponY, endX, endY, '#8B4513', 3);
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

    // Render equipped weapon
    this.renderPlayerWeapon(player);

    // Attack visualization
    if (player.attackCooldown > 0.3 && !player.isRangedWeapon()) {
      const hitbox = player.getAttackHitbox();
      this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius, 'rgba(255, 255, 255, 0.3)');
    }
  }

  private renderPlayerWeapon(player: Player): void {
    if (!player.weapon) {
      // No weapon - show fists
      const fistDist = 12;
      const fistX = player.x + Math.cos(player.facingAngle) * fistDist;
      const fistY = player.y + Math.sin(player.facingAngle) * fistDist;
      this.renderer.drawCircle(fistX, fistY, 3, '#FFE0B2');
      return;
    }

    const weaponDistance = 14;
    const weaponX = player.x + Math.cos(player.facingAngle) * weaponDistance;
    const weaponY = player.y + Math.sin(player.facingAngle) * weaponDistance;

    if (player.isRangedWeapon()) {
      // Render gun
      const gunLength = 16;
      const gunWidth = 4;
      const endX = weaponX + Math.cos(player.facingAngle) * gunLength;
      const endY = weaponY + Math.sin(player.facingAngle) * gunLength;

      // Gun body
      this.renderer.drawLine(weaponX, weaponY, endX, endY, '#333', gunWidth);
      // Gun barrel
      this.renderer.drawLine(endX - Math.cos(player.facingAngle) * 4, endY - Math.sin(player.facingAngle) * 4, endX, endY, '#555', 2);
      // Gun highlight
      const highlightX = weaponX + Math.cos(player.facingAngle) * (gunLength * 0.3);
      const highlightY = weaponY + Math.sin(player.facingAngle) * (gunLength * 0.3);
      this.renderer.drawCircle(highlightX, highlightY, 1.5, 'rgba(255, 255, 255, 0.6)');
      // Muzzle
      this.renderer.drawCircle(endX, endY, 2, '#FFD700');
    } else {
      // Render melee weapon
      const swordLength = 20;
      const endX = weaponX + Math.cos(player.facingAngle) * swordLength;
      const endY = weaponY + Math.sin(player.facingAngle) * swordLength;

      // Blade
      this.renderer.drawLine(weaponX, weaponY, endX, endY, '#C0C0C0', 3);
      // Blade edge highlight
      this.renderer.drawLine(weaponX, weaponY, endX, endY, '#E8E8E8', 1);
      // Handle
      const handleLen = 6;
      const handleX = weaponX - Math.cos(player.facingAngle) * handleLen;
      const handleY = weaponY - Math.sin(player.facingAngle) * handleLen;
      this.renderer.drawLine(handleX, handleY, weaponX, weaponY, '#654321', 4);
      // Guard
      const guardAngle = player.facingAngle + Math.PI / 2;
      const guardSize = 6;
      this.renderer.drawLine(
        weaponX - Math.cos(guardAngle) * guardSize,
        weaponY - Math.sin(guardAngle) * guardSize,
        weaponX + Math.cos(guardAngle) * guardSize,
        weaponY + Math.sin(guardAngle) * guardSize,
        '#8B7355',
        3
      );
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
