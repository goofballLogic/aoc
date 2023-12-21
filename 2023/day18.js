import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";


const input = 1;
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
            return [x, y - 1];
        case "D":
            return [x, y + 1];
        case "L":
            return [x - 1, y];
        case "R":
            return [x + 1, y];
        default:
            return [x, y];
    }
}

test("go 0 0 U 1", [0, -1], () => go(0, 0, "U", 1));
test("go 0 0 D 1", [0, 1], () => go(0, 0, "D", 1));
test("go 0 0 L 1", [-1, 0], () => go(0, 0, "L", 1));
test("go 0 0 R 1", [1, 0], () => go(0, 0, "R", 1));

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

function dimensions(coords) {

    const [minX, minY, maxX, maxY] = coords.reduce((prev, next) => [
        Math.min(prev[0], next[0]),
        Math.min(prev[1], next[1]),
        Math.max(prev[2], next[0]),
        Math.max(prev[3], next[1])
    ], [Infinity, Infinity, -Infinity, -Infinity]);
    console.log(minX, minY, maxX, maxY);
    return [maxX - minX + 1, maxY - minY + 1];

}

test("U1", [1, 2], () =>
    dimensions(
        draw([["U", 1]])
    ));

// draw ma
// count map
// flood inside
// count inside
// inside + map

