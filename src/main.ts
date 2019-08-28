import { Game } from "./Game/Game.js";

function init() {
	const game = new Game({
		width: 600,
		height: 1080
	})
}

window.onload = init

declare global {
	interface Array<T> {
		remove(elem: T): Array<T>
		copy(): Array<T>
		sum(): number
	}
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