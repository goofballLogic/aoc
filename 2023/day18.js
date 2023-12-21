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

function drawMap(map, [a, i], [x, y]) {

}

test("R 3 from 0 0"); //, //[], ["R", 3], [0, 0]);

// draw map
// count map
// flood inside
// count inside
// inside + map

