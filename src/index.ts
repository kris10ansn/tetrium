import { Canvas } from "./Game/Canvas";
import { Game } from "./Game/Game";

function init() {
    const gameDiv = document.body.querySelector("#game");

    const canvas = new Canvas(600, 1080);
    canvas.render(gameDiv);

    const game = new Game(canvas);
    game.start();
}

window.onload = init;

declare global {
    interface Array<T> {
        remove(elem: T): Array<T>;
        copy(): Array<T>;
        sum(): number;
    }

    interface CanvasRenderingContext2D {
        fillRoundedRect(
            x: number,
            y: number,
            width: number,
            height: number,
            radius: number,
        );
    }
}

CanvasRenderingContext2D.prototype.fillRoundedRect = function (
    this: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    const lineJoin = this.lineJoin;
    this.lineJoin = "round";
    this.lineWidth = radius;
    this.strokeStyle = this.fillStyle;

    this.strokeRect(
        x + radius * 0.5,
        y + radius * 0.5,
        width - radius,
        height - radius,
    );

    this.fillRect(
        x + radius * 0.5,
        y + radius * 0.5,
        width - radius,
        height - radius,
    );

    this.lineJoin = lineJoin;
};

Array.prototype.remove = function <T>(this: T[], elem: T): T[] {
    this.forEach((it, index) => {
        if (it === elem) {
            this.splice(index, 1);
        }
    });
    return this;
};
Array.prototype.copy = function <T>(this: T[]): T[] {
    const newArray = new Array(this.length);

    this.forEach((item, index) => {
        newArray[index] = item instanceof Array ? item.copy() : item;
    });

    return newArray;
};

Array.prototype.sum = function () {
    return this.reduce((accumulator, a) => {
        return accumulator + a;
    });
};
