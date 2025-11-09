/**
 * InputHandler - Handles all player input for the game screen
 */

import { InputManager } from '../core/InputManager';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { MapSystem } from '../systems/MapSystem';
import { gameState } from '../core/GameState';
import { entityFactory } from '../entities/EntityFactory';
import { Weapon } from '../entities/types';
import { CombatSystem } from './CombatSystem';
import { ParticleSystem } from '../entities/Particle';

export class InputHandler {
  private particleSystem: ParticleSystem | null = null;

  constructor(
    private input: InputManager,
    private mapSystem: MapSystem,
    private combatSystem: CombatSystem
  ) {}

  setParticleSystem(particleSystem: ParticleSystem): void {
    this.particleSystem = particleSystem;
  }

  handleWeaponSwitching(player: Player): void {
    for (let i = 1; i <= 9; i++) {
      if (this.input.isKeyJustPressed(i.toString())) {
        const weapons = gameState.getState().inventory
          .map(id => entityFactory.getTemplate(id))
          .filter(item => item?.type === 'weapon') as Weapon[];

        if (weapons[i - 1]) {
          const weapon = weapons[i - 1];
          player.equipWeapon(weapon);
          gameState.equipWeapon(weapon.id);
        }
        break;
      }
    }
  }

  handlePlayerMovement(player: Player, deltaTime: number): void {
    const movement = this.input.getMovementVector();

    if ((this.input.isKeyPressed('shift') || this.input.isKeyPressed('shiftleft') || this.input.isKeyPressed('shiftright')) &&
        (movement.x !== 0 || movement.y !== 0)) {
      if (player.canDash()) {
        player.dash(movement.x, movement.y);
      }
    }

    if (movement.x !== 0 || movement.y !== 0) {
      const speed = player.isDashing ? player.stats.speed * 3 : player.stats.speed;
      const dx = player.isDashing ? player.dashDirection.x : movement.x;
      const dy = player.isDashing ? player.dashDirection.y : movement.y;

      const newX = player.x + dx * speed * deltaTime;
      const newY = player.y + dy * speed * deltaTime;

      if (this.mapSystem.canMoveTo(newX, newY, player.size)) {
        player.move(dx, dy, deltaTime);
      } else if (!player.isDashing) {
        if (this.mapSystem.canMoveTo(newX, player.y, player.size)) {
          player.move(movement.x, 0, deltaTime);
        } else if (this.mapSystem.canMoveTo(player.x, newY, player.size)) {
          player.move(0, movement.y, deltaTime);
        }
      }
    } else if (player.isDashing) {
      const dashSpeed = player.stats.speed * 3;
      const newX = player.x + player.dashDirection.x * dashSpeed * deltaTime;
      const newY = player.y + player.dashDirection.y * dashSpeed * deltaTime;

      if (this.mapSystem.canMoveTo(newX, newY, player.size)) {
        player.move(player.dashDirection.x, player.dashDirection.y, deltaTime);
      }
    }
  }

  handlePlayerAttack(player: Player, enemies: Enemy[], deltaTime: number): void {
    if (this.input.isKeyPressed(' ') || this.input.isMouseButtonPressed(0)) {
      if (player.canAttack()) {
        player.attack();

        const isDashShot = player.isDashing;

        if (player.isRangedWeapon()) {
          this.handleRangedAttack(player, isDashShot);
        } else {
          this.handleMeleeAttack(player, enemies, isDashShot);
        }
      }
    }
  }

  private handleRangedAttack(player: Player, isDashShot: boolean): void {
    let pelletCount = player.getPelletCount();
    const spreadAngle = player.getSpread();

    if (isDashShot) {
      if (pelletCount > 1) {
        pelletCount += 2;
      } else {
        pelletCount = 3;
      }
    }

    // Create muzzle flash effect
    if (this.particleSystem) {
      const gunLength = 18;
      const muzzleX = player.x + Math.cos(player.facingAngle) * gunLength;
      const muzzleY = player.y + Math.sin(player.facingAngle) * gunLength;
      this.particleSystem.createMuzzleFlash(muzzleX, muzzleY, player.facingAngle);
    }

    for (let i = 0; i < pelletCount; i++) {
      let spread = 0;
      if (pelletCount > 1) {
        spread = (Math.random() - 0.5) * spreadAngle;
      }
      this.combatSystem.spawnPlayerProjectile(player, player.facingAngle, spread, isDashShot);
    }
  }

  private handleMeleeAttack(player: Player, enemies: Enemy[], isDashShot: boolean): void {
    const hitbox = player.getAttackHitbox();
    const damageMultiplier = isDashShot ? 2.5 : 1.0;

    // Create slash effect
    if (this.particleSystem) {
      this.particleSystem.createSlash(hitbox.x, hitbox.y, player.facingAngle, '#E8E8E8');
    }

    let hitSomething = false;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      const dx = enemy.x - hitbox.x;
      const dy = enemy.y - hitbox.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= hitbox.radius + enemy.size / 2) {
        const prevHealth = enemy.stats.health;
        enemy.takeDamage(player.getAttackDamage() * damageMultiplier);

        // Create hit particles
        if (this.particleSystem && enemy.stats.health < prevHealth) {
          this.particleSystem.createImpact(enemy.x, enemy.y, '#FFD700', 6);
          this.particleSystem.createBlood(enemy.x, enemy.y, dx, dy);
          hitSomething = true;
        }
      }
    }
  }

  update(): void {
    this.input.update();
  }
}
