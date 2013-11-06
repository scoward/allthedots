$.definitions = {}

/* ==================================================
 * Levels
 * ================================================== */
$.definitions.levels = {}
// intro levels

// 6x6
$.definitions.levels["TWO"] = [
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

$.definitions.levels["THREE"] = [
    {
        rows: 6,
        columns: 6,
        start: {row: 0, col: 0}, end: {row: 5, col: 0},
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
            {forced: false, array:[{row: 1, col: 2}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 1, col: 3}]},
            {forced: false, array:[{row: 4, col: 3}, {row: 3, col: 3}, {row: 3, col: 2}, {row: 4, col: 2}]},
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
