import { GameObject } from "./GameObject.js";
import { Tetrominos } from "../utils/tetrominos.js";
import KeyInput from "../game/KeyInput.js";
import { ISize } from "../utils/ISize.js";
import { Vector2D } from "../utils/Vector.js";
import { Arena } from "../game/Arena.js";
import Matrix from "../utils/Matrix.js";

//! Rethink everything?
//? Idea:
//- Make game "choppy" like before
//- Draw at smooth position, but calculate choppy position
//- Dont allow smooth position to go lower/more to the left/rigth than "choppy" pos

export class Tetromino extends GameObject {
	private shape: number[][];
	private color: string;

	private verticalSpeed = 2.6;
	private boost = 2.75;

	private horizontalSpeed = 12;

	private rotateDelay = 10;
	private rotateTimer = 0;

	constructor(
		x: number,
		y: number,
		private scl: number,
		private canvasSize: ISize,
		private arena: Array<Array<number>>,
		private keyboard: KeyInput
	) {
		super(x, y);

		this.vel.set(0, 3);

		// const tetromino = Tetrominos[Math.floor(Math.random() * Tetrominos.length)]
		const tetromino = Tetrominos[2];
		this.shape = tetromino.matrix.copy();
		this.color = tetromino.color;

		console.log("sy", this.sy)
	}

	first = false;
	tick() {
		this.handleKeys();

		this.pos.y += this.vel.y;
		if (this.collide()) {
			this.pos.y -= this.vel.y;
			this.pos.set(this.xx * this.scl, this.yy * this.scl);
		}

		this.pos.x += this.vel.x;
		if (this.collide()) {
			this.pos.x -= this.vel.x;

			if (!this.first) {
				console.log(this);
			}

			this.first = true;
		}

		// *Check for collision*
		// *Move until not colliding*

		if (this.rotateTimer > 0) this.rotateTimer -= 1;
	}

	collide(): boolean {
		// let collides = this.yy + this.sy + this.height > this.arena.length;
		let collides =
			this.y + (this.height * this.scl) + (this.sy * this.scl) >=
			this.canvasSize.height;

		for (let y = 0; y < this.shape.length; y++) {
			for (let x = 0; x < this.shape[y].length; x++) {
				if (
					this.shape[y][x] !== 0 &&
					this.arena[this.yy + y] && //Checking if row exists
					this.arena[this.yy + y][this.xx + x] !== 0
				) {
					collides = true;
				}
			}
		}
		return collides;
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.translate(Math.round(this.x), Math.round(this.y));
		ctx.fillStyle = this.color;

		this.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value === 1) {
					ctx.fillRect(
						x * this.scl,
						y * this.scl,
						this.scl,
						this.scl
					);
				}
			});
		});

		ctx.restore();
	}

	rotate() {
		if (this.rotateTimer > 0) {
			return;
		} else {
			this.rotateTimer = this.rotateDelay;
		}

		for (let y = 0; y < this.shape.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[this.shape[x][y], this.shape[y][x]] = [
					this.shape[y][x],
					this.shape[x][y]
				];
			}
		}

		this.shape.forEach(row => {
			row.reverse();
		});

		console.log("sy", this.sy)
	}

	handleKeys() {
		const up = this.keys.get("w") || this.keys.get("arrowup");
		const left = this.keys.get("a") || this.keys.get("arrowleft");
		const down = this.keys.get("s") || this.keys.get("arrowdown");
		const right = this.keys.get("d") || this.keys.get("arrowright");

		if (down) {
			this.vel.y = Math.pow(this.verticalSpeed, this.boost);
		} else {
			this.vel.y = this.verticalSpeed;
		}

		if (left) {
			this.vel.x = -this.horizontalSpeed;
		} else if (right) {
			this.vel.x = this.horizontalSpeed;
		} else {
			this.vel.x = (this.xx * this.scl - this.x) / 3;
		}

		if (up) {
			this.rotate();
		}
	}

	get xx() {
		return Math.round(this.x / this.scl);
	}
	get yy() {
		return Math.round(this.y / this.scl);
	}

	get width() {
		let width = Math.max(...this.shape.map(row => row.sum()));

		return width;
	}
	get height() {
		let height = this.shape.length;

		for (let y = 0; y < this.shape.length; y++) {
			if (this.shape[y].sum() === 0) height--;
		}

		return height;
	}

	// Shape x in array
	get sx() {
		return 0;
	}

	// Shape y in array
	get sy() {
		let y = 0;

		for (let i = 0; i < this.shape.length; i++) {
			if (this.shape[i].sum() === 0) {
				y++;
			} else {
				break;
			}
		}

		return y;
	}

	get keys() {
		return this.keyboard.keys;
	}
}
