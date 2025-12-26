import { GameObject } from "./GameObject";
import { tetrominos } from "./tetrominos";
import { Keyboard } from "../Game/Keyboard";
import { Arena } from "../Game/Arena";
import { Game } from "../Game/Game";
import { Memo } from "../Utils/Memo";
import { Canvas } from "../Game/Canvas";
import { easeTo } from "../Utils/easeTo";
import { rotateMatrix } from "../Utils/Matrix";

export class Tetromino extends GameObject {
    public shape: number[][];
    public color: string;

    private shapeIndex: number;
    private rotation: number = 0;

    private rotationDeg = 0;
    private rotationDegGoal = 0;

    private verticalSpeed = 3;
    private boost = 20;
    private horizontalSpeed = 16;

    private rotateDelay = 10;
    private rotateTimer = 0;

    private collisionMemo = new Memo("", false);

    private canvas: Canvas;

    constructor(
        x: number,
        y: number,
        private scl: number,
        private canvasSize: { width: number; height: number },
        private arena: Arena,
        private keyboard: Keyboard,
        private game: Game,
        private smooth: boolean,
        options?: { shapeIndex?: number; rotation?: number },
    ) {
        super(x, y);

        this.vel.set(0, this.verticalSpeed);

        this.shapeIndex =
            options.shapeIndex ?? Math.floor(Math.random() * tetrominos.length);

        this.shape = tetrominos[this.shapeIndex].matrix.copy();
        this.color = tetrominos[this.shapeIndex].color;

        this.canvas = new Canvas(canvasSize.width, canvasSize.height);
        this.draw();

        for (let i = 0; i < (options.rotation ?? 0); i++) {
            rotateMatrix(this.shape, 1);
            this.rotationDegGoal = this.rotationDeg += (1 / 4) * (2 * Math.PI);
        }
    }

    public tick() {
        this.handleKeys();

        this.rotationDeg = easeTo(
            this.rotationDegGoal,
            this.rotationDeg,
            0.3,
            0.01,
        );

        const prevyy = this.yy;
        this.y += this.vel.y;

        if (this.isCollision()) {
            this.y -= this.vel.y;
            this.y = this.yy * this.scl;
            this.arena.merge(this);
            this.game.score += 10;
        }

        if (
            this.yy > prevyy &&
            this.vel.y === this.verticalSpeed + this.boost /* if boosting */
        ) {
            this.game.score += 1;
        }

        this.x += this.vel.x;
        if (this.isCollision()) {
            this.x -= this.vel.x;
        }

        this.x = Math.min(
            this.x,
            this.canvasSize.width -
                (this.width + this.whitespaceLeft) * this.scl,
        );
        this.x = Math.max(this.x, -this.whitespaceLeft * this.scl);

        // *Check for collision*
        // *Move until not colliding*

        if (this.rotateTimer > 0) this.rotateTimer -= 1;

        this.updateState();
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.smooth) {
            return void ctx.drawImage(
                this.canvas.element,
                this.xx * this.scl,
                this.yy * this.scl,
            );
        }

        const half = (this.shape.length * this.scl) / 2;
        const translate = { x: this.x + half, y: this.y + half };

        ctx.translate(translate.x, translate.y);
        ctx.rotate(this.rotationDeg);

        ctx.drawImage(this.canvas.element, -half, -half);

