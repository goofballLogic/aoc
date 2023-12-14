import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 2;
const day = 14;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const nthColumn = (xs, i) =>
    xs.map(ys => ys[i])
    ;

const gridKey = xs => xs.map(ys => ys.join("")).join(",");
/*
    1 2
    3 4 >>> 12,34
*/
test("grid key", "12,34", () => gridKey([[1, 2], [3, 4]]));

const rorateClockwiseMemos = {};
const rotateClockwise = xs => {

    // const key = gridKey(xs);
    // if (key in rorateClockwiseMemos) return rorateClockwiseMemos[key]
    let result = xs[0].map((_, i) => nthColumn(xs, i).reverse())
    //rorateClockwiseMemos[key] = result;
    return result;

};
/*
    1 2     3 1
    3 4 >>> 4 2
*/
test(
    "rotate clockwise",
    [[3, 1], [4, 2]],
    () => rotateClockwise([[1, 2], [3, 4]])
);

const sortSegment = segment =>
    segment.sort((a, b) => a === b ? 0 : a === "O" ? 1 : -1);

const addToLastSegment = (segments, symbol) =>
    [
        ...segments.slice(0, segments.length - 1),
        segments[segments.length - 1].concat(symbol)
    ];

const addNewSegment = (segments) =>
    [...segments, []];

const segmentLine = line =>
    line.reduce((segments, symbol) => symbol === "#"
        ? addNewSegment(segments)
        : addToLastSegment(segments, symbol),
        [[]]);

const desegmentLine = line =>
    line
        .reduce((a, b) => [...a, "#", ...b])
    ;

const slideLineEast = xs =>
    xs
        .pipe(segmentLine)
        .map(segment => sortSegment(segment))
        .pipe(desegmentLine)

    ;
/*
    O.#OO.  >>>>   .O#.OO
*/
test(
    "slide line east",
    [".", "O", "#", ".", "O", "O"],
    () => slideLineEast(["O", ".", "#", "O", "O", "."])
);
test("slide line east single segment", [".", "O"], () => slideLineEast(["O", "."]));

const priceLine = line =>
    line.reduce((total, symbol, i) => total + (symbol === "O" ? i + 1 : 0), 0);

(function part1() {

    const data = raw
        .map(line => line.split(""))
        .pipe(rotateClockwise)
        .map(slideLineEast)
        .map(priceLine)
        .sum()
        ;

    console.log("Part 1", data);

}());

const spin = lines =>
    lines
        .pipe(rotateClockwise)
        .map(slideLineEast)
        .pipe(rotateClockwise)
        .map(slideLineEast)
        .pipe(rotateClockwise)
        .map(slideLineEast)
        .pipe(rotateClockwise)
        .map(slideLineEast)
    ;
test(
    "1st spin",
    `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`,
    () => spin(
        `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`.split("\n").map(line => line.split(""))).map(line => line.join("")).join("\n")
);

test(
    "2nd spin",
    `.....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O`,
    () => spin(
        `.....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#....`.split("\n").map(line => line.split(""))).map(line => line.join("")).join("\n")
);

function stabilise(lines, repetitions) {

    let skipped = false;
    const spinMemos = {};
    let current = lines;
    for (let i = 0; i < repetitions; i++) {

        current = spin(current);
        const key = gridKey(current);
        if (key in spinMemos) {

            if (!skipped) {

                // we've reached stability
                const memo = spinMemos[key];
                const i0 = i;
                i = advanceCounter(i, memo, repetitions);
                skipped = true;
                console.log("Skipped from", i0, "to", i);
            }

        } else {

            spinMemos[key] = { current, i };

        }

    }
    return current;

}

function advanceCounter(i, memo, repetitions) {

    const loopSize = i - memo.i;
    const loopSkips = Math.floor((repetitions - i) / loopSize);
    const skip = loopSkips * loopSize;
    i += skip;
    return i;

}
test(
    "advanceCounter for SSxSSS x in 20 (end of i = 6) which should give us: SSxSSSxSSSxSSSxSSS x (i = 18)",
    18,
    () => advanceCounter(6, { i: 2 }, 20)
);

(function part2() {

    const repetitions = 1_000_000_000;
    console.time("part2");
    const data = raw
        .map(line => line.split(""))
        .pipe(lines => stabilise(lines, repetitions))
        .pipe(rotateClockwise)
        .map(priceLine)
        .sum()
        ;

    console.timeEnd("part2");
    console.log("Part 2", data);

}());

