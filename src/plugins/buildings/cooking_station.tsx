/**
 * Cooking Station Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { CookingScreen } from '../../components/screens/CookingScreen';


// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const CookingStationBuilding: BuildingPlugin = {
  id: 'cooking_station',
  name: 'Cooking Station',
  description: 'Cook delicious dishes from gathered ingredients',

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#FF6347',
    walkable: true,
    blocksLight: false,

    // Custom rendering - Stove with cooking pot and fire
    render: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => {
      // Draw floor background
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(worldX, worldY, size, size);

      const time = Date.now() / 1000;

      // Stove base (stone/brick)
      ctx.fillStyle = '#696969';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.5, size * 0.6, size * 0.4);

      // Stove top (metal)
      ctx.fillStyle = '#4a4a4a';
      ctx.fillRect(worldX + size * 0.15, worldY + size * 0.45, size * 0.7, size * 0.1);

      // Cooking pot (centered)
      ctx.fillStyle = '#3a3a3a';
      ctx.beginPath();
      ctx.ellipse(worldX + size / 2, worldY + size * 0.35, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pot rim (lighter metal)
      ctx.strokeStyle = '#5a5a5a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(worldX + size / 2, worldY + size * 0.35, size * 0.2, size * 0.15, 0, 0, Math.PI);
      ctx.stroke();

      // Handles on pot
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = size * 0.05;
      ctx.beginPath();
      ctx.arc(worldX + size * 0.28, worldY + size * 0.35, size * 0.08, Math.PI * 0.7, Math.PI * 1.3);
      ctx.arc(worldX + size * 0.72, worldY + size * 0.35, size * 0.08, Math.PI * 1.7, Math.PI * 0.3);
      ctx.stroke();

      // Fire/heat (animated flames)
      const flame1 = Math.sin(time * 6) * 0.05 + 0.15;
      const flame2 = Math.sin(time * 5 + 1) * 0.05 + 0.15;
      const flame3 = Math.sin(time * 7 + 2) * 0.05 + 0.15;

      // Flame shapes
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.35, worldY + size * 0.55);
      ctx.quadraticCurveTo(worldX + size * 0.33, worldY + size * (0.55 - flame1), worldX + size * 0.35, worldY + size * (0.55 - flame1 * 1.5));
      ctx.quadraticCurveTo(worldX + size * 0.37, worldY + size * (0.55 - flame1), worldX + size * 0.35, worldY + size * 0.55);
      ctx.fill();

      ctx.fillStyle = '#ff9f5e';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.55);
      ctx.quadraticCurveTo(worldX + size * 0.48, worldY + size * (0.55 - flame2), worldX + size * 0.5, worldY + size * (0.55 - flame2 * 1.5));
      ctx.quadraticCurveTo(worldX + size * 0.52, worldY + size * (0.55 - flame2), worldX + size * 0.5, worldY + size * 0.55);
      ctx.fill();

      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.65, worldY + size * 0.55);
      ctx.quadraticCurveTo(worldX + size * 0.63, worldY + size * (0.55 - flame3), worldX + size * 0.65, worldY + size * (0.55 - flame3 * 1.5));
      ctx.quadraticCurveTo(worldX + size * 0.67, worldY + size * (0.55 - flame3), worldX + size * 0.65, worldY + size * 0.55);
      ctx.fill();

      // Steam from pot
      ctx.strokeStyle = `rgba(200, 200, 200, ${0.3 + Math.sin(time * 3) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.45, worldY + size * 0.28);
      ctx.quadraticCurveTo(worldX + size * 0.42, worldY + size * 0.2, worldX + size * 0.4, worldY + size * 0.15);
      ctx.moveTo(worldX + size * 0.55, worldY + size * 0.28);
      ctx.quadraticCurveTo(worldX + size * 0.58, worldY + size * 0.2, worldX + size * 0.6, worldY + size * 0.15);
      ctx.stroke();
    },
  },

  interaction: {
    prompt: 'Press E to Cook',
    interactKey: 'E',
  },

  screen: {
    id: 'cooking',
    component: CookingScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 3, y: 2 },  // Fixed: was swapped
    size: { width: 2, height: 2 },
    priority: 95,
  },
};
