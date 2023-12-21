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
    .map(x => x.split(" "))
    .map(([a, x, c]) => [a, parseInt(x), c])
    ;

console.log(data);

// draw map
// count map
// flood inside
// count inside
// inside + map
function draw(lines, instruction) {

}
