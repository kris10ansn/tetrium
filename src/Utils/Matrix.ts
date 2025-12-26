export type Matrix<T> = Array<Array<T>>;

export function createMatrix<T>(
    width: number,
    height: number,
    fill: T,
): Matrix<T> {
    const array = new Array<Array<T>>();

    while (height--) {
        array.push(new Array<T>(width).fill(fill));
    }
    return array;
}

export function rotateMatrix<T>(matrix: Matrix<T>, dir: 1 | -1): void {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (dir === 1) {
        matrix.forEach((row) => row.reverse());
    } else {
        matrix.reverse();
    }
}
