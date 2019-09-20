import { GameObject } from "../GameObjects/GameObject";
import { Tetromino } from "../GameObjects/Tetromino";
import Matrix from "../Utils/Matrix";
import { Game } from "./Game";
import { Color } from "../Utils/Color";

export class Arena {
	public matrix: Matrix<number>;

	private objects = Array<GameObject>();
	private offset = 0;
	private yv = 0;
	private break = null;

	private score = 0;

	constructor(width: number, height: number, private game: Game) {
		const state = game.storage.getItem("state");
		this.matrix = state && state.arena? state.arena : Matrix<number>(width, height, 0);
	}

	public tick() {
		this.objects.forEach(object => {
			object.tick();
		});

		let cleared = 0;
		this.matrix.forEach((row, i) => {
			if (row.every(val => val > 0)) {
				this.clearLine(i);
				this.score *= 1.5;
				this.score += 75;
				cleared++;
			}
		});

		if (cleared > 0) {
			this.game.score += Math.round(this.score);
			this.score = 0;
			this.updateState();
		}

		// Increment if less than 0
		this.offset = Math.min(0, this.offset + this.yv);
		this.break = this.offset === 0 ? null : this.break;
		this.yv = this.offset === 0 ? 0 : this.yv;
	}

	public render(ctx: CanvasRenderingContext2D) {
		this.objects.forEach(object => {
			object.render(ctx);
		});
		this.matrix.forEach((row, y) => {
			row.forEach((val, x) => {
				if (val > 0) {
					let offset: number;

					// If there is supposed to be a break
					// and this row is above it, set the offset
					// to the offset property, else 0.
					if (this.break !== null && y < this.break) {
						offset = this.offset;
					} else {
						offset = 0;
					}

					ctx.fillStyle = Color.fromNumber(val);
					ctx.fillRect(
						x * this.game.scl,
						offset + y * this.game.scl,
						this.game.scl,
						this.game.scl
					);
				}
			});
		});
	}

	private clearLine(i: number) {
		this.matrix.splice(i, 1);
		const row = new Array(this.matrix[0].length).fill(0);
		this.matrix.unshift(row);

		if (this.game.smooth) {
			this.offset -= this.game.scl;
			this.break = i + 1;

			if (this.yv === 0) {
				this.yv += 4;
			} else {
				this.yv += 1.5;
			}
		}
	}

	private updateState() {
		this.game.storage.setItem(
			"state",
			Object.assign(this.game.storage.getItem("state") || {}, {
				arena: this.matrix.copy()
			})
		);
	}

	public addObject(object: GameObject) {
		this.objects.push(object);
	}

	public removeObject(object: GameObject) {
		this.objects.remove(object);
	}

	public merge(tetromino: Tetromino) {
		const { shape, color, xx, yy } = tetromino;

		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[0].length; x++) {
				if (shape[y][x] !== 0) {
					try {
						this.matrix[yy + y][xx + x] = Color.toNumber(color);
					} catch (e) {
						return;
					}
				}
			}
		}

		this.removeObject(tetromino);
		this.addObject(this.game.generateTetromino());
		this.updateState();

		for(let i = 0; i < 4; i++) {
			if(this.matrix[i].sum() > 0) {
				this.game.die();
				return;
			}
		}
	}
}
