# How to Expand the Rendering System

The rendering system uses SVG for all graphics.

## Creating Custom SVG Components

### Simple Component

```typescript
function createHealthBar(
    renderer: SVGRenderer,
    x: number,
    y: number,
    current: number,
    max: number
): SVGElement {
    const group = renderer.createGroup();

    // Background
    const bg = renderer.createRect(x, y, 200, 20, '#333');
    group.appendChild(bg);

    // Fill
    const fillWidth = (current / max) * 200;
    const fill = renderer.createRect(x, y, fillWidth, 20, '#4CAF50');
    group.appendChild(fill);

    // Text
    const text = renderer.createText(
        x + 100,
        y + 15,
        `${current}/${max}`,
        14,
        '#fff'
    );
    text.setAttribute('text-anchor', 'middle');
    group.appendChild(text);

    return group;
}
```

### Animated Component

```typescript
function createPulsingCircle(
    renderer: SVGRenderer,
    cx: number,
    cy: number
): SVGElement {
    const circle = renderer.createCircle(cx, cy, 30, '#FFD700');

    const animate = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
    );
    animate.setAttribute('attributeName', 'r');
    animate.setAttribute('values', '30;40;30');
    animate.setAttribute('dur', '2s');
    animate.setAttribute('repeatCount', 'indefinite');

    circle.appendChild(animate);
    return circle;
}
```

## Adding New SVG Primitives

Edit `src/rendering/SVGRenderer.ts`:

```typescript
createPolygon(points: string, fill: string = '#fff'): SVGPolygonElement {
    const polygon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
    );
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', fill);
    return polygon;
}

createPath(d: string, stroke: string = '#fff'): SVGPathElement {
    const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );
    path.setAttribute('d', d);
    path.setAttribute('stroke', stroke);
    path.setAttribute('fill', 'none');
    return path;
}
```

## Advanced Components

### Progress Wheel

```typescript
function createProgressWheel(
    renderer: SVGRenderer,
    cx: number,
    cy: number,
    radius: number,
    progress: number // 0-1
): SVGElement {
    const group = renderer.createGroup();

    // Background circle
    const bg = renderer.createCircle(cx, cy, radius, '#333');
    group.appendChild(bg);

    // Progress arc
    const angle = progress * 360;
    const radians = (angle - 90) * Math.PI / 180;
    const x = cx + radius * Math.cos(radians);
    const y = cy + radius * Math.sin(radians);

    const largeArc = angle > 180 ? 1 : 0;

    const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );
    path.setAttribute('d',
        `M ${cx} ${cy - radius}
         A ${radius} ${radius} 0 ${largeArc} 1 ${x} ${y}`
    );
    path.setAttribute('stroke', '#4CAF50');
    path.setAttribute('stroke-width', '10');
    path.setAttribute('fill', 'none');

    group.appendChild(path);
    return group;
}
```

### Icon System

```typescript
// src/rendering/Icons.ts
export class Icons {
    static sword(): string {
        // SVG path data for sword icon
        return 'M10,10 L20,20 M15,10 L20,15';
    }

    static shield(): string {
        return 'M15,5 Q15,15 15,25 Q10,20 5,25 Q5,15 5,5 Q10,3 15,5';
    }
}

// Usage
const swordPath = renderer.createPath(Icons.sword());
```

## Screen Transitions

```typescript
// src/rendering/Transitions.ts
export class Transitions {
    static fadeOut(
        element: SVGElement,
        duration: number,
        callback: () => void
    ): void {
        element.style.opacity = '1';

        const start = performance.now();

        function animate(time: number) {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);

            element.style.opacity = (1 - progress).toString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                callback();
            }
        }

        requestAnimationFrame(animate);
    }
}
```

## Particle Effects

```typescript
class Particle {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number,
        public life: number
    ) {}
}

export class ParticleSystem {
    private particles: Particle[] = [];

    emit(x: number, y: number, count: number): void {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(
                x, y,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                1.0
            ));
        }
    }

    update(deltaTime: number): void {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= deltaTime / 1000;
            return p.life > 0;
        });
    }

    render(renderer: SVGRenderer): void {
        this.particles.forEach(p => {
            const circle = renderer.createCircle(p.x, p.y, 3, '#FFD700');
            circle.style.opacity = p.life.toString();
            renderer.append(circle);
        });
    }
}
```

## Mobile Optimization

```typescript
// Reduce detail on mobile
const isMobile = window.innerWidth < 768;
const detail = isMobile ? 'low' : 'high';

if (detail === 'low') {
    // Simpler graphics
} else {
    // Full detail
}
```

## Best Practices

- Use SVG groups to organize complex components
- Minimize DOM operations (batch updates)
- Reuse elements when possible
- Use CSS transforms for animations
- Test on mobile devices
- Keep rendering functions pure
- Cache expensive calculations
