import { Vector2D } from "../Utils/Vector";

export class Mouse {
	private pos = new Vector2D(-Infinity, -Infinity);
	private onMoveFunctions = new Array<(event: MouseEvent) => any>();
	private onClickFunctions = new Array<(event: MouseEvent) => any>();

	constructor(canvas: HTMLCanvasElement) {
		const computedStyle = window.getComputedStyle(canvas);
		const cwidth = parseInt(computedStyle.width);
		const cheight = parseInt(computedStyle.height);

		const mx = canvas.width / cwidth;
		const my = canvas.height / cheight;

		canvas.addEventListener("mousemove", event => {
			const rect = canvas.getBoundingClientRect();
			
			this.x = (event.clientX - rect.left) * mx -5;
			this.y = (event.clientY - rect.top) * my  -5;
			
			this.onMoveFunctions.forEach(it => it(event));
		});

		canvas.addEventListener("click", event => {
			this.onClickFunctions.forEach(it => it(event));
		})
	}

	public onMove(callback: (event: MouseEvent) => any) {
		this.onMoveFunctions.push(callback);
	}
	public onClick(callback: (event: MouseEvent) => any) {
		this.onClickFunctions.push(callback);
	}
	
	public get x() { return this.pos.x }
	public get y() { return this.pos.y }

	public set x(val) { this.pos.x = val }
	public set y(val) { this.pos.y = val }
}