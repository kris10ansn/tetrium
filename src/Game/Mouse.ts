import { Vector2D } from "../Utils/Vector";

export class Mouse {
    private pos = new Vector2D(-0, -0);
    private onMoveFunctions = new Array<(event: MouseEvent) => any>();
    private onClickFunctions = new Array<(event: MouseEvent) => any>();

    constructor(canvas: HTMLCanvasElement) {
        this.x = sessionStorage.mouseX ? Number(sessionStorage.mouseX) : this.x;
        this.y = sessionStorage.mouseY ? Number(sessionStorage.mouseY) : this.y;

        const computedStyle = window.getComputedStyle(canvas);
        const cwidth = parseInt(computedStyle.width);
        const cheight = parseInt(computedStyle.height);

        const mx = canvas.width / cwidth;
        const my = canvas.height / cheight;

        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();

            this.x = (event.clientX - rect.left) * mx - 5;
            this.y = (event.clientY - rect.top) * my - 5;

            this.onMoveFunctions.forEach((callback) => callback(event));
        });

        canvas.addEventListener("click", (event) => {
            this.onClickFunctions.forEach((it) => it(event));
        });
    }

    public onMove(callback: (event: MouseEvent) => any) {
        this.onMoveFunctions.push(callback);
    }
    public onClick(callback: (event: MouseEvent) => any) {
        this.onClickFunctions.push(callback);
    }

    public get x() {
        return this.pos.x;
    }
    public get y() {
        return this.pos.y;
    }

    public set x(val) {
        this.pos.x = val;
        sessionStorage.mouseX = val;
    }
    public set y(val) {
        this.pos.y = val;
        sessionStorage.mouseY = val;
    }
}
