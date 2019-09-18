import { Arena } from "./Arena";
import { Camera } from "./Camera";
import { Tetromino } from "../GameObjects/Tetromino";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { GUI } from "../GUI/GUI";
import { StorageHandler } from "../Utils/StorageHandler";

export class Game {
	public canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private arena: Arena;
	private camera: Camera;
	private keyboard: Keyboard;
	private mouse: Mouse;
	private gui: GUI;

	private backgroundColor: string = "black";
	private paused: boolean = false;

	public scl: number;
	public smooth = true;

	public storage = new StorageHandler();

	private _score: number = 0;
	private _highscore: number = this.storage.getItem("hscore") || 0;

	constructor(size: { width: number; height: number }) {
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

		const state = this.storage.getItem("state");
		const x = state && state.tetromino? state.tetromino.x : null;
		const y = state && state.tetromino? state.tetromino.y : null;
		const shape = state && state.tetromino? state.tetromino.shapeIndex : null;
		const rotation = state && state.tetromino? state.tetromino.rotation : null;

		this.arena.addObject(
			this.generateTetromino(x, y, { shapeIndex: shape, rotation: rotation })
		);

		this._score = state && state.score? state.score : 0;

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
		if (this.paused === false) {
			this.arena.tick();
		}

		if (this.score > this.highscore) {
			this.highscore = this.score;
		}

		this.gui.tick();
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

	public die() {
		this.pause();
	}

	public pause() {
		this.paused = true;
	}

	public resume() {
		this.paused = false;
	}

	public restart() {
		// Prevents objects from ticking and thereby updating state.
		this.pause();

		this.clearState();
		window.location.reload();
	}

	public generateTetromino(
		x?: number,
		y?: number,
		options?: { shapeIndex?: number; rotation?: number }
	) {
		return new Tetromino(
			x == null? 3 * this.scl : x,
			y == null? -4 * this.scl : y,
			this.scl,
			{ width: this.canvas.width, height: this.canvas.height },
			this.arena,
			this.keyboard,
			this,
			this.smooth,
			options || {}
		);
	}

	public clearState() {
		this.storage.setItem("state", {});
	}

	public get score() {
		return this._score;
	}

	public set score(value) {
		this._score = value;

		this.storage.setItem(
			"state",
			Object.assign(this.storage.getItem("state") || {}, {
				score: value
			})
		);
	}

	public get highscore() {
		return this._highscore;
	}

	public set highscore(value) {
		this._highscore = value;
		this.storage.setItem("hscore", this._highscore);
	}
}
