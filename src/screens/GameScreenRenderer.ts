/**
 * GameScreenRenderer - Handles all rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TileRenderer } from '../rendering/TileRenderer';
import { EntityRenderer } from '../rendering/EntityRenderer';
import { GameMap, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { Trap } from '../entities/Trap';
import { GameMode } from './GameScreen';
import { Weapon } from '../entities/types';
import { gameState } from '../core/GameState';
import { Particle } from '../entities/Particle';
import { entityFactory } from '../entities/EntityFactory';

export class GameScreenRenderer {
  private tileRenderer: TileRenderer;
  private entityRenderer: EntityRenderer;

  constructor(private renderer: CanvasRenderer) {
    this.tileRenderer = new TileRenderer(renderer);
    this.entityRenderer = new EntityRenderer(renderer);
  }

  clear(): void {
    this.renderer.clear();
  }

  setCamera(x: number, y: number): void {
    this.renderer.setCamera(x, y);
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  renderMap(map: GameMap | null): void {
    if (!map) return;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tileType = map.tiles[y][x];
        const worldX = x * map.tileSize;
        const worldY = y * map.tileSize;
        const size = map.tileSize;

        this.tileRenderer.renderTile(tileType, worldX, worldY, size, x, y);
      }
    }
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


  renderTraps(traps: Trap[]): void {
    for (const trap of traps) {
      if (trap.active || trap.activationTimer > 0) {
        // Activated trap - more visible with orange glow
        const glowIntensity = trap.activationTimer / trap.activationDelay;
        const glowAlpha = 0.4 + glowIntensity * 0.3;
        this.renderer.drawCircle(trap.x, trap.y, trap.size * 0.8, `rgba(255, 136, 0, ${glowAlpha})`);
        this.renderer.drawCircle(trap.x, trap.y, trap.size * 0.5, `rgba(255, 100, 0, ${glowAlpha + 0.2})`);
      } else {
        // Barely visible trap - very subtle dark circle with hints of red
        const seed = Math.floor(trap.x + trap.y);
        const opacity = 0.08 + (seed % 5) * 0.01; // Very low opacity (8-12%)

        // Draw subtle trap outline
        this.renderer.drawCircle(trap.x, trap.y, trap.size * 0.6, `rgba(80, 20, 20, ${opacity})`);

        // Add tiny darker center
        this.renderer.drawCircle(trap.x, trap.y, trap.size * 0.3, `rgba(60, 10, 10, ${opacity + 0.05})`);

        // Add very faint spikes/indicators
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const spikeX = trap.x + Math.cos(angle) * trap.size * 0.4;
          const spikeY = trap.y + Math.sin(angle) * trap.size * 0.4;
          this.renderer.drawCircle(spikeX, spikeY, 1.5, `rgba(100, 30, 30, ${opacity + 0.03})`);
        }
      }
    }
  }

  renderCorpses(corpses: Corpse[], nearbyCorpse: Corpse | null = null): void {
    for (const corpse of corpses) {
      const opacity = corpse.looted ? 0.3 : 0.6;
      const size = corpse.size;
      const isNearby = nearbyCorpse === corpse && !corpse.looted;

      // Add glowing effect for lootable nearby corpses
      if (isNearby) {
        const pulseAlpha = Math.sin(Date.now() / 300) * 0.2 + 0.4;
        this.renderer.drawCircle(corpse.x, corpse.y, size, `rgba(255, 215, 0, ${pulseAlpha})`);
      }

      this.renderer.drawCircle(corpse.x, corpse.y, size / 2, `rgba(60, 40, 30, ${opacity})`);

      const skullColor = corpse.looted ? '#555' : (isNearby ? '#FFD700' : '#999');
      this.renderer.drawText('💀', corpse.x, corpse.y + 4, skullColor, 16, 'center');

      // Show ingredient indicator for nearby lootable corpses
      if (isNearby && corpse.loot.ingredients.length > 0) {
        this.renderer.drawText('🍖', corpse.x, corpse.y - size, '#90EE90', 14, 'center');
      }
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

      this.entityRenderer.drawHealthBar(enemy.x, enemy.y - enemy.size, enemy.stats.health, enemy.stats.maxHealth);
    }
  }

  renderProjectiles(projectiles: Projectile[]): void {
    for (const proj of projectiles) {
      const speed = Math.sqrt(proj.vx * proj.vx + proj.vy * proj.vy);
      const normalizedVx = proj.vx / speed;
      const normalizedVy = proj.vy / speed;

      // Render based on shape
      switch (proj.shape) {
        case 'beam':
          // Energy beam - elongated with trail
          const beamLength = proj.size * 4;
          const beamEndX = proj.x - normalizedVx * beamLength;
          const beamEndY = proj.y - normalizedVy * beamLength;

          // Outer glow
          this.renderer.drawLine(beamEndX, beamEndY, proj.x, proj.y, this.hexToRgba(proj.color, 0.3), proj.size * 2);
          // Inner beam
          this.renderer.drawLine(beamEndX, beamEndY, proj.x, proj.y, proj.color, proj.size);
          // Bright core
          this.renderer.drawCircle(proj.x, proj.y, proj.size * 0.6, '#FFFFFF');
          break;

        case 'bolt':
          // Magic bolt - arrow-like with glow
          const boltLength = proj.size * 3;
          const boltEndX = proj.x - normalizedVx * boltLength;
          const boltEndY = proj.y - normalizedVy * boltLength;

          // Glow aura
          this.renderer.drawCircle(proj.x, proj.y, proj.size * 2, this.hexToRgba(proj.color, 0.3));
          // Bolt shaft
          this.renderer.drawLine(boltEndX, boltEndY, proj.x, proj.y, proj.color, proj.size * 0.8);
          // Bolt head
          this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);
          // Bright tip
          this.renderer.drawCircle(proj.x, proj.y, proj.size * 0.4, this.hexToRgba('#FFFFFF', 0.8));
          break;

        case 'fire':
          // Fire projectile - irregular with embers
          const fireSize = proj.size * (0.8 + Math.random() * 0.4);

          // Outer fire glow
          this.renderer.drawCircle(proj.x, proj.y, fireSize * 1.8, this.hexToRgba('#FF9800', 0.4));
          // Main fire
          this.renderer.drawCircle(proj.x, proj.y, fireSize, proj.color);
          // Hot core
          this.renderer.drawCircle(proj.x, proj.y, fireSize * 0.5, '#FFEB3B');

          // Ember trail
          for (let i = 1; i <= 3; i++) {
            const emberX = proj.x - normalizedVx * i * 8 + (Math.random() - 0.5) * 4;
            const emberY = proj.y - normalizedVy * i * 8 + (Math.random() - 0.5) * 4;
            const emberSize = proj.size * 0.3 * (1 - i * 0.2);
            this.renderer.drawCircle(emberX, emberY, emberSize, this.hexToRgba('#FF5722', 0.6 - i * 0.15));
          }
          break;

        case 'circle':
        default:
          // Standard circular projectile with glow
          const glowSize = proj.size * 3;
          const trailColor = proj.trailColor || proj.color;

          // Outer glow
          this.renderer.drawCircle(proj.x, proj.y, glowSize, this.hexToRgba(trailColor, 0.3));
          // Main projectile
          this.renderer.drawCircle(proj.x, proj.y, proj.size, proj.color);

          // Motion trail
          const trailLength = 15;
          const trailX = proj.x - normalizedVx * trailLength;
          const trailY = proj.y - normalizedVy * trailLength;
          this.renderer.drawLine(trailX, trailY, proj.x, proj.y, this.hexToRgba(trailColor, 0.5), proj.size * 0.6);
          break;
      }
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
    this.entityRenderer.renderPlayerWeapon(player);

    // Attack visualization for melee weapons
    if (player.attackCooldown > 0.3 && !player.isRangedWeapon()) {
      const hitbox = player.getAttackHitbox();
      const impactColor = player.getImpactColor();

      if (impactColor) {
        // Weapon-specific attack effect
        this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius * 1.5, this.hexToRgba(impactColor, 0.2));
        this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius, this.hexToRgba(impactColor, 0.4));

        // Attack arc
        const arcRadius = player.getAttackRange();
        const arcStartAngle = player.facingAngle - 0.6;
        const arcEndAngle = player.facingAngle + 0.6;

        for (let i = 0; i < 10; i++) {
          const t = i / 9;
          const angle = arcStartAngle + (arcEndAngle - arcStartAngle) * t;
          const x = player.x + Math.cos(angle) * arcRadius * 0.8;
          const y = player.y + Math.sin(angle) * arcRadius * 0.8;
          const alpha = 0.3 - t * 0.2;
          this.renderer.drawCircle(x, y, 4, this.hexToRgba(impactColor, alpha));
        }
      } else {
        // Default white effect
        this.renderer.drawCircle(hitbox.x, hitbox.y, hitbox.radius, 'rgba(255, 255, 255, 0.3)');
      }
    }
  }


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

  renderShop(availableWeapons: Weapon[], playerGold: number, currentWeapon: Weapon | null): void {
    this.entityRenderer.renderShop(availableWeapons, playerGold, currentWeapon);
  }
}
