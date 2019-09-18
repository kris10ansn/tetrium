import { Widget } from "./Widget";
import { Button } from "./Button";
import { Mouse } from "../Game/Mouse";
import { ImageButton } from "./ImageButton";
import { Game } from "../Game/Game";
import { TextWidget } from "./TextWidget";
import { ImageReference } from "./ImageReference";
import { Line } from "./Line";

export class GUI {
	private elements = new Array<Widget>();

	constructor(private game: Game, private mouse: Mouse) {
		const pauseImage = new ImageReference("./assets/images/pause.png");
		const playImage = new ImageReference("./assets/images/play.png");
		const resetImage = new ImageReference("./assets/images/reset.png");

		const resumeEvent = event => {
			this.game.resume();
			pauseButton.imageRef = pauseImage;
			pauseButton.onClick = pauseEvent;
		};

		const pauseEvent = event => {
			this.game.pause();
			pauseButton.imageRef = playImage;
			pauseButton.onClick = resumeEvent;
		};

		const pauseButton = new ImageButton(
			475,
			50,
			75,
			75,
			mouse,
			pauseImage,
			pauseEvent
		);

		const resetButton = new ImageButton(
			50,
			50,
			75,
			75,
			mouse,
			resetImage,
			event => {
				this.game.restart();
			}
		);

		const scoreText = new TextWidget(
			300,
			128,
			String(this.game.score),
			"Arial",
			112,
			"white",
			() => {
				scoreText.text = String(this.game.score);
			}
		);

		const highscoreText = new TextWidget(
			300,
			200,
			String(this.game.highscore),
			"Arial",
			32,
			"white",
			() => {
				highscoreText.text = `High score: ${this.game.highscore}`;
			}
		);

		const heightLimitLine = new Line(
			0,
			this.game.scl * 4,
			this.game.canvas.width,
			this.game.scl * 4,
			"red"
		);

		this.elements.push(pauseButton);
		this.elements.push(resetButton);
		this.elements.push(scoreText);
		this.elements.push(highscoreText);
		this.elements.push(heightLimitLine);
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
