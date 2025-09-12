import { GameObject } from "./GameObject";
import { tetrominos } from "./tetrominos";
import { Keyboard } from "../Game/Keyboard";
import { Arena } from "../Game/Arena";
import { Game } from "../Game/Game";
import { Memo } from "../Utils/Memo";

export class Tetromino extends GameObject {
    public shape: number[][];
    public color: string;

    private shapeIndex: number;
    private rotation: number = 0;

    private verticalSpeed = 3;
    private boost = 7;
    private horizontalSpeed = 12;

    private rotateDelay = 10;
    private rotateTimer = 0;

    private collisionMemo = new Memo(-1, false);

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
        const tetromino = tetrominos[this.shapeIndex];
        this.shape = tetromino.matrix.copy();
        this.color = tetromino.color;

        this.setRotation(options.rotation ?? 0);
    }

    public tick() {
        this.handleKeys();

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
            this.vel.y === this.verticalSpeed * this.boost /* if boosting */
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
        // ctx.save();
        let translate = { x: null, y: null };
        if (this.smooth) {
            translate.x = Math.round(this.x);
            translate.y = Math.round(this.y);
        } else {
            translate.x = Math.round(this.xx) * this.scl;
            translate.y = Math.round(this.yy) * this.scl;
        }

        ctx.translate(translate.x, translate.y);

        ctx.fillStyle = this.color;

        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    ctx.fillRect(
                        x * this.scl,
                        y * this.scl,
                        this.scl,
                        this.scl,
                    );
                }
            });
        });
        // Couldnt do ctx.save/restore as that is already
        // done in the Game class's render function
        ctx.translate(-translate.x, -translate.y);
    }

    private isCollision() {
        return this.collisionMemo.get(this.yy, this._isCollision.bind(this));
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

    private rotate(dir = 1) {
        for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.shape[x][y], this.shape[y][x]] = [
                    this.shape[y][x],
                    this.shape[x][y],
                ];
            }
        }

        if (dir === 1) {
            this.shape.forEach((row) => row.reverse());
        } else {
            this.shape.reverse();
            return;
        }

        const prevx = this.x;
        let offset = 1;
        while (this._isCollision()) {
            this.x += offset * this.scl;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.shape[0].length) {
                this.x = prevx;
                this.rotate(-dir);
                return;
            }
        }

        this.rotation += dir;
        if (this.rotation > 3) this.rotation = 0;
    }

    private handleKeys() {
        const up = this.keys.get("w") || this.keys.get("arrowup");
        const left = this.keys.get("a") || this.keys.get("arrowleft");
        const down = this.keys.get("s") || this.keys.get("arrowdown");
        const right = this.keys.get("d") || this.keys.get("arrowright");

        if (down) {
            this.vel.y = this.verticalSpeed * this.boost;
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

        if (up) {
            if (this.rotateTimer <= 0) {
                this.rotate();
                this.rotateTimer = this.rotateDelay;
            }
        }
    }

    private slideToTile() {
        // Distance to perfect tile placement
        const v = Math.round((this.xx * this.scl - this.x) / 3);

        // If the distance to the destination is less than .5 pixels
        // just jump directly to the destination
        this.vel.x = v === 0 ? this.xx * this.scl - this.x : v;
    }

    private setRotation(value) {
        let i = 0;
        while (this.rotation !== value) {
            if (i >= 4) return;
            this.rotate(1);
            i++;
        }
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
