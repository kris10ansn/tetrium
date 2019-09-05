import { InteractiveGUIElement } from "./InteractiveGUIElement";
import { Mouse } from "../Game/Mouse";

export abstract class Button extends InteractiveGUIElement {
	constructor(
		x: number,
		y: number,
		width: number,
		height: number,
		mouse: Mouse,
		public onClick: (event: MouseEvent) => any
	) {
		super(x, y, width, height, mouse);
		
		mouse.onClick((event) => {
			if(this.bounds.includes(mouse)) {
				this.onClick(event);
			}
		});
	}
}
