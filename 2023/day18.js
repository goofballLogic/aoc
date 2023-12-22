import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";
import { flood } from "./day18/flood.js";
import { draw } from "./day18/draw.js";
import { mapCoords } from "./day18/mapCoords.js";

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

const part1 = instructions =>
    instructions
        .pipe(draw)
        .pipe(mapCoords)
        .pipe(map => [map, flood({ map, x: -1, y: -1 })])
        .pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
    ;

console.time("Part 1");
console.log("Part 1", part1(data));
console.timeEnd("Part 1");

const decodeInstructionParts = (meters, dir) =>
    [
        dir === "0" ? "R" : dir === "1" ? "D" : dir === "2" ? "L" : "U",
        parseInt(meters, 16)
    ]
    ;

const decodeInstruction = instruction =>
    decodeInstructionParts(
        ...Array.from(/(.{5})(.)\)/.exec(instruction)).slice(1)
    )
    ;

test("(#70c710)", ["R", 461937], decodeInstruction);

const part2 = instructions =>
    instructions
        .map(decodeInstruction)
        .pipe(draw)
        .pipe(mapCoords)
        .pipe(map => [map, flood({ map, x: -1, y: -1 })])
        .pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
    ;

// console.time("Part 2");
// console.log("Part 2", part1(data));
// console.timeEnd("Part 2");
