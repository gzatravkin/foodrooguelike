/**
 * WeaponRegistry - File-based weapon registration
 * Add a new weapon by creating a JSON file in src/plugins/weapons/
 */

import { PluginRegistry, Plugin } from '../../core/PluginRegistry';

export interface WeaponPlugin extends Plugin {
  id: string;
  name: string;
  damage: number;
  fireRate: number;
  projectileSpeed: number;
  range: number;
  color?: string;
  size?: number;
  piercing?: boolean;
  spread?: number;
  burstCount?: number;
  description?: string;
}

class WeaponRegistryClass extends PluginRegistry<WeaponPlugin> {}

export const WeaponRegistry = new WeaponRegistryClass();
