import { GameObject } from "../GameObjects/GameObject";
import { Tetromino } from "../GameObjects/Tetromino";
import Matrix from "../utils/Matrix.js";

export class Arena {
	matrix: Matrix<number>
	objects = Array<GameObject>()

	constructor(width: number, height: number) {
		this.matrix = Matrix<number>(width, height, 0)
	}

	public tick() {
		this.objects.forEach(object => {
			object.tick()
		})
	}

	public render(ctx: CanvasRenderingContext2D) {
		this.objects.forEach(object => {
			object.render(ctx)
		})
	}

	public addObject(object: GameObject) {
		this.objects.push(object)
	}

	public removeObject(object: GameObject) {
		this.objects.remove(object)
	}

	public merge(tetromino: Tetromino) {
		
	}
}