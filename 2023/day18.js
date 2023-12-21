import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";


const input = 1;
const day = 18;
const raw = readFileSync(`day${day}-input${input}.txt`)
    .toString()
    .trim()
    .split("\n")
    .map(x => x.split(" "))
    ;

console.log(raw);

// draw map
// count map
// flood inside
// count inside
// inside + map
function draw(lines, instruction) {

}
