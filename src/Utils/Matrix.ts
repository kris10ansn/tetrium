type Matrix<T> = Array<Array<T>>;

function Matrix<T>(width: number, height: number, fill: T): Matrix<T> {
	const array = new Array<Array<T>>()

	while(height--) {
		array.push(new Array<T>(width).fill(fill))
	}
	return array
}

export default Matrix;