import { Widget } from "./Widget";
import { Game } from "../Game/Game";
import { Text } from "../Utils/Text";

export class TextWidget extends Widget {
	private font: string;

	constructor(
		x: number,
		y: number,
		public text: string,
		fontName: string,
		fontSize: number,
		private color: string,
		private updateText?: () => any,
	) {
		super(x, y, null, fontSize);
		this.font = `${fontSize}px ${fontName}`;
	}

	public tick(): void {
		if(this.updateText) this.updateText();
	}

	public render(ctx: CanvasRenderingContext2D): void {
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.text, this.x - this.width/2, this.y);
	}

	get width() {
		return Text.measure(this.text, this.font);
	}
}
