/**
 * EntityRenderer - Handles entity rendering (player, enemies, projectiles, etc.)
 */

import { CanvasRenderer } from '../rendering/CanvasRenderer';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Projectile } from '../entities/Projectile';
import { Corpse } from '../entities/Corpse';
import { Trap } from '../entities/Trap';
import { Particle } from '../entities/Particle';
import { Weapon } from '../entities/types';

export class EntityRenderer {
  constructor(private renderer: CanvasRenderer) {}

  public renderPlayerWeapon(player: Player): void {
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

  public drawHealthBar(x: number, y: number, health: number, maxHealth: number): void {
    const barWidth = 40;
    const barHeight = 6;
    const healthPercent = health / maxHealth;

    this.renderer.drawRect(x - barWidth / 2, y, barWidth, barHeight, '#333');

    const healthWidth = barWidth * healthPercent;
    const healthColor = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
    this.renderer.drawRect(x - barWidth / 2, y, healthWidth, barHeight, healthColor);

    this.renderer.drawLine(x - barWidth / 2, y, x + barWidth / 2, y, '#000', 1);
    this.renderer.drawLine(x - barWidth / 2, y + barHeight, x + barWidth / 2, y + barHeight, '#000', 1);
  
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
