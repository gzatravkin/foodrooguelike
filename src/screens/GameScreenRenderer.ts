/**
 * GameScreenRenderer - Handles all rendering for the game screen
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { TileRenderer } from '../rendering/TileRenderer';
import { EntityRenderer } from '../rendering/EntityRenderer';
import { UIRenderer } from './UIRenderer';
import { ProjectileRenderer } from './ProjectileRenderer';
import { GameMap, TileType } from '../systems/MapSystem';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { Trap } from '../entities/Trap';
import { GameMode } from './GameModeManager';
import { Weapon } from '../entities/types';
import { Particle } from '../entities/Particle';
import { NPCClient } from '../entities/NPCClient';

export class GameScreenRenderer {
  private tileRenderer: TileRenderer;
  private entityRenderer: EntityRenderer;
  private uiRenderer: UIRenderer;
  private projectileRenderer: ProjectileRenderer;

  constructor(private renderer: CanvasRenderer) {
    this.tileRenderer = new TileRenderer(renderer);
    this.entityRenderer = new EntityRenderer(renderer);
    this.uiRenderer = new UIRenderer(renderer);
    this.projectileRenderer = new ProjectileRenderer(renderer);
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

  renderNPCs(npcs: NPCClient[]): void {
    for (const npc of npcs) {
      const color = npc.clientData?.color || npc.color || '#FF6B6B';
      this.renderDiningPatron(npc.x, npc.y, npc.size, color, npc.facingAngle);
    }
  }

  private renderDiningPatron(x: number, y: number, size: number, color: string, facingAngle: number): void {
    const ctx = this.renderer.getContext();
    const camera = this.renderer.getCamera();
    ctx.save();
    ctx.translate(x - camera.x, y - camera.y);
    ctx.rotate(facingAngle);

    // Body (simple robe/dress shape)
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.3, size * 0.6, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (peach/skin tone circle)
    ctx.fillStyle = '#ffdbac';
    ctx.beginPath();
    ctx.arc(0, -size * 0.3, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Hair (darker shade)
    ctx.fillStyle = this.darkenColor(color, 0.3);
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.35, 0, Math.PI);
    ctx.fill();

    // Simple facial features (two dots for eyes)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.3, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.3, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Arms/hands holding utensils
    ctx.strokeStyle = '#ffdbac';
    ctx.lineWidth = size * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, size * 0.2);
    ctx.lineTo(-size * 0.7, size * 0.5);
    ctx.moveTo(size * 0.5, size * 0.2);
    ctx.lineTo(size * 0.7, size * 0.5);
    ctx.stroke();

    // Fork in left hand
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, size * 0.5);
    ctx.lineTo(-size * 0.75, size * 0.7);
    ctx.stroke();

    // Knife in right hand
    ctx.beginPath();
    ctx.moveTo(size * 0.7, size * 0.5);
    ctx.lineTo(size * 0.75, size * 0.7);
    ctx.stroke();

    ctx.restore();
  }

  private darkenColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);
    return `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;
  }

  renderProjectiles(projectiles: Projectile[]): void {
    this.projectileRenderer.renderProjectiles(projectiles);
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
    inventory: string[] = [],
    isMobile: boolean = false
  ): void {
    this.uiRenderer.renderUI(player, mode, enemies, corpses, showInteractionPrompt, interactionPromptText, combatLog, inventory, isMobile);
  }

  renderShop(availableWeapons: Weapon[], playerGold: number, currentWeapon: Weapon | null): void {
    this.entityRenderer.renderShop(availableWeapons, playerGold, currentWeapon);
  }
}
