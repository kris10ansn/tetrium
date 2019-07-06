import { Vector2D } from "../utils/Vector.js";

export abstract class GameObject {
	pos: Vector2D
	vel = new Vector2D(0, 0)

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

	set x(value) { this.pos.x = value }
	set y(value) { this.pos.y = value }
}