export class Keyboard {
	public keys = new Map<string, boolean>()
	public onKeyPressFunctions = new Array<(event: KeyboardEvent) => any>();

	constructor() {
		const keyEvent = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase()
			const keydown = event.type == "keydown"
	
			this.keys.set(key, keydown ? true : false)
		}

		window.addEventListener("keydown", keyEvent)
		window.addEventListener("keyup", keyEvent)
	}
	
	public onKeyPress(callback: (event: KeyboardEvent) => any) {
		this.onKeyPressFunctions.push(callback);
		const event = new KeyboardEvent("mousemove", );
		callback(event);
	}
}