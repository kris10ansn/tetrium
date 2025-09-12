export class Rectangle {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) {}

    public includes(point: { x: number; y: number }): boolean {
        return (
            point.x > this.x &&
            point.y > this.y &&
            point.x < this.x + this.width &&
            point.y < this.y + this.height
        );
    }
}
