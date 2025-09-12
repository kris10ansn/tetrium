export class ImageReference {
    public image: HTMLImageElement;

    constructor(path: string) {
        this.image = new Image();
        this.image.src = path;
    }
}
