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

    // Check for dash (keyboard or virtual button)
    const dashPressed = this.input.isKeyPressed('shift') ||
                       this.input.isKeyPressed('shiftleft') ||
                       this.input.isKeyPressed('shiftright') ||
                       this.input.isVirtualButtonPressed('dash');

    if (dashPressed && (movement.x !== 0 || movement.y !== 0)) {
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
    // Check for attack (keyboard, mouse, or virtual button)
    const attackPressed = this.input.isKeyPressed(' ') ||
                         this.input.isMouseButtonPressed(0) ||
                         this.input.isVirtualButtonPressed('attack');

    if (attackPressed) {
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

  // Handle interact action (E key or virtual button)
  handleInteract(): boolean {
    return this.input.isKeyJustPressed('e') || this.input.isVirtualButtonJustPressed('interact');
  }

  // Handle loot action (F key or virtual button)
  handleLoot(): boolean {
    return this.input.isKeyJustPressed('f') || this.input.isVirtualButtonJustPressed('loot');
  }

  private handleRangedAttack(player: Player, isDashShot: boolean): void {
    let pelletCount = player.getPelletCount();
    let spreadAngle = player.getSpread();
    const weaponId = player.weapon?.id || '';

    // Weapon-specific dash attack projectile counts and spread
    if (isDashShot) {
      switch (weaponId) {
        case 'magic_staff':
          // Arcane Barrage - 5 magic missiles
          pelletCount = 5;
          spreadAngle = 0.4;
          break;

        case 'crossbow':
          // Piercing Bolt - single powerful shot
          pelletCount = 1;
          spreadAngle = 0;
          break;

        case 'pistol':
          // Quick Draw - 3 rapid shots
          pelletCount = 3;
          spreadAngle = 0.15;
          break;

        case 'shotgun':
          // Explosive Scatter - way more pellets
          pelletCount = 10;
          spreadAngle = 0.5;
          break;

        case 'assault_rifle':
          // Armor Piercing Burst - 5 shots
          pelletCount = 5;
          spreadAngle = 0.2;
          break;

        case 'plasma_cannon':
          // Plasma Wave - single massive beam
          pelletCount = 1;
          spreadAngle = 0;
          break;

        case 'dragon_breath':
          // Inferno Blast - massive cone of fire
          pelletCount = 8;
          spreadAngle = 0.6;
          break;

        default:
          // Default behavior for other weapons
          if (pelletCount > 1) {
            pelletCount += 2;
          } else {
            pelletCount = 3;
          }
          break;
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
    const weaponId = player.weapon?.id || 'fists';
    let damageMultiplier = isDashShot ? 2.5 : 1.0;
    let hitboxRadius = 20;
    let rangeMultiplier = 1.0;
    let slashColor = player.getImpactColor() || '#E8E8E8';
    let extraSlashes = 0;

    // Weapon-specific dash attack modifications for melee
    if (isDashShot) {
      switch (weaponId) {
        case 'fists':
          // Dash Punch - multiple hits in quick succession
          damageMultiplier = 2.0;
          hitboxRadius = 30;
          rangeMultiplier = 1.2;
          slashColor = '#FFD700';
          extraSlashes = 2; // 3 total hits
          break;

        case 'rusty_sword':
          // Rusty Slash - bleeding effect (more damage)
          damageMultiplier = 3.0;
          rangeMultiplier = 1.3;
          slashColor = '#C75000';
          break;

        case 'iron_sword':
          // Iron Whirlwind - 360 degree spin
          damageMultiplier = 2.8;
          hitboxRadius = 40;
          rangeMultiplier = 1.5;
          slashColor = '#E0E0E0';
          extraSlashes = 3; // Multiple slash visuals in different directions
          break;

        case 'demon_blade':
          // Demonic Fury - massive damage
          damageMultiplier = 4.5;
          rangeMultiplier = 1.4;
          hitboxRadius = 35;
          slashColor = '#D32F2F';
          break;

        default:
          damageMultiplier = 2.5;
          break;
      }

      // Apply dash training damage bonus
      damageMultiplier *= (1 + player.dashDamageBonus);
    }

    // Calculate hitbox with potentially modified range
    const range = player.getAttackRange() * rangeMultiplier;
    const offsetX = Math.cos(player.facingAngle) * range;
    const offsetY = Math.sin(player.facingAngle) * range;
    const hitbox = {
      x: player.x + offsetX,
      y: player.y + offsetY,
      radius: hitboxRadius,
    };

    // Create slash effect with weapon-specific colors
    if (this.particleSystem) {
      this.particleSystem.createSlash(hitbox.x, hitbox.y, player.facingAngle, slashColor);

      // Create extra slashes for multi-hit weapons
      if (extraSlashes > 0 && isDashShot) {
        if (weaponId === 'iron_sword') {
          // 360 degree slashes
          for (let i = 1; i <= extraSlashes; i++) {
            const angle = player.facingAngle + (Math.PI * 2 * i) / (extraSlashes + 1);
            const slashX = player.x + Math.cos(angle) * range;
            const slashY = player.y + Math.sin(angle) * range;
            this.particleSystem.createSlash(slashX, slashY, angle, slashColor);
          }
        } else if (weaponId === 'fists') {
          // Quick succession slashes
          for (let i = 1; i <= extraSlashes; i++) {
            setTimeout(() => {
              if (this.particleSystem) {
                this.particleSystem.createSlash(hitbox.x, hitbox.y, player.facingAngle + (Math.random() - 0.5) * 0.3, slashColor);
              }
            }, i * 50);
          }
        }
      }
    }

    let hitSomething = false;

    for (const enemy of enemies) {
      if (!enemy.alive) continue;

      const dx = enemy.x - hitbox.x;
      const dy = enemy.y - hitbox.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // For 360 degree attacks (iron sword), check distance from player instead
      const checkDistance = (isDashShot && weaponId === 'iron_sword')
        ? Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2)
        : distance;

      if (checkDistance <= hitbox.radius + enemy.size / 2) {
        const prevHealth = enemy.stats.health;
        enemy.takeDamage(player.getAttackDamage() * damageMultiplier);

        // Create hit particles with weapon-specific colors
        if (this.particleSystem && enemy.stats.health < prevHealth) {
          const impactColor = player.getImpactColor() || '#FFD700';
          this.particleSystem.createImpact(enemy.x, enemy.y, impactColor, 6);
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
