export class Memo<K, V> {
    constructor(
        private key: K,
        private value: V,
    ) {}

    public get(key: K, callback: Function) {
        if (key !== this.key) {
            this.key = key;
            this.value = callback();
        }

        return this.value;
    }
}
