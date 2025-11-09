/**
 * MobileControls - Virtual joystick and on-screen buttons for mobile devices
 */

export interface MobileControlsState {
  joystick: {
    active: boolean;
    x: number; // -1 to 1
    y: number; // -1 to 1
    touchId: number | null;
  };
  buttons: {
    attack: boolean;
    dash: boolean;
    interact: boolean;
    loot: boolean;
  };
}

interface Touch {
  identifier: number;
  clientX: number;
  clientY: number;
}

export class MobileControls {
  private canvas: HTMLCanvasElement;
  private state: MobileControlsState;
  private joystickBase = { x: 0, y: 0 };
  private joystickRadius = 60;
  private buttonRadius = 35;
  private activeTouches: Map<number, string> = new Map(); // touchId -> control name

  // Button positions (will be set based on canvas size)
  private buttons = {
    attack: { x: 0, y: 0, label: '⚔️' },
    dash: { x: 0, y: 0, label: '💨' },
    interact: { x: 0, y: 0, label: 'E' },
    loot: { x: 0, y: 0, label: 'F' },
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.state = {
      joystick: { active: false, x: 0, y: 0, touchId: null },
      buttons: { attack: false, dash: false, interact: false, loot: false },
    };

    this.setupTouchListeners();
    this.updateButtonPositions();
  }

  private setupTouchListeners(): void {
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    this.canvas.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });

    // Update button positions on resize
    window.addEventListener('resize', () => this.updateButtonPositions());
  }

  private updateButtonPositions(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const margin = 80;
    const buttonSpacing = 90;

    // Joystick on bottom-left
    this.joystickBase.x = margin + this.joystickRadius;
    this.joystickBase.y = height - margin - this.joystickRadius;

    // Buttons on bottom-right
    this.buttons.attack.x = width - margin - this.buttonRadius;
    this.buttons.attack.y = height - margin - this.buttonRadius;

    this.buttons.dash.x = width - margin - buttonSpacing - this.buttonRadius;
    this.buttons.dash.y = height - margin - this.buttonRadius;

    this.buttons.interact.x = width - margin - this.buttonRadius;
    this.buttons.interact.y = height - margin - buttonSpacing - this.buttonRadius;

    this.buttons.loot.x = width - margin - buttonSpacing - this.buttonRadius;
    this.buttons.loot.y = height - margin - buttonSpacing - this.buttonRadius;
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const pos = this.getTouchPosition(touch);

      // Check if touch is on joystick area (left side)
      if (pos.x < this.canvas.width / 2) {
        if (!this.state.joystick.active) {
          this.state.joystick.active = true;
          this.state.joystick.touchId = touch.identifier;
          this.updateJoystick(pos.x, pos.y);
          this.activeTouches.set(touch.identifier, 'joystick');
        }
      } else {
        // Check buttons (right side)
        const button = this.getButtonAtPosition(pos.x, pos.y);
        if (button) {
          this.state.buttons[button] = true;
          this.activeTouches.set(touch.identifier, button);
        }
      }
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const controlName = this.activeTouches.get(touch.identifier);

      if (controlName === 'joystick' && this.state.joystick.touchId === touch.identifier) {
        const pos = this.getTouchPosition(touch);
        this.updateJoystick(pos.x, pos.y);
      }
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const controlName = this.activeTouches.get(touch.identifier);

      if (controlName === 'joystick' && this.state.joystick.touchId === touch.identifier) {
        this.state.joystick.active = false;
        this.state.joystick.x = 0;
        this.state.joystick.y = 0;
        this.state.joystick.touchId = null;
      } else if (controlName && controlName in this.state.buttons) {
        this.state.buttons[controlName as keyof typeof this.state.buttons] = false;
      }

      this.activeTouches.delete(touch.identifier);
    }
  }

  private getTouchPosition(touch: Touch): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  private updateJoystick(touchX: number, touchY: number): void {
    const dx = touchX - this.joystickBase.x;
    const dy = touchY - this.joystickBase.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      const maxDistance = this.joystickRadius;
      const clampedDistance = Math.min(distance, maxDistance);

      this.state.joystick.x = (dx / distance) * (clampedDistance / maxDistance);
      this.state.joystick.y = (dy / distance) * (clampedDistance / maxDistance);
    } else {
      this.state.joystick.x = 0;
      this.state.joystick.y = 0;
    }
  }

  private getButtonAtPosition(x: number, y: number): keyof typeof this.state.buttons | null {
    for (const [name, button] of Object.entries(this.buttons)) {
      const dx = x - button.x;
      const dy = y - button.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.buttonRadius + 10) {
        return name as keyof typeof this.state.buttons;
      }
    }
    return null;
  }

  getState(): MobileControlsState {
    return { ...this.state };
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Render joystick
    this.renderJoystick(ctx);

    // Render buttons
    this.renderButtons(ctx);
  }

  private renderJoystick(ctx: CanvasRenderingContext2D): void {
    const baseX = this.joystickBase.x;
    const baseY = this.joystickBase.y;

    // Draw base
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(baseX, baseY, this.joystickRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (this.state.joystick.active) {
      // Draw stick
      const stickX = baseX + this.state.joystick.x * this.joystickRadius;
      const stickY = baseY + this.state.joystick.y * this.joystickRadius;

      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#4CAF50';
      ctx.beginPath();
      ctx.arc(stickX, stickY, this.joystickRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderButtons(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    for (const [name, button] of Object.entries(this.buttons)) {
      const isPressed = this.state.buttons[name as keyof typeof this.state.buttons];

      // Draw button background
      ctx.globalAlpha = isPressed ? 0.6 : 0.3;
      ctx.fillStyle = this.getButtonColor(name as keyof typeof this.state.buttons);
      ctx.beginPath();
      ctx.arc(button.x, button.y, this.buttonRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw button label
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(button.label, button.x, button.y);
    }

    ctx.restore();
  }

  private getButtonColor(buttonName: keyof typeof this.state.buttons): string {
    const colors = {
      attack: '#f44336',
      dash: '#2196F3',
      interact: '#FFC107',
      loot: '#4CAF50',
    };
    return colors[buttonName];
  }

  // Check if device is likely mobile/touch
  static isMobileDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }
}
