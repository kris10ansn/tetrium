export class Text {
	private static ctx = document.createElement("canvas").getContext("2d");

	private constructor () {}

	public static measure(text: string, font: string) {
		this.ctx.font = font;
		return this.ctx.measureText(text).width;
	}
}