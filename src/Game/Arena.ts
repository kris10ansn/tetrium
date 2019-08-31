import { GameObject } from "../GameObjects/GameObject.js";
import { Tetromino } from "../GameObjects/Tetromino.js";
import Matrix from "../Utils/Matrix.js";
import { Game } from "./Game.js";
import { Color } from "../Utils/Color.js"

export class Arena {
	public matrix: Matrix<number>;
	
	private objects = Array<GameObject>();
	private offset = 0;
	private break = null;

	constructor(width: number, height: number, private game: Game) {
		this.matrix = Matrix<number>(width, height, 0);
	}

	public tick() {
		this.objects.forEach(object => {
			object.tick();
		});

		for(let i = this.matrix.length-1; i >= 0; i--) {
			if(this.matrix[i].every(val => val > 0)) {
				this.clearLine(i);
				break;
			}
		}

		// Increment if less than 0
		this.offset = Math.min(0, this.offset + 6.5);
		this.break = this.offset === 0? null : this.break;
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
					if(this.break !== null && y < this.break) {
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
		this.offset -= this.game.scl;
		// Make break where blocks will fall right below where the row got cleared
		this.break = i+1;
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
	}

	// private pop() {
	// 	const row = new Array(this.matrix[0].length).fill(0);
	// 	this.matrix.pop();
	// 	this.matrix.unshift(row);

	// 	this.offset = -60;
	// }
}
