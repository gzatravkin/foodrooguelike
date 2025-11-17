/**
 * Upgrades Hall Building
 * EVERYTHING in one file: tile appearance, interaction, screen component, placement
 */

import { BuildingPlugin } from '../BuildingRegistry';
import { UpgradesScreen } from '../../components/screens/UpgradesScreen';


// =============================================================================
// BUILDING DEFINITION
// =============================================================================

export const UpgradesHallBuilding: BuildingPlugin = {
  id: 'upgrades_hall',
  name: 'Upgrades Hall',
  description: 'Purchase permanent upgrades for your kitchen, restaurant, and character',

  // TileType is AUTO-ASSIGNED at registration - no manual enum needed!

  tile: {
    color: '#9370DB',
    walkable: true,
    blocksLight: false,

    // Custom rendering - Magical upgrade altar with crystals
    render: (ctx: CanvasRenderingContext2D, worldX: number, worldY: number, size: number) => {
      // Draw floor background
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(worldX, worldY, size, size);

      const time = Date.now() / 1000;

      // Altar base (stone)
      ctx.fillStyle = '#696969';
      ctx.fillRect(worldX + size * 0.25, worldY + size * 0.6, size * 0.5, size * 0.3);

      // Altar top
      ctx.fillStyle = '#808080';
      ctx.fillRect(worldX + size * 0.2, worldY + size * 0.55, size * 0.6, size * 0.08);

      // Central crystal (glowing)
      const crystalGlow = Math.sin(time * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(147, 112, 219, ${crystalGlow})`;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.25);
      ctx.lineTo(worldX + size * 0.45, worldY + size * 0.45);
      ctx.lineTo(worldX + size * 0.55, worldY + size * 0.45);
      ctx.closePath();
      ctx.fill();

      // Crystal facets
      ctx.strokeStyle = `rgba(186, 85, 211, ${crystalGlow})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.25);
      ctx.lineTo(worldX + size * 0.5, worldY + size * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.47, worldY + size * 0.35);
      ctx.lineTo(worldX + size * 0.53, worldY + size * 0.35);
      ctx.stroke();

      // Left smaller crystal
      ctx.fillStyle = `rgba(138, 43, 226, ${crystalGlow * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.3, worldY + size * 0.4);
      ctx.lineTo(worldX + size * 0.27, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.33, worldY + size * 0.5);
      ctx.closePath();
      ctx.fill();

      // Right smaller crystal
      ctx.fillStyle = `rgba(138, 43, 226, ${crystalGlow * 0.8})`;
      ctx.beginPath();
      ctx.moveTo(worldX + size * 0.7, worldY + size * 0.38);
      ctx.lineTo(worldX + size * 0.67, worldY + size * 0.5);
      ctx.lineTo(worldX + size * 0.73, worldY + size * 0.5);
      ctx.closePath();
      ctx.fill();

      // Magical particles/sparkles
      for (let i = 0; i < 5; i++) {
        const angle = (time * 1.5 + i * Math.PI * 2 / 5) % (Math.PI * 2);
        const radius = size * 0.25;
        const particleX = worldX + size * 0.5 + Math.cos(angle) * radius;
        const particleY = worldY + size * 0.35 + Math.sin(angle) * radius * 0.5;
        const particleAlpha = Math.sin(time * 3 + i) * 0.5 + 0.5;

        ctx.fillStyle = `rgba(255, 215, 0, ${particleAlpha})`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, size * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }

      // Upgrade arrow symbol on altar
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      // Arrow shaft
      ctx.fillRect(worldX + size * 0.47, worldY + size * 0.65, size * 0.06, size * 0.15);
      // Arrow head
      ctx.moveTo(worldX + size * 0.5, worldY + size * 0.6);
      ctx.lineTo(worldX + size * 0.42, worldY + size * 0.68);
      ctx.lineTo(worldX + size * 0.58, worldY + size * 0.68);
      ctx.closePath();
      ctx.fill();

      // Rune circles
      ctx.strokeStyle = `rgba(147, 112, 219, ${crystalGlow * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(worldX + size * 0.5, worldY + size * 0.5, size * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    },
  },

  interaction: {
    prompt: 'Press E to enter Upgrades Hall',
    interactKey: 'E',
  },

  screen: {
    id: 'upgrades',
    component: UpgradesScreen,
  },

  baseCamp: {
    enabled: true,
    position: { x: 17, y: 16 },  // Fixed: was swapped
    size: { width: 2, height: 2 },
    priority: 85,
  },
};
