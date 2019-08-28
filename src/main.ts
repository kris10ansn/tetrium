import { Game } from "./Game/Game.js";

declare global {
	interface Array<T> {
		remove(elem: T): Array<T>
		copy(): Array<T>
		sum(): number
		last(): T
	}

	interface CanvasRenderingContext2D {
		drawCircle(x: number, y: number, radius: number): void
		fillCircle(x: number, y: number, radius: number): void
	}
}

function init() {
	const game = new Game({
		width: 600,
		height: 1080
	})
}

window.onload = init

CanvasRenderingContext2D.prototype.drawCircle = function(x: number, y: number, radius: number) {
	this.beginPath()

	this.arc(x, y, radius, 0, Math.PI*2);

	this.closePath()

	this.stroke()
}
CanvasRenderingContext2D.prototype.fillCircle = function(x: number, y: number, radius: number) {
	this.beginPath()

	this.arc(x, y, radius, 0, Math.PI*2);

	this.closePath()

	this.fill()
}

Array.prototype.last = function() {
	return this[this.length - 1];
}

Array.prototype.remove = function<T>(this: T[], elem: T) : T[] {
	this.forEach((it, index) => {
		if(it === elem) {
			this.splice(index, 1)
		}
	})
	return this
}
Array.prototype.copy = function<T>(this: T[]) : T[] {
	const newArray = new Array(this.length)

	this.forEach((item, index) => {
		newArray[index] = item instanceof Array? item.copy() : item
	})

	return newArray
}

Array.prototype.sum = function() {
	return this.reduce((accumulator, a) => {
		return accumulator + a
	})
}