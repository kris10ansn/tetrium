import { Button } from "./Button";
import { Mouse } from "../Game/Mouse";
import { ImageReference } from "./ImageReference";

export class ImageButton extends Button {
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        mouse: Mouse,
        public imageRef: ImageReference,
        onclick: (event: MouseEvent) => any,
    ) {
        super(x, y, width, height, mouse, onclick);
    }

    public tick(): void {}

    public render(ctx: CanvasRenderingContext2D): void {
        if (this.hover) {
            ctx.fillStyle = "gray";
            ctx.globalAlpha = 0.5;
            ctx.fillRoundedRect(this.x, this.y, this.width, this.height, 10);

            ctx.globalAlpha = 1;
        }

        ctx.drawImage(
            this.imageRef.image,
            this.x,
            this.y,
            this.width,
            this.height,
        );
    }
}
