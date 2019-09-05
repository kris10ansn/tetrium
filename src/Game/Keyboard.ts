export class Keyboard {
	public keys = new Map<string, boolean>()

	constructor() {
		const keyEvent = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase()
			const keydown = event.type == "keydown"
	
			this.keys.set(key, keydown ? true : false)
		}

		window.addEventListener("keydown", keyEvent)
		window.addEventListener("keyup", keyEvent)
	}
}