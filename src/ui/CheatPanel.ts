/**
 * CheatPanel - Debug panel with cheats and console error display
 */

export interface CheatPanelCallbacks {
  onRestartGame: () => void;
  onAddGold: (amount: number) => void;
}

export class CheatPanel {
  private isOpen: boolean = false;
  private consoleErrors: string[] = [];
  private maxErrors: number = 10;

  constructor(private callbacks: CheatPanelCallbacks) {
    this.setupConsoleErrorCapture();
  }

  private setupConsoleErrorCapture(): void {
    // Capture console errors
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMsg = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      this.addError(`[ERROR] ${errorMsg}`);
      originalError.apply(console, args);
    };

    // Capture console warnings
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const warnMsg = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      this.addError(`[WARN] ${warnMsg}`);
      originalWarn.apply(console, args);
    };

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.addError(`[UNCAUGHT] ${event.message} at ${event.filename}:${event.lineno}`);
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addError(`[PROMISE] ${event.reason}`);
    });
  }

  private addError(error: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.consoleErrors.unshift(`[${timestamp}] ${error}`);

    // Keep only the latest errors
    if (this.consoleErrors.length > this.maxErrors) {
      this.consoleErrors = this.consoleErrors.slice(0, this.maxErrors);
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  isVisible(): boolean {
    return this.isOpen;
  }

  clearErrors(): void {
    this.consoleErrors = [];
  }

  handleClick(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number): void {
    if (!this.isOpen) return;

    const panelWidth = 600;
    const panelHeight = 500;
    const panelX = canvasWidth - panelWidth - 20;
    const panelY = 80;

    // Check if click is inside panel
    if (mouseX < panelX || mouseX > panelX + panelWidth ||
        mouseY < panelY || mouseY > panelY + panelHeight) {
      return;
    }

    // Restart button
    const restartBtnX = panelX + 20;
    const restartBtnY = panelY + 50;
    const restartBtnW = 260;
    const restartBtnH = 40;

    if (mouseX >= restartBtnX && mouseX <= restartBtnX + restartBtnW &&
        mouseY >= restartBtnY && mouseY <= restartBtnY + restartBtnH) {
      this.callbacks.onRestartGame();
      return;
    }

    // Gold buttons
    const goldBtnY = panelY + 100;
    const goldBtnW = 80;
    const goldBtnH = 40;

    const gold100BtnX = panelX + 20;
    if (mouseX >= gold100BtnX && mouseX <= gold100BtnX + goldBtnW &&
        mouseY >= goldBtnY && mouseY <= goldBtnY + goldBtnH) {
      this.callbacks.onAddGold(100);
      return;
    }

    const gold500BtnX = panelX + 110;
    if (mouseX >= gold500BtnX && mouseX <= gold500BtnX + goldBtnW &&
        mouseY >= goldBtnY && mouseY <= goldBtnY + goldBtnH) {
      this.callbacks.onAddGold(500);
      return;
    }

    const gold1000BtnX = panelX + 200;
    if (mouseX >= gold1000BtnX && mouseX <= gold1000BtnX + goldBtnW &&
        mouseY >= goldBtnY && mouseY <= goldBtnY + goldBtnH) {
      this.callbacks.onAddGold(1000);
      return;
    }

    // Clear errors button
    const clearBtnX = panelX + panelWidth - 120;
    const clearBtnY = panelY + 150;
    const clearBtnW = 100;
    const clearBtnH = 30;

    if (mouseX >= clearBtnX && mouseX <= clearBtnX + clearBtnW &&
        mouseY >= clearBtnY && mouseY <= clearBtnY + clearBtnH) {
      this.clearErrors();
      return;
    }
  }

  render(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    if (!this.isOpen) {
      // Draw toggle hint - centered at top below mode indicator to avoid overlaps
      const hintWidth = 170;
      const hintHeight = 30;
      const hintX = (canvasWidth - hintWidth) / 2;
      const hintY = 50;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(hintX, hintY, hintWidth, hintHeight);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(hintX, hintY, hintWidth, hintHeight);

      ctx.fillStyle = '#FFD700';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Press ` for Cheat Panel', canvasWidth / 2, hintY + 20);
      return;
    }

    const panelWidth = 600;
    const panelHeight = 500;
    const panelX = canvasWidth - panelWidth - 20;
    const panelY = 80;

    // Main panel background
    ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CHEAT PANEL', panelX + panelWidth / 2, panelY + 30);

    // Restart button
    this.drawButton(ctx, panelX + 20, panelY + 50, 260, 40, 'Restart Game', '#F44336');

    // Gold buttons
    const goldY = panelY + 100;
    this.drawButton(ctx, panelX + 20, goldY, 80, 40, '+100g', '#4CAF50');
    this.drawButton(ctx, panelX + 110, goldY, 80, 40, '+500g', '#4CAF50');
    this.drawButton(ctx, panelX + 200, goldY, 80, 40, '+1000g', '#4CAF50');

    // Console errors section
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Console Output:', panelX + 20, panelY + 165);

    // Clear errors button
    this.drawButton(ctx, panelX + panelWidth - 120, panelY + 150, 100, 30, 'Clear', '#666', 12);

    // Errors box
    const errorsBoxY = panelY + 190;
    const errorsBoxHeight = 280;
    ctx.fillStyle = '#000';
    ctx.fillRect(panelX + 20, errorsBoxY, panelWidth - 40, errorsBoxHeight);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX + 20, errorsBoxY, panelWidth - 40, errorsBoxHeight);

    // Display errors
    ctx.font = '12px Consolas, monospace';
    ctx.fillStyle = '#0f0';

    if (this.consoleErrors.length === 0) {
      ctx.fillStyle = '#666';
      ctx.fillText('No errors or warnings logged yet...', panelX + 30, errorsBoxY + 25);
    } else {
      const lineHeight = 16;
      const maxLines = Math.floor(errorsBoxHeight / lineHeight) - 1;

      this.consoleErrors.slice(0, maxLines).forEach((error, index) => {
        const y = errorsBoxY + 20 + (index * lineHeight);

        // Color code by type
        if (error.includes('[ERROR]') || error.includes('[UNCAUGHT]')) {
          ctx.fillStyle = '#ff6b6b';
        } else if (error.includes('[WARN]')) {
          ctx.fillStyle = '#ffd93d';
        } else if (error.includes('[PROMISE]')) {
          ctx.fillStyle = '#ff8c42';
        } else {
          ctx.fillStyle = '#6bcf7f';
        }

        // Truncate long lines
        const maxWidth = panelWidth - 60;
        let displayText = error;
        const textWidth = ctx.measureText(error).width;

        if (textWidth > maxWidth) {
          const ratio = maxWidth / textWidth;
          const targetLength = Math.floor(error.length * ratio) - 3;
          displayText = error.substring(0, targetLength) + '...';
        }

        ctx.fillText(displayText, panelX + 30, y);
      });
    }

    // Close hint
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press ` or ESC to close', panelX + panelWidth / 2, panelY + panelHeight - 10);
  }

  private drawButton(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    color: string,
    fontSize: number = 16
  ): void {
    // Button background
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

    // Button border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Button text
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x + width / 2, y + height / 2 + fontSize / 3);
  }
}
