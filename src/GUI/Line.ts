import { Widget } from "./Widget";

export class Line extends Widget {
    constructor(
        x: number,
        y: number,
        x2: number,
        y2: number,
        private color: string,
    ) {
        super(x, y, x2 - x, y2 - y);
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);

        ctx.closePath();

        ctx.stroke();
    }

    public tick(): void {}
}
