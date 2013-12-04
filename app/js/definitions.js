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
            start: 0,
            end: 11,
            presets: [
                // vertical
                // horizontal
                {forced: true, array:[7, 6]},
                // combined
            ],
        },
        {
            rows: 4,
            columns: 4,
            start: 4,
            end: 5,
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
            start: 6,
            end: 12,
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
            start: 0,
            end: 30,
            presets: [
                // vertical
                {forced: false, array:[6, 12]},
                {forced: false, array:[17, 23]},
                {forced: false, array:[29, 35]},
                // horizontal
                {forced: false, array:[9, 10]},
                {forced: false, array:[14, 15]},
                {forced: false, array:[19, 20]},
                // combined
                {forced: false, array:[18, 24, 25]},
                {forced: false, array:[4, 5, 11]},
            ],
        },
        {
            rows: 6,
            columns: 6,
            start: 0,
            end: 30,
            presets: [
                // vertical
                // horizontal
                // combined
                {forced: true, array:[8, 14, 15, 9]},
                {forced: false, array:[27, 21, 20, 26]}
            ],
        },
        {
            rows: 6,
            columns: 6,
            start: 0,
            end: 15,
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
            start: 0,
            end: 48,
            presets: [
                // vertical
                // horizontal
                // combined
            ],
        },
    ]
}
