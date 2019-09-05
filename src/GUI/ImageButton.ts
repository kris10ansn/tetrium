import { Button } from "./Button";
import { Mouse } from "../Game/Mouse";

export class ImageButton extends Button {
	public image: HTMLImageElement;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		mouse: Mouse,
		imagePath: string,
		onclick: (event: MouseEvent) => any,
	) {
		super(x, y, width, height, mouse, onclick);

		this.image = new Image();
		this.image.src = imagePath;
	}

	public tick(): void {}
	
	public render(ctx: CanvasRenderingContext2D): void {
		if(this.hover) {
			ctx.fillStyle = "gray";
			ctx.globalAlpha = 0.5;
			ctx.fillRoundedRect(this.x, this.y, this.width, this.height, 10);
			
			ctx.globalAlpha = 1;
		}

		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}

	get x() { return this.bounds.x }
	get y() { return this.bounds.y }
	get width() { return this.bounds.width }
	get height() { return this.bounds.height }

	set x(value) { this.bounds.x = value }
	set y(value) { this.bounds.y = value }
	set width(value) { this.bounds.width = value }
	set height(value) { this.bounds.height = value }
}