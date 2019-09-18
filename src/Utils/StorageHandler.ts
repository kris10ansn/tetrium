export class StorageHandler {
	public getItem(key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}

	public setItem(key: string, value: any): void {
		localStorage.setItem(key, JSON.stringify(value))
	}
}