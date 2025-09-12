import { Arena } from "./Arena";
import { Camera } from "./Camera";
import { Tetromino } from "../GameObjects/Tetromino";
import { Keyboard } from "./Keyboard";
import { Mouse } from "./Mouse";
import { GUI } from "../GUI/GUI";
import { StorageHandler } from "../Utils/StorageHandler";
import { Canvas } from "./Canvas";
import { TextWidget } from "../GUI/TextWidget";
import { Bag } from "./Bag";

export class Game {
    private arena: Arena;
    private bag: Bag;
    private mouse: Mouse;
    private gui: GUI;

    private keyboard: Keyboard;
    private camera: Camera;

    private backgroundColor: string = "black";
    private paused: boolean = false;

    public scl: number;
    public smooth = true;

    public storage = new StorageHandler();

    private _score: number = 0;
    private _highscore: number = this.storage.getItem("hscore") ?? 0;

    public dead = false;

    constructor(public canvas: Canvas) {
        this.scl = this.canvas.width / 10;
        this.mouse = new Mouse(this.canvas.element);
        this.gui = new GUI(this, this.mouse);
        this.keyboard = new Keyboard();
        this.camera = new Camera(0, 0, -1);
        this.bag = new Bag();

        this.arena = new Arena(
            this.canvas.width / this.scl,
            this.canvas.height / this.scl,
            this,
        );

        const state = this.loadState();
        const { x, y, shape: shapeIndex, rotation } = state.tetromino;

        this.arena.addObject(
            this.generateTetromino(x, y, {
                shapeIndex: shapeIndex ?? this.bag.grabIndex(),
                rotation,
            }),
        );

        this._score = state.score ? state.score : 0;

        this.keyboard.onKeyPress((event) => {
            if (event.key === " " && !this.keyboard.keys.get(" ")) {
                this.gui.pauseButton.onClick(
                    new MouseEvent("click", {
                        clientX: this.gui.pauseButton.x,
                        clientY: this.gui.pauseButton.y,
                    }),
                );
            }
        });
    }

    public start() {
        this.loop();
    }

    private loop(_millis: number = 0) {
        const step = 1 / 60;
        let lastTime: number | null = null;
        let accumulator = 0;

        const callback = (millis?: number) => {
            if (lastTime && millis) {
                accumulator += (millis - lastTime) / 1000;

                while (accumulator > step) {
                    this.tick();
                    accumulator -= step;
                }
                this.render();
            }

            if (millis) lastTime = millis;

            requestAnimationFrame(callback);
        };

        callback();
    }

    public tick() {
        if (!this.paused && !this.dead) {
            this.arena.tick();
        }

        if (this.score > this.highscore) {
            this.highscore = this.score;
        }

        this.gui.tick();
    }

    public render() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvas.ctx.save();
        this.camera.tick(this.canvas.ctx);

        this.canvas.ctx.fillStyle = this.backgroundColor;
        this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.arena.render(this.canvas.ctx);

        this.canvas.ctx.restore();

        this.gui.render(this.canvas.ctx);
    }

    public die() {
        this.dead = true;
        this.clearState();
        this.storage.lock();

        this.gui.elements.push(
            new TextWidget(300, 500, "You died", "Arial", 56, "red"),
        );

        this.keyboard.onKeyPress((event) => {
            const key = event.key.toLowerCase();
            // If the key was not already down when pressing
            if (!this.keyboard.keys.get(key)) {
                this.restart();
            }
        });
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        this.paused = false;
    }

    public restart() {
        // Prevents objects from ticking and thereby updating state.
        this.pause();

        this.clearState();
        window.location.reload();
    }

    public clearState() {
        this.storage.setItem("state", {});
    }

    public loadState() {
        const state = this.storage.getItem("state");
        const score = state && state.score ? state.score : null;
        const x = state && state.tetromino ? state.tetromino.x : null;
        const y = state && state.tetromino ? state.tetromino.y : null;
        const shape =
            state && state.tetromino ? state.tetromino.shapeIndex : null;
        const rotation =
            state && state.tetromino ? state.tetromino.rotation : null;

        return {
            score,
            tetromino: {
                x,
                y,
                shape,
                rotation,
            },
        };
    }

    public generateTetromino(
        x?: number,
        y?: number,
        options?: { shapeIndex?: number; rotation?: number },
    ) {
        return new Tetromino(
            x ?? 3 * this.scl,
            y ?? -4 * this.scl,
            this.scl,
            { width: this.canvas.width, height: this.canvas.height },
            this.arena,
            this.keyboard,
            this,
            this.smooth,
            options ?? { shapeIndex: this.bag.grabIndex() },
        );
    }

    public get score() {
        return this._score;
    }

    public set score(value) {
        this._score = value;

        this.storage.setItem(
            "state",
            Object.assign(this.storage.getItem("state") ?? {}, {
                score: value,
            }),
        );
    }

    public get highscore() {
        return this._highscore;
    }

    public set highscore(value) {
        this._highscore = value;
        this.storage.setItem("hscore", this._highscore);
    }
}
