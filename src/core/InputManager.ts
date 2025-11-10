/**
 * InputManager - Handles keyboard, mouse, and mobile touch input
 */

export type KeyState = {
  pressed: boolean;
  justPressed: boolean;
  justReleased: boolean;
};

export class InputManager {
  private keys: Map<string, KeyState> = new Map();
  private mousePos = { x: 0, y: 0 };
  private mouseButtons: Map<number, KeyState> = new Map();

  // Mobile/virtual input
  private virtualMovement = { x: 0, y: 0 };
  private virtualButtons: Map<string, KeyState> = new Map();
  private isMobile = false;

  constructor() {
    this.setupListeners();
    this.detectMobile();
  }

  private detectMobile(): void {
    this.isMobile = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }

  isMobileDevice(): boolean {
    return this.isMobile;
  }

  private setupListeners(): void {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    const state = this.keys.get(key) || { pressed: false, justPressed: false, justReleased: false };

    if (!state.pressed) {
      state.justPressed = true;
    }
    state.pressed = true;
    this.keys.set(key, state);
  }

  private handleKeyUp(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    const state = this.keys.get(key) || { pressed: false, justPressed: false, justReleased: false };

    state.pressed = false;
    state.justReleased = true;
    this.keys.set(key, state);
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;
  }

  private handleMouseDown(e: MouseEvent): void {
    const state = this.mouseButtons.get(e.button) || { pressed: false, justPressed: false, justReleased: false };

    if (!state.pressed) {
      state.justPressed = true;
    }
    state.pressed = true;
    this.mouseButtons.set(e.button, state);
  }

  private handleMouseUp(e: MouseEvent): void {
    const state = this.mouseButtons.get(e.button) || { pressed: false, justPressed: false, justReleased: false };

    state.pressed = false;
    state.justReleased = true;
    this.mouseButtons.set(e.button, state);
  }

  isKeyPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase())?.pressed || false;
  }

  isKeyJustPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase())?.justPressed || false;
  }

  isKeyJustReleased(key: string): boolean {
    return this.keys.get(key.toLowerCase())?.justReleased || false;
  }

  getMousePos(): { x: number; y: number } {
    return { ...this.mousePos };
  }

  isMouseButtonPressed(button: number = 0): boolean {
    return this.mouseButtons.get(button)?.pressed || false;
  }

  update(): void {
    // Reset just pressed/released states
    this.keys.forEach((state) => {
      state.justPressed = false;
      state.justReleased = false;
    });

    this.mouseButtons.forEach((state) => {
      state.justPressed = false;
      state.justReleased = false;
    });

    this.virtualButtons.forEach((state) => {
      state.justPressed = false;
      state.justReleased = false;
    });
  }

  // Helper methods for common input patterns
  getMovementVector(): { x: number; y: number } {
    // Use virtual joystick if active
    if (this.virtualMovement.x !== 0 || this.virtualMovement.y !== 0) {
      return { ...this.virtualMovement };
    }

    const vec = { x: 0, y: 0 };

    // WASD movement
    if (this.isKeyPressed('w') || this.isKeyPressed('arrowup')) vec.y -= 1;
    if (this.isKeyPressed('s') || this.isKeyPressed('arrowdown')) vec.y += 1;
    if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) vec.x -= 1;
    if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) vec.x += 1;

    // Normalize diagonal movement
    if (vec.x !== 0 && vec.y !== 0) {
      const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
      vec.x /= length;
      vec.y /= length;
    }

    return vec;
  }

  // Mobile control integration
  setVirtualJoystick(x: number, y: number): void {
    this.virtualMovement.x = x;
    this.virtualMovement.y = y;
  }

  setVirtualButton(button: string, pressed: boolean): void {
    const state = this.virtualButtons.get(button) || { pressed: false, justPressed: false, justReleased: false };

    if (pressed && !state.pressed) {
      state.justPressed = true;
    } else if (!pressed && state.pressed) {
      state.justReleased = true;
    }

    state.pressed = pressed;
    this.virtualButtons.set(button, state);
  }

  isVirtualButtonPressed(button: string): boolean {
    return this.virtualButtons.get(button)?.pressed || false;
  }

  isVirtualButtonJustPressed(button: string): boolean {
    return this.virtualButtons.get(button)?.justPressed || false;
  }
}
