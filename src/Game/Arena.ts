import { GameObject } from "../GameObjects/GameObject.js";
import { Tetromino } from "../GameObjects/Tetromino.js";
import Matrix from "../Utils/Matrix.js";
import { Game } from "./Game";
import { color, number } from "../Utils/colors.js";

export class Arena {
	matrix: Matrix<number>;
	objects = Array<GameObject>();
	offset = 0;

	constructor(width: number, height: number, private game: Game) {
		this.matrix = Matrix<number>(width, height, 0);
		(<any>window).arena = this;
	}

	public tick() {
		this.objects.forEach(object => {
			object.tick();
		});

		for(let i = this.matrix.length-1; i >= 0; i--) {
			if(this.matrix[i].every(val => val > 0)) {
				const row = new Array(this.matrix[0].length).fill(0);
				this.matrix.splice(i, 1);
				this.matrix.unshift(row);
				this.offset -= this.game.scl;
				break;
			}
		}

		// Increment if less than 0
		this.offset = Math.min(0, this.offset + 5)
	}

	public render(ctx: CanvasRenderingContext2D) {
		this.objects.forEach(object => {
			object.render(ctx);
		});
		this.matrix.forEach((row, y) => {
			row.forEach((val, x) => {
				if (val > 0) {
					ctx.fillStyle = color(val);
					ctx.fillRect(
						x * this.game.scl,
						this.offset + y * this.game.scl,
						this.game.scl,
						this.game.scl
					);
				}
			});
		});
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
						this.matrix[yy + y][xx + x] = number(color);
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
