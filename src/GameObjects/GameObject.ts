import { Vector2D } from "../Utils/Vector.js";

export abstract class GameObject {
	protected pos: Vector2D
	protected vel = new Vector2D(0, 0)

	constructor(
		x: number,
		y: number,
	) {
		this.pos = new Vector2D(x, y)
	}

	abstract tick()	: void
	abstract render(ctx: CanvasRenderingContext2D) : void

	getClass() : string { return this.constructor.name }

	get x() { return this.pos.x }
	get y() { return this.pos.y }

	set x(val) { this.pos.x = val }
	set y(val) { this.pos.y = val }
}