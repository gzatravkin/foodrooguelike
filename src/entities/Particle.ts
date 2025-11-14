/**
 * Particle - Visual effects particle
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
  gravity?: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  update(deltaTime: number): void {
    // Update all particles using swap-with-last pattern for efficient removal
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Apply gravity if set
      if (p.gravity) {
        p.vy += p.gravity * deltaTime;
      }

      // Decay life
      p.life -= deltaTime;

      // Update alpha based on life remaining
      p.alpha = p.life / p.maxLife;

      // Slow down particles (friction)
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Remove dead particles using swap-with-last for O(1) removal
      if (p.life <= 0) {
        this.particles[i] = this.particles[this.particles.length - 1];
        this.particles.pop();
      }
    }
  }

  getParticles(): Particle[] {
    return this.particles;
  }

  // Create hit impact particles
  createImpact(x: number, y: number, color: string, count: number = 8): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 50 + Math.random() * 100;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3 + Math.random() * 0.2,
        maxLife: 0.5,
        color,
        size: 2 + Math.random() * 2,
        alpha: 1,
        gravity: 100
      });
    }
  }

  // Create slash effect particles
  createSlash(x: number, y: number, angle: number, color: string): void {
    for (let i = 0; i < 12; i++) {
      const spreadAngle = angle + (Math.random() - 0.5) * 0.8;
      const speed = 100 + Math.random() * 150;
      const distance = Math.random() * 20;

      this.particles.push({
        x: x + Math.cos(spreadAngle) * distance,
        y: y + Math.sin(spreadAngle) * distance,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        life: 0.2 + Math.random() * 0.15,
        maxLife: 0.35,
        color,
        size: 1.5 + Math.random() * 2,
        alpha: 1
      });
    }
  }

  // Create blood/damage particles
  createBlood(x: number, y: number, directionX: number, directionY: number): void {
    const count = 6 + Math.floor(Math.random() * 6);

    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(directionY, directionX) + (Math.random() - 0.5) * 1.5;
      const speed = 30 + Math.random() * 80;

      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.7,
        color: '#8B0000',
        size: 2 + Math.random() * 3,
        alpha: 1,
        gravity: 150
      });
    }
  }

  // Create muzzle flash particles for guns
  createMuzzleFlash(x: number, y: number, angle: number): void {
    for (let i = 0; i < 8; i++) {
      const spreadAngle = angle + (Math.random() - 0.5) * 0.6;
      const speed = 150 + Math.random() * 100;

      this.particles.push({
        x,
        y,
        vx: Math.cos(spreadAngle) * speed,
        vy: Math.sin(spreadAngle) * speed,
        life: 0.1 + Math.random() * 0.1,
        maxLife: 0.2,
        color: Math.random() > 0.5 ? '#FFD700' : '#FFA500',
        size: 2 + Math.random() * 2,
        alpha: 1
      });
    }
  }

  // Create enemy death particles
  createDeath(x: number, y: number, color: string): void {
    const count = 20;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 80 + Math.random() * 120;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
        gravity: 200
      });
    }
  }

  clear(): void {
    this.particles = [];
  }
}
