import { test } from "../test.js";
import "../evil.js";

function go(x, y, a, i) {
    switch (a) {
        case "U":
            return [x, y - i];
        case "D":
            return [x, y + i];
        case "L":
            return [x - i, y];
        case "R":
            return [x + i, y];
        default:
            return [x, y];
    }
}

test("go 0 0 U 1", [0, -1], () => go(0, 0, "U", 1));
test("go 0 0 D 2", [0, 2], () => go(0, 0, "D", 2));
test("go 0 0 L 3", [-3, 0], () => go(0, 0, "L", 3));
test("go 0 0 R 4", [4, 0], () => go(0, 0, "R", 4));

export function draw(instructions) {

    const map = [[0, 0]];
    let [x, y] = [0, 0];
    for (const instruction of instructions) {
        [x, y] = go(x, y, ...instruction);
        map.push([x, y]);
    }
    return map;

}

test("U1", [[0, 0], [0, -1]], () => draw([["U", 1]]));
test("U1 R1", [[0, 0], [0, -1], [1, -1]], () => draw([["U", 1], ["R", 1]]));


const redundancies = significant =>
    significant
        .slice(1)
        .reduce(
            ([ranges, previous], y) =>
                y > previous + 2
                    ? [
                        ranges.concat([[previous + 1, y - previous - 2]]),
                        y
                    ]
                    : [],
            [[], significant[0]]
        )[0];

test("0,3 redundancies", [[1, 1]], () => redundancies([0, 3]));
test("0,4 redundancies", [[1, 2]], () => redundancies([0, 4]));
test("0,1,3 redundancies", [], () => redundancies([0, 1, 3]));
test("0,3,6 redundancies", [[1, 1], [4, 1]], () => redundancies([0, 3, 6]));


function removeRedundancies(sortedPairs, redundant, transform) {

    const sortedRedundant = [...redundant].sort((a, b) => a[0] - b[0]);
    const offset = 0;
    const prunedPairs = sortedPairs.map(pair => {
        while (sortedRedundant.length && sortedRedundant[0][0] < y)
            offset += sortedRedundant.shift()[1];
        return transform(pair, -offset);
    });
    return prunedPairs;

}

test("00 10 13 03 06 16 removeRedundancies", [[0, 0], [1, 0], [1, 2], [0, 2], [0, 4], [1, 4]]);

const compress = pairs => {

    const significantY = pairs.map(([_, y]) => y).distinct().sort();
    const significantX = pairs.map(([x, _]) => x).distinct().sort();
    const y = redundancies(significantY);
    const x = redundancies(significantX);

    const ySortedPairs = [...pairs].sort((a, b) => a[1] - b[1]);
    const yPrunedPairs = removeRedundancies(ySortedPairs, y, ([x, y], offset) => [x, y + offset]);

    console.log(yPrunedPairs);
    const xSortedPairs = [...pairs].sort((a, b) => a[0] - b[0]);

    return [pairs, { x, y }];

}

const asPairs = data => data.split(" ").map(pair => pair.split("").map(x => parseInt(x)));
/*
    ####
    #..#   ####
    #..#   #..#
    #### > #### y: [[1, 1]], x: [[]]
*/
test(
    "00 30 33 03",
    [asPairs("00 30 32 02"), { y: [[1, 1]], x: [] }]
);



