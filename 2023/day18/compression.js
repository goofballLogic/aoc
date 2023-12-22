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
    const significantY = working.map(([_, y]) => y).distinct().sort();
    const significantX = working.map(([x, _]) => x).distinct().sort();
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
