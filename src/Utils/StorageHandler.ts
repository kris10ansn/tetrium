export class StorageHandler {
	private locked: boolean = false;

	public getItem(key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}

	public setItem(key: string, value: any): void {
		if(!this.locked) {
			localStorage.setItem(key, JSON.stringify(value))
		}
	}

	public lock() {
		this.locked = true;
	}
}