$.definitions = {}
var i = 0

/* ==================================================
 * Levels
 * ================================================== */
$.definitions.levels = []
// 4x4
$.definitions.levels[i++] = {
    title: "4 x 4",
    levels: [
        {
            rows: 4,
            columns: 4,
            start: {row: 0, col: 0},
            end: {row: 2, col: 3},
            presets: [
                // vertical
                // horizontal
                {forced: true, array:[{row: 1, col: 3}, {row: 1, col: 2}]},
                // combined
            ],
        },
        {
            rows: 4,
            columns: 4,
            start: {row: 1, col: 0},
            end: {row: 1, col: 1},
            presets: [
                // vertical
                // horizontal
                // combined
            ],
        },
    ],
}

// 5x5
$.definitions.levels[i++] = {
    title: "5 x 5",
    levels: [
        {
            rows: 5,
            columns: 5,
            start: {row: 1, col: 1},
            end: {row: 2, col: 2},
            presets: [
                // vertical
                // horizontal
                // combined
            ],
        },
    ],
}

// 6x6
$.definitions.levels[i++] = {
    title: "6 x 6",
    levels: [
        {
            rows: 6,
            columns: 6,
            start: {row: 0, col: 0},
            end: {row: 5, col: 0},
            presets: [
                // vertical
                {forced: false, array:[{row: 1, col: 0}, {row: 2, col: 0}]},
                {forced: false, array:[{row: 2, col: 5}, {row: 3, col: 5}]},
                {forced: false, array:[{row: 4, col: 5}, {row: 5, col: 5}]},
                // horizontal
                {forced: false, array:[{row: 1, col: 3}, {row: 1, col: 4}]},
                {forced: false, array:[{row: 2, col: 2}, {row: 2, col: 3}]},
                {forced: false, array:[{row: 3, col: 1}, {row: 3, col: 2}]},
                // combined
                {forced: false, array:[{row: 3, col: 0}, {row: 4, col: 0}, {row: 4, col: 1}]},
                {forced: false, array:[{row: 0, col: 4}, {row: 0, col: 5}, {row: 1, col: 5}]},
            ],
        },
        {
            rows: 6,
            columns: 6,
            start: {row: 0, col: 0},
            end: {row: 5, col: 0},
            presets: [
                // vertical
                // horizontal
                // combined
                {forced: true, array:[{row: 1, col: 2}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 1, col: 3}]},
                {forced: false, array:[{row: 4, col: 3}, {row: 3, col: 3}, {row: 3, col: 2}, {row: 4, col: 2}]}
            ],
        },
        {
            rows: 6,
            columns: 6,
            start: {row: 0, col: 0},
            end: {row: 2, col: 3},
            presets: [
                // vertical
                // horizontal
                // combined
            ],
        },
    ]
}

$.definitions.levels[i++] = {
    title: "7 x 7",
    levels: [
        {
            rows: 7,
            columns: 7,
            start: {row: 0, col: 0},
            end: {row: 6, col: 6},
            presets: [
                // vertical
                // horizontal
                // combined
            ],
        },
    ]
}
