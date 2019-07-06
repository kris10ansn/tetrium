import { Arena } from "./Arena.js";
import { Camera } from "./Camera.js";
import { ISize } from "../utils/ISize";
import { Tetromino } from "../GameObjects/Tetromino.js";
import KeyInput from "./KeyInput.js";

export class Game {
	private ctx: CanvasRenderingContext2D
	private canvas: HTMLCanvasElement

	private arena: Arena
	private camera: Camera
	private keyboard: KeyInput

	private backgroundColor: string = "black"

	public scl: number

	constructor(size: ISize) {
		this.canvas = document.createElement("canvas")
		this.canvas.width = size.width
		this.canvas.height = size.height
		document.body.appendChild(this.canvas)

		this.ctx = this.canvas.getContext("2d")!

		this.scl = this.canvas.width/10
		
		this.keyboard = new KeyInput()
		this.arena = new Arena(this.canvas.width/this.scl, this.canvas.height/this.scl)
		this.camera = new Camera(0, 0, -1)

		const tetromino = new Tetromino(3*this.scl, -4*this.scl, this.scl, size, this.arena.matrix, this.keyboard)
		this.arena.addObject(tetromino)
		
		this.loop(0)
	}

	loop(millis: number) {
		let lastTime: number|null = null
		let accumulator = 0
		const step = 1/60
		
		const callback = (millis?: number) => {
			if(lastTime && millis) {
				accumulator += (millis - lastTime) / 1000

				while (accumulator > step) {
					this.tick()
					accumulator -= step
				}
				this.render()
			}

			if(millis)
				lastTime = millis
			
			requestAnimationFrame(callback)
		}

		callback()
	}

	tick() {
		this.arena.tick()
	}

	render() {
		
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		
		this.ctx.save()
		this.camera.tick(this.ctx)
		
		this.ctx.fillStyle = this.backgroundColor
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.arena.render(this.ctx)
		
		this.ctx.restore()
	}
}