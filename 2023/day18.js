import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";
import { flood } from "./day18/flood.js";


const input = 2;
const day = 18;
const raw = readFileSync(`day${day}-input${input}.txt`)
    .toString()
    .trim()
    .split("\n")
    ;

const data = raw
    .map(i => i.split(" "))
    .map(([a, i, c]) => [a, parseInt(i), c])
    ;

console.log(data);

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

/**
 *
 * @param {[[string, number]]} instructions
 * @returns [[number, number]]
 */
function draw(instructions) {

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

const calcDimensions = coords =>
    coords
        .reduce((prev, next) => [
            Math.min(prev[0], next[0]),
            Math.min(prev[1], next[1]),
            Math.max(prev[2], next[0]),
            Math.max(prev[3], next[1])
        ], [Infinity, Infinity, -Infinity, -Infinity])
    ;

test(
    "U1 calcDimension",
    [0, -1, 0, 0],
    () => calcDimensions(draw([["U", 1]]))
);

/**
 *
 * @param {[[number,number]]} coords
 * @param {number} dx
 * @param {number} dy
 * @returns [[number, number]]
 */
const remapCoords = (coords, dx, dy) =>
    coords
        .map(([x, y]) => [x + dx, y + dy])
    ;

const mapCoords = coords => {

    const dimensions = calcDimensions(coords);
    const width = dimensions[2] - dimensions[0] + 1;
    const height = dimensions[3] - dimensions[1] + 1;
    const map = Array(height).fill("").map(() => Array(width).fill("."));
    const remappedCoords = remapCoords(coords, dimensions[0] * -1, dimensions[1] * -1);
    for (let i = 1; i < remappedCoords.length; i++) {

        let [x1, y1] = remappedCoords[i - 1];
        let [x2, y2] = remappedCoords[i];
        if (x1 > x2) [x1, x2] = [x2, x1];
        if (y1 > y2) [y1, y2] = [y2, y1];
        for (let x = x1; x <= x2; x++)
            for (let y = y1; y <= y2; y++)
                map[y][x] = "#";

    }
    return map;

}
    ;

test(
    "U1 L1 mapCoords",
    [["#", "#"], [".", "#"]],
    () => mapCoords(draw([["U", 1], ["L", 1]]))
);
test(
    "U1 L1 D2 R2 mapCoords",
    [["#", "#", "."], ["#", "#", "."], ["#", "#", "#"]],
    () => mapCoords(draw([["U", 1], ["L", 1], ["D", 2], ["R", 2]]))
);

// draw map
// flood outside
// map - outside

const part1 = instructions =>
    instructions
        .pipe(draw)
        .pipe(mapCoords)
        //.tee(map => console.log(map.map(line => line.join("")).join("\n")))
        .pipe(map => [map, flood({ map, x: -1, y: -1 })])
        .pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
    ;

console.time("Part 1");
console.log("Part 1", part1(data));
console.timeEnd("Part 1");

const decodeInstructionParts = (meters, dir) =>
    [
        dir === 0 ? "R" : dir === 1 ? "D" : dir === 2 ? "L" : "U",
        parseInt(meters, 16)
    ]
    ;

const decodeInstruction = instruction =>
    decodeInstructionParts(
        Array.from(/(.{5})(.)\)/.exec(instruction)).slice(1)
    )
    ;

test("(#70c710)");
