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

function drawMap({ map, x, y }, [a, i]) {

}

test("R 3 from 0 0", { map: [[".###"]], x: 3, y: 0 });
test("D 1 from 0 0", { map: [["."], ["#"]], x: 0, y: 1 });
test("L 2 from 0 0", { map: [["##."]], x: 0, y: 0 });
test("U 1 from 0 0", { map: [["#", "."]], x: 0, y: 0 });
test("U 1 from 2 2", [["...", "..#", "..."]]);

// draw map
// count map
// flood inside
// count inside
// inside + map

