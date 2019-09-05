import { Vector2D } from "../Utils/Vector";
import { Rectangle } from "../Utils/Rectangle";

export abstract class GUIElement {
	public abstract visible: boolean;
	public bounds: Rectangle;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.bounds = new Rectangle(x, y, width, height);
	}

	abstract tick()	: void
	abstract render(ctx: CanvasRenderingContext2D) : void
}