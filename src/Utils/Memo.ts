export class Memo<K, V> {
    constructor(
        private key: K,
        private value: V,
    ) {}

    public get(key, callback) {
        if (key !== this.key) {
            this.key = key;
            this.value = callback();
        }

        return this.value;
    }

    public set(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}