        ctx.resetTransform();
    }

    private draw() {
        this.canvas.clear();
        this.canvas.ctx.fillStyle = this.color;

        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    this.canvas.ctx.fillRect(
                        x * this.scl,
                        y * this.scl,
                        this.scl,
                        this.scl,
                    );
                }
            });
        });

        this.canvas.ctx.resetTransform();
    }

    private isCollision() {
        return this.collisionMemo.get(
            `${this.yyc}-${this.xx}`,
            this._isCollision.bind(this),
        );
    }

    private _isCollision(): boolean {
        const collidesBottom =
            this.y + this.height * this.scl + this.whitespaceTop * this.scl >=
            this.canvasSize.height;
        const collidesWest = this.x + this.whitespaceLeft * this.scl < 0;
        const collidesEast =
            this.x + (this.width - this.whitespaceRight) * this.scl >
            this.canvasSize.width;

        let collides = collidesBottom || collidesWest || collidesEast;

        if (collides) return collides;

        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[y].length; x++) {
                const arena = this.arena.matrix;
                if (
                    this.shape[y][x] !== 0 &&
                    // Row exists
                    arena[this.yyc + y] &&
                    (arena[this.yyc + y][this.xx + x] !== 0 ||
                        (arena[this.yyc + y] &&
                            arena[this.yyc + y][this.xx + x] !== 0))
                ) {
                    collides = true;
                }
            }
        }
        return collides;
    }

    private updateState() {
        this.game.storage.setItem(
            "state",
            Object.assign(this.game.storage.getItem("state") ?? {}, {
                tetromino: {
                    x: this.x,
                    y: this.y,
                    shapeIndex: this.shapeIndex,
                    rotation: this.rotation,
                },
            }),
        );
    }

    private rotate(dir: 1 | -1 = 1) {
        rotateMatrix(this.shape, dir);

        const prevx = this.x;
        let offset = 1;

        while (this._isCollision()) {
            this.x += offset * this.scl;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > this.shape[0].length) {
                this.x = prevx;
                this.rotate(-dir as 1 | -1);
                return;
            }
        }

        this.rotation += dir;
        this.rotationDegGoal += (dir / 4) * (2 * Math.PI);

        if (this.rotation > 3) this.rotation = 0;
    }

    private handleKeys() {
        const up =
            this.keys.get("w") ||
            this.keys.get("arrowup") ||
            this.keys.get("e");
        const q = this.keys.get("q");
        const left = this.keys.get("a") || this.keys.get("arrowleft");
        const down = this.keys.get("s") || this.keys.get("arrowdown");
        const right = this.keys.get("d") || this.keys.get("arrowright");

        if (down) {
            this.vel.y = this.verticalSpeed + this.boost;
        } else {
            this.vel.y = this.verticalSpeed;
        }

        if (left || right) {
            const dir = left ? -1 : 1;
            let allow = true;

            if (this.smooth) {
                this.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        // Set allow to false if there is a block in the way.
                        // (Prevents sliding halfway into blocks in smooth mode)
                        if (
                            value === 1 &&
                            this.arena.matrix[this.yy + y] &&
                            this.arena.matrix[this.yy + y][this.xx + x + dir] >
                                0
                        ) {
                            allow = false;
                        }
                    });
                });
            }

            if (allow) {
                this.vel.x = this.horizontalSpeed * dir;
            } else {
                this.slideToTile();
            }
        } else {
            this.slideToTile();
        }

        if (up && this.rotateTimer <= 0) {
            this.rotate();
            this.rotateTimer = this.rotateDelay;
        } else if (q && this.rotateTimer <= 0) {
            this.rotate(-1);
            this.rotateTimer = this.rotateDelay;
        }
    }

    private slideToTile() {
        this.vel.x = easeTo(this.xx * this.scl, this.x, 0.2, 0.01) - this.x;
    }

    get xx() {
        return Math.round(this.x / this.scl);
    }
    get yy() {
        return Math.round(this.y / this.scl);
    }

    get yyc() {
        return Math.ceil(this.y / this.scl);
    }

    get width() {
        return (
            this.shape[0].length - (this.whitespaceLeft + this.whitespaceRight)
        );
    }
    get height() {
        let height = this.shape.length;

        for (let y = 0; y < this.shape.length; y++) {
            if (this.shape[y].sum() === 0) height--;
        }

        return height;
    }

    get whitespaceTop() {
        let y = 0;

        for (let i = 0; i < this.shape.length; i++) {
            if (this.shape[i].sum() === 0) {
                y++;
            } else {
                break;
            }
        }

        return y;
    }

    get whitespaceRight() {
        let blanks = 0;

        for (let x = this.shape.length - 1; x >= 0; x--) {
            for (let y = 0; y < this.shape.length; y++) {
                if (this.shape[y][x] !== 0) {
                    return blanks;
                }
            }
            blanks++;
        }

        return blanks;
    }

    get whitespaceLeft() {
        let blanks = 0;

        for (let x = 0; x < this.shape.length; x++) {
            for (let y = 0; y < this.shape.length; y++) {
                if (this.shape[y][x] !== 0) {
                    return blanks;
                }
            }
            blanks++;
        }

        return blanks;
    }

    get keys() {
        return this.keyboard.keys;
    }
}
