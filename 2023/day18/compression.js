import { test } from "../test.js";

const redundancies = significant => significant
    .slice(1)
    .reduce(
        ([ranges, previous], next) =>
            [
                (next > previous + 2)
                    ? ranges.concat([[previous + 1, next - previous - 2]])
                    : ranges,
                next
            ],
        [
            [],
            significant[0]
        ]
    )[0];

test("0,3 redundancies", [[1, 1]], () => redundancies([0, 3]));
test("0,4 redundancies", [[1, 2]], () => redundancies([0, 4]));
test("0,1,3 redundancies", [], () => redundancies([0, 1, 3]));
test("0,3,6 redundancies", [[1, 1], [4, 1]], () => redundancies([0, 3, 6]));

function removeRedundanciesInPlace(sortedPairs, redundant, observe, transform) {

    const sortedRedundant = [...redundant].sort((a, b) => a[0] - b[0]);
    let offset = 0;
    sortedPairs.forEach(pair => {

        while (sortedRedundant.length && sortedRedundant[0][0] < observe(pair))
            offset -= sortedRedundant.shift()[1];
        transform(pair, offset);

    });

}

test(
    "00 10 13 03 06 16 removeRedundanciesInPlace",
    [[0, 0], [1, 0], [1, 2], [0, 2], [0, 4], [1, 4]],
    () => {
        const coords = [[0, 0], [1, 0], [1, 3], [0, 3], [0, 6], [1, 6]];
        removeRedundanciesInPlace(
            coords,
            [[1, 1], [4, 1]],
            ([_, y]) => y,
            (pair, offset) => { pair[1] += offset; }
        );
        return coords;
    }
);

const removeYRedundanciesInPlace = (pairs, redundant) => removeRedundanciesInPlace(
    [...pairs].sort((a, b) => a[1] - b[1]),
    redundant,
    ([_, y]) => y,
    (pair, offset) => { pair[1] += offset; }

);

const removeXRedundanciesInPlace = (pairs, redundant) => removeRedundanciesInPlace(
    [...pairs].sort((a, b) => a[0] - b[0]),
    redundant,
    ([x, _]) => x,
    (pair, offset) => { pair[0] += offset; }
);

export const compressCoordinates = pairs => {

    const working = structuredClone(pairs);
    const significantY = working.map(([_, y]) => y).distinct().sort((a, b) => a - b);
    const significantX = working.map(([x, _]) => x).distinct().sort((a, b) => a - b);
    const y = redundancies(significantY);
    const x = redundancies(significantX);
    removeYRedundanciesInPlace(working, y);
    removeXRedundanciesInPlace(working, x);
    return [working, { x, y }];

};

const asPairs = data => data.split(" ").map(pair => pair.split("").map(x => parseInt(x)));
/*
    ####
    #..#   ###
    #..#   #.#
    #### > ### y: [[1, 1]], x: [[1, 1]]
*/
test(
    "00 30 33 03 compressCoordinates",
    [asPairs("00 20 22 02"), { y: [[1, 1]], x: [[1, 1]] }],
    () => compressCoordinates([[0, 0], [3, 0], [3, 3], [0, 3]])
);
test(
    "example compressCoordinates",
    [
        [
            [0, 0], [4, 0],
            [4, 2], [10, 2],
            [10, 8], [12, 8],
            [12, 10], [8, 10],
            [8, 4], [6, 4],
            [6, 10], [2, 10],
            [2, 6], [0, 6],
            [0, 0]
        ],
        {
            "x": [[1, 5409], [5412, 456524], [461938, 35117], [497057, 112008], [609067, 209540], [818609, 367718]],
            "y": [[1, 56405], [56408, 299944], [356354, 143899], [500255, 419391], [919648, 266679]]
        }
    ],
    () => compressCoordinates([
        [0, 0], [461937, 0],
        [461937, 56407], [818608, 56407],
        [818608, 919647], [1186328, 919647],
        [1186328, 1186328], [609066, 1186328],
        [609066, 356353], [497056, 356353],
        [497056, 1186328], [5411, 1186328],
        [5411, 500254], [0, 500254],
        [0, 0]
    ])
);

