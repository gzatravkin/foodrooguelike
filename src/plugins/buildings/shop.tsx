/**
 * Shop Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { ShopScreen } from '../../components/screens/ShopScreen';


// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const ShopBuilding: BuildingPlugin = {
  id: 'shop',
  name: 'Shop',
  description: 'Buy weapons and equipment to prepare for expeditions',

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#FFD700',
    walkable: true,
    blocksLight: false,

    // Custom rendering - Shop with gold coin/bag
    render: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => {
      // Draw floor background
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(worldX, worldY, size, size);

      // Shop counter (wooden)
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(worldX + size * 0.15, worldY + size * 0.5, size * 0.7, size * 0.35);

      // Counter top
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(worldX + size * 0.1, worldY + size * 0.48, size * 0.8, size * 0.08);

      // Gold coins display
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.35, worldY + size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.28, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(worldX + size * 0.65, worldY + size * 0.32, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // Money bag
      ctx.fillStyle = '#8B7355';
      ctx.beginPath();
      ctx.ellipse(worldX + size * 0.5, worldY + size * 0.65, size * 0.12, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bag tie
      ctx.fillStyle = '#654321';
      ctx.fillRect(worldX + size * 0.47, worldY + size * 0.52, size * 0.06, size * 0.05);

      // Dollar sign on bag
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${size * 0.2}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', worldX + size * 0.5, worldY + size * 0.68);
    },
  },

  interaction: {
    prompt: 'Press E to enter Shop',
    interactKey: 'E',
  },

  screen: {
    id: 'shop',
    component: ShopScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 17, y: 2 },
    size: { width: 2, height: 2 },
    priority: 100,
  },
};
