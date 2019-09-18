import { Vector2D } from "../Utils/Vector";
import { Rectangle } from "../Utils/Rectangle";

export abstract class Widget {
	public bounds: Rectangle;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.bounds = new Rectangle(x, y, width, height);
	}

	public abstract tick()	: void
	public abstract render(ctx: CanvasRenderingContext2D) : void

	
	public get x() { return this.bounds.x }
	public get y() { return this.bounds.y }
	public get width() { return this.bounds.width }
	public get height() { return this.bounds.height }

	public set x(value) { this.bounds.x = value }
	public set y(value) { this.bounds.y = value }
	public set width(value) { this.bounds.width = value }
	public set height(value) { this.bounds.height = value }
}