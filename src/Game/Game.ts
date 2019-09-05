import { Arena } from "./Arena";
import { Camera } from "./Camera";
import { Tetromino } from "../GameObjects/Tetromino";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { GUI } from "../GUI/GUI";

export class Game {
	private ctx: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;

	private arena: Arena;
	private camera: Camera;
	private keyboard: Keyboard;
	private mouse: Mouse;
	private gui: GUI;

	private backgroundColor: string = "black";
	private paused: boolean = false;

	public scl: number;
	public smooth = true;

	constructor(size: { width: number, height: number }) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = size.width;
		this.canvas.height = size.height;
		document.body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d")!;
		this.camera = new Camera(0, 0, -1);

		this.scl = this.canvas.width / 10;

		this.keyboard = new Keyboard();
		this.mouse = new Mouse(this.canvas);

		this.gui = new GUI(this, this.mouse);

		this.arena = new Arena(
			this.canvas.width / this.scl,
			this.canvas.height / this.scl,
			this
		);
		this.arena.addObject(this.generateTetromino());

		this.loop(0);
	}

	private loop(millis: number) {
		const step = 1 / 60;
		let lastTime: number | null = null;
		let accumulator = 0;

		const callback = (millis?: number) => {
			if (lastTime && millis) {
				accumulator += (millis - lastTime) / 1000;

				while (accumulator > step) {
					this.tick();
					accumulator -= step;
				}
				this.render();
			}

			if (millis) lastTime = millis;

			requestAnimationFrame(callback);
		};

		callback();
	}

	public tick() {
		if(this.paused === false) {
			this.arena.tick();
		}
	}

	public render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.save();
		this.camera.tick(this.ctx);

		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.arena.render(this.ctx);

		this.ctx.restore();

		this.gui.render(this.ctx);
	}

	public pause() {
		this.paused = true;
	}

	public resume() {
		this.paused = false;
	}

	public generateTetromino() {
		return new Tetromino(
			3 * this.scl,
			-4 * this.scl,
			this.scl,
			{ width: this.canvas.width, height: this.canvas.height },
			this.arena,
			this.keyboard,
			this.smooth
		);
	}
}
