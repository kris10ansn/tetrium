export interface ITetromino {
    name: string;
    color: string;
    matrix: number[][];
}

export const tetrominos: ITetromino[] = [
    {
        name: "T",
        color: "#FF0D72",
        matrix: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 0, 0],
        ],
    },

    {
        name: "O",
        color: "#0DC2FF",
        matrix: [
            [1, 1],
            [1, 1],
        ],
    },

    {
        name: "I",
        color: "#0DFF72",
        matrix: [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ],
    },

    {
        name: "L",
        color: "#F538FF",
        matrix: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],
    },

    {
        name: "J",
        color: "#FF8E0D",
        matrix: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],
    },

    {
        name: "S",
        color: "#FFE138",
        matrix: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],
    },

    {
        name: "Z",
        color: "#3877FF",
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],
    },
];
