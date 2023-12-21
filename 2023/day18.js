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
        default:
            return [x, y];
    }
}

test("go 0 0 U 1", [0, -1], () => go(0, 0, "U", 1));
test("go 0 0 D 1", [0, 1], () => go(0, 0, "D", 1));
test("go 0 0 L 1", [-1, 0]);
test("go 0 0 R 1", [1, 0]);

// draw map
// count map
// flood inside
// count inside
// inside + map

