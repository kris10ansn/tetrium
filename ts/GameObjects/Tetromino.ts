import { GameObject } from "./GameObject.js";
import { tetrominos } from "../utils/tetrominos.js";
import { ISize } from "../utils/ISize.js";
import KeyInput from "../game/KeyInput.js";
import { Arena } from "../game/Arena.js";

export class Tetromino extends GameObject {
	public shape: number[][];
	public color: string;

	private verticalSpeed = 2.6;
	private boost = 2.75;

	private horizontalSpeed = 12;

	private rotateDelay = 9;
	private rotateTimer = 0;

	constructor(
		x: number,
		y: number,
		private scl: number,
		private canvasSize: ISize,
		private arena: Arena,
		private keyboard: KeyInput
	) {
		super(x, y);

		this.vel.set(0, 3);

		const index = Math.floor(Math.random() * tetrominos.length);
		// const index = 4;
		const tetromino = tetrominos[index];
		this.shape = tetromino.matrix.copy();
		this.color = tetromino.color;
		(<any>window).tetromino = this;
	}

	tick() {
		this.handleKeys();

		this.y += this.vel.y;
		if (this.collide()) {
			this.y -= this.vel.y;
			this.y = this.yy * this.scl;
			this.arena.merge(this);
		}

		this.x += this.vel.x;
		if (this.collide()) {
			this.x -= this.vel.x;
		}

		this.x = Math.min(
			this.x,
			this.canvasSize.width - (this.width + this.whitespaceLeft) * this.scl
		);
		this.x = Math.max(this.x, -this.whitespaceLeft * this.scl);

		// *Check for collision*
		// *Move until not colliding*

		if (this.rotateTimer > 0) this.rotateTimer -= 1;
	}

	collide(): boolean {
		let collides =
			this.y + this.height * this.scl + this.whitespaceTop * this.scl >=
				this.canvasSize.height ||
			(this.x + this.whitespaceLeft * this.scl < 0 ||
				this.x + (this.width - this.whitespaceRight) * this.scl >
					this.canvasSize.width);

		// Have to check both floored and ceiled values to ensure you arent
		// halfway into a block
		const xxf = Math.floor(this.x / this.scl);
		const xxc = Math.ceil(this.x / this.scl);

		const yyc = Math.ceil(this.y / this.scl);
		const yyf = Math.floor(this.y / this.scl);

		for (let y = 0; y < this.shape.length; y++) {
			for (let x = 0; x < this.shape[y].length; x++) {
				if (
					this.shape[y][x] !== 0 &&
					// Row exists
					this.arena.matrix[this.yy + y] &&
					(this.arena.matrix[this.yy + y][xxf + x] !== 0 ||
						(this.arena.matrix[yyc + y] &&
							this.arena.matrix[yyc + y][xxc + x] !== 0) ||
						(this.arena.matrix[yyc + y] &&
							this.arena.matrix[yyc + y][xxf + x] !== 0) ||
						this.arena.matrix[this.yy + y][xxc + x] !== 0)
					// this.arena[yy + y][this.xx + x] !== 0
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

	rotate(dir = 1) {
		for (let y = 0; y < this.shape.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[this.shape[x][y], this.shape[y][x]] = [
					this.shape[y][x],
					this.shape[x][y]
				];
			}
		}

		if (dir === 1) {
			this.shape.forEach(row => row.reverse());
		} else {
			this.shape.reverse();
			return;
		}

		const prevx = this.x;
		let offset = 1;
		while (this.collide()) {
			this.x += offset * this.scl;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > this.shape[0].length) {
				this.x = prevx;
				this.rotate(-dir);
				return;
			}
		}
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
			// Distance to perfect tile placement
			const v = Math.round((this.xx * this.scl - this.x) / 3);

			// If the distance to the destination is less than .5 pixels
			// just jump directly to the destination
			this.vel.x = v === 0 ? this.xx * this.scl - this.x : v;
		}

		if (up) {
			if (this.rotateTimer <= 0) {
				this.rotate();
				this.rotateTimer = this.rotateDelay;
			}
		}
	}

	get xx() {
		return Math.round(this.x / this.scl);
	}
	get yy() {
		return Math.round(this.y / this.scl);
	}

	get width() {
		return Math.max(...this.shape.map(row => row.sum()));
	}
	get height() {
		let height = this.shape.length;

		for (let y = 0; y < this.shape.length; y++) {
			if (this.shape[y].sum() === 0) height--;
		}

		return height;
	}

	get whitespaceTop() {
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

	get whitespaceRight() {
		let blanks = 0;

		for (let x = this.shape.length - 1; x >= 0; x--) {
			for (let y = 0; y < this.shape.length; y++) {
				if (this.shape[y][x] !== 0) {
					return blanks;
				}
			}
			blanks++;
		}

		return blanks;
	}

	get whitespaceLeft() {
		let blanks = 0;

		for (let x = 0; x < this.shape.length; x++) {
			for (let y = 0; y < this.shape.length; y++) {
				if (this.shape[y][x] !== 0) {
					return blanks;
				}
			}
			blanks++;
		}

		return blanks;
	}

	get keys() {
		return this.keyboard.keys;
	}
}
