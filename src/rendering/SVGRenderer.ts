/**
 * SVGRenderer - Handles SVG rendering and element creation
 * Use this to create and manipulate SVG elements
 */

export class SVGRenderer {
    private svg: SVGSVGElement;
    private viewBox = { width: 1000, height: 800 };

    constructor(svgElement: SVGSVGElement) {
        this.svg = svgElement;
        this.svg.setAttribute('viewBox', `0 0 ${this.viewBox.width} ${this.viewBox.height}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    clear(): void {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }

    createGroup(id?: string): SVGGElement {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (id) group.id = id;
        return group;
    }

    createRect(x: number, y: number, width: number, height: number, fill: string = '#333'): SVGRectElement {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', width.toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('fill', fill);
        return rect;
    }

    createCircle(cx: number, cy: number, r: number, fill: string = '#fff'): SVGCircleElement {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx.toString());
        circle.setAttribute('cy', cy.toString());
        circle.setAttribute('r', r.toString());
        circle.setAttribute('fill', fill);
        return circle;
    }

    createText(x: number, y: number, text: string, size: number = 16, fill: string = '#fff'): SVGTextElement {
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x.toString());
        textEl.setAttribute('y', y.toString());
        textEl.setAttribute('fill', fill);
        textEl.setAttribute('font-size', size.toString());
        textEl.setAttribute('font-family', 'Arial, sans-serif');
        textEl.textContent = text;
        return textEl;
    }

    createButton(x: number, y: number, width: number, height: number, label: string, onClick: () => void): SVGGElement {
        const group = this.createGroup();

        const rect = this.createRect(x, y, width, height, '#4CAF50');
        rect.setAttribute('rx', '5');
        rect.setAttribute('cursor', 'pointer');

        const text = this.createText(x + width / 2, y + height / 2 + 5, label, 18, '#fff');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('cursor', 'pointer');

        group.appendChild(rect);
        group.appendChild(text);

        // Prevent multiple rapid clicks with a cooldown flag
        let isProcessing = false;

        const handleClick = () => {
            if (isProcessing) return;
            isProcessing = true;
            onClick();

            // Reset cooldown after a short delay
            setTimeout(() => {
                isProcessing = false;
            }, 300);
        };

        group.addEventListener('click', handleClick);
        group.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClick();
        });

        // Prevent touchend from triggering click event
        group.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        return group;
    }

    append(element: SVGElement): void {
        this.svg.appendChild(element);
    }

    getViewBox() {
        return { ...this.viewBox };
    }
}
