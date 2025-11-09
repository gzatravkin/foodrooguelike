/**
 * ShopManager - Manages the weapon shop interface and transactions
 */

import { InputManager } from '../core/InputManager';
import { Player } from '../entities/Player';
import { entityFactory } from '../entities/EntityFactory';
import { Weapon } from '../entities/types';

export class ShopManager {
  private shopOpen: boolean = false;
  private availableWeapons: Weapon[] = [];

  constructor(private input: InputManager) {}

  isShopOpen(): boolean {
    return this.shopOpen;
  }

  getAvailableWeapons(): Weapon[] {
    return this.availableWeapons;
  }

  openShop(): void {
    this.shopOpen = true;
    this.availableWeapons = entityFactory.getAllOfType('weapon') as Weapon[];
  }

  closeShop(): void {
    this.shopOpen = false;
  }

  handleShopInput(player: Player): void {
    if (this.input.isKeyJustPressed('escape') || this.input.isKeyJustPressed('e')) {
      this.closeShop();
      return;
    }

    for (let i = 1; i <= 9; i++) {
      if (this.input.isKeyJustPressed(i.toString())) {
        const weapon = this.availableWeapons[i - 1];
        if (weapon && player.gold >= weapon.cost) {
          import('../systems/ShopSystem').then(({ shopSystem }) => {
            shopSystem.buyWeapon(weapon.id);
          });
        }
        break;
      }
    }
  }
}
