import { Vector3D } from "../Utils/Vector.js"

export class Camera {
	private pos: Vector3D

	constructor(x: number, y: number, z: number) {
		this.pos = new Vector3D(x, y, z)
	}

	tick(ctx: CanvasRenderingContext2D) {
		ctx.scale(this.z * -1, this.z * -1)
		ctx.translate(
			(-ctx.canvas.width/((this.z * -1)*2)) * ((this.z * -1)-1), 
			(-ctx.canvas.height/((this.z * -1)*2)) * ((this.z * -1)-1)
		)
		ctx.translate(this.x, this.y)
	}

	zoom(amount: number) {
		this.z += amount
		this.z += amount
	}

	get x() { return this.pos.x }
	get y() { return this.pos.y }
	get z() { return this.pos.z }

	
	set x(value) { this.pos.x = value }
	set y(value) { this.pos.y = value }
	set z(value) { this.pos.z = value }
}