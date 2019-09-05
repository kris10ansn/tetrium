import { GUIElement } from "./GUIElement";
import { Button } from "./Button";
import { Mouse } from "../Game/Mouse";
import { ImageButton } from "./ImageButton";
import { Game } from "../Game/Game";

export class GUI {
	private elements = new Array<GUIElement>();

	constructor(private game: Game, private mouse: Mouse) {
		const resumeEvent = event => {
			this.game.resume();
			pauseButton.image.src = "./assets/pause.png"
			pauseButton.onClick = pauseEvent;
		};

		const pauseEvent = event => {
			this.game.pause();
			pauseButton.image.src = "./assets/play.png"
			pauseButton.onClick = resumeEvent;
		};

		const pauseButton = new ImageButton(
			475, 50, 75, 75,
			mouse,
			"./assets/pause.png",
			pauseEvent
		);
		
		this.elements.push(pauseButton);
	}

	public tick() {
		this.elements.forEach(element => {
			element.tick();
		});
	}

	public render(ctx: CanvasRenderingContext2D) {
		this.elements.forEach(element => {
			element.render(ctx);
		});
	}
}
