import { GUIElement } from "./GUIElement";
import { Rectangle } from "../Utils/Rectangle";
import { Mouse } from "../Game/Mouse";

export abstract class InteractiveGUIElement extends GUIElement {
	public visible: boolean;
	public bounds: Rectangle;

	protected hover: boolean = false;

	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		private mouse: Mouse
	) {
		super(x, y, width, height);

		this.mouse.onMove(event => {
			this.hover = this.bounds.includes(mouse);
		})
	}
	
	public abstract tick(): void;
	public abstract render(ctx: CanvasRenderingContext2D): void
}