const addYRedundanciesInPlace = (ranges, removed) => {

    const sortedRanges = [...ranges].sort((a, b) => a[1] - b[1]);
    const sortedRemoved = [...removed].sort((a, b) => a[0] - b[0]);
    let offset = 0;
    let currentRemovedAt = null;
    let currentOffset = 0;

    for (const range of sortedRanges) {

        range[1] += offset;
        range[3] += offset + currentOffset;
        if (currentRemovedAt !== null && currentRemovedAt < range[1]) {

            range[1] += currentOffset;
            offset += currentOffset;
            currentRemovedAt = null;
            currentOffset = 0;

        }
        const removedAt = sortedRemoved[0]?.[0];
        if (removedAt === range[1]) {
            const [_, removedSize] = sortedRemoved.shift();
            range[3] += removedSize;
            if (currentRemovedAt != removedAt) {
                currentRemovedAt = removedAt;
                currentOffset = removedSize;
            }
        }

    }

}
    ;


/*
                        ###
    ###                 #.#
    #.#                 #.#
    ### y: [[1,1]] >    ###
*/
test(
    "00 10 20 01 21 02 12 22 addYRedundanciesInPlace",
    [
        [0, 0, 0, 0], [1, 0, 1, 0], [2, 0, 2, 0],
        [0, 1, 0, 2], [2, 1, 2, 2],
        [0, 3, 0, 3], [1, 3, 1, 3], [2, 3, 2, 3]
    ],
    () => {
        const coords = [
            [0, 0, 0, 0], [1, 0, 1, 0], [2, 0, 2, 0],
            [0, 1, 0, 1], [2, 1, 2, 1],
            [0, 2, 0, 2], [1, 2, 1, 2], [2, 2, 2, 2]
        ];
        addYRedundanciesInPlace(coords, [[1, 1]]);
        return coords;
    }
);


const addXRedundanciesInPlace = (ranges, removed) => {

    const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0]);
    const sortedRemoved = [...removed].sort((a, b) => a[0] - b[0]);
    let offset = 0;
    let currentRemovedAt = null;
    let currentOffset = 0;

    for (const range of sortedRanges) {

        range[0] += offset;
        range[2] += offset + currentOffset;
        if (currentRemovedAt !== null && currentRemovedAt < range[0]) {

            range[0] += currentOffset;
            offset += currentOffset;
            currentRemovedAt = null;
            currentOffset = 0;

        }
        const removedAt = sortedRemoved[0]?.[0];
        if (removedAt === range[0]) {

            const [_, removedSize] = sortedRemoved.shift();
            range[2] += removedSize;
            if (currentRemovedAt != removedAt) {

                currentRemovedAt = removedAt;
                currentOffset = removedSize;

            }

        }

    }

}
    ;

/*
    ###                 ####
    #.#                 #..#
    #.#                 #..#
    ### x: [[1,1]] >    ####
*/
test(
    "00 10 20 01 21 02 22 30 31 32 addXRedundanciesInPlace",
    [
        [0, 0, 0, 0], [1, 0, 2, 0], [3, 0, 3, 0],
        [0, 1, 0, 2], [3, 1, 3, 2],
        [0, 3, 0, 3], [1, 3, 2, 3], [3, 3, 3, 3]
    ],
    () => {

        const coords = [
            [0, 0, 0, 0], [1, 0, 1, 0], [2, 0, 2, 0],
            [0, 1, 0, 2], [2, 1, 2, 2],
            [0, 3, 0, 3], [1, 3, 1, 3], [2, 3, 2, 3]
        ];
        addXRedundanciesInPlace(coords, [[1, 1]]);
        return coords;

    }

);

export const decompressCoordinates = (pairs, { x, y }) => {

    // to ranges
    const working = pairs.map(([x, y]) => [x, y, x, y]);
    // decompress y coordinates
    addYRedundanciesInPlace(working, y);
    // decompress x coordinates
    addXRedundanciesInPlace(working, x);
    return working;

}
    ;

/*
                                 ####
    ###                          #..#
    #.#                          #..#
    ### y: [[1,1]], x: [[1,1]] > ####
*/
test(
    "00 10 20 01 21 02 12 22 y: [[1,1]], x: [[1,1]] decompressCoordinates",
    [
        [0, 0, 0, 0], [1, 0, 2, 0], [3, 0, 3, 0],
        [0, 1, 0, 2], [3, 1, 3, 2],
        [0, 3, 0, 3], [1, 3, 2, 3], [3, 3, 3, 3]
    ],
    () => decompressCoordinates(
        [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
        { x: [[1, 1]], y: [[1, 1]] }
    )
);
