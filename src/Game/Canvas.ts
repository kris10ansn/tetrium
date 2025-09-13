export class Canvas {
    public element: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    private _blur: number = 0;

    constructor(
        public width: number,
        public height: number,
    ) {
        this.element = document.createElement("canvas");
        this.element.width = width;
        this.element.height = height;

        this.ctx = this.element.getContext("2d")!;
    }

    public render(parentNode: Node) {
        parentNode.appendChild(this.element);
    }

    public clear() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }

    public set blur(value) {
        this.ctx.filter = `blur(${value}px)`;
        this._blur = value;
    }

    public get blur() {
        return this._blur;
    }
}
