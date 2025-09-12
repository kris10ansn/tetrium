import { ITetromino, tetrominos } from "../GameObjects/tetrominos";

export class Bag {
    private bag: number[];

    public constructor() {
        this.resetBag();
    }

    public grabIndex(): number {
        const i = Math.round(Math.random() * (this.bag.length - 1));
        const [shapeIndex] = this.bag.splice(i, 1);

        if (this.bag.length === 0) {
            this.resetBag();
        }

        return shapeIndex;
    }

    private resetBag() {
        this.bag = new Array(tetrominos.length).fill(null).map((_, i) => i);
    }
}
