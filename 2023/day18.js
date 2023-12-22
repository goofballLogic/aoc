import { readFileSync } from "node:fs";
import "./evil.js";
import { flood } from "./day18/flood.js";
import { calcDimensions, mapCoords, remapCoords } from "./day18/mapCoords.js";
import { decodeInstruction } from "./day18/decodeInstruction.js";
import { draw } from "./day18/draw.js";
import { compressCoordinates, decompressCoordinates } from "./day18/compression.js";

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

const calcArea = dimensions =>
    (dimensions[2] - dimensions[0] + 1) * (dimensions[3] - dimensions[1] + 1)
    ;

const part1Simple = instructions =>
    instructions
        .pipe(draw)
        .pipe(mapCoords)
        .pipe(map => [map, flood({ map, x: -1, y: -1 })])
        .tap(([map, flooded]) => {
            console.log("Outer flood area", flooded.length);
            console.log("Map size", map.length * map[0].length);
        })
        .pipe(([map, flooded]) =>
            map.length * map[0].length - flooded.length)
    ;

console.time("Part 1 simple");
console.log("Part 1 simple", part1Simple(data));
console.timeEnd("Part 1 simple");

const part1 = instructions =>
    instructions
        .pipe(draw)
        .pipe(coords => {
            const dimensions = calcDimensions(coords);
            return remapCoords(coords, -dimensions[0], -dimensions[1])
        })
        .pipe(coords => [coords, ...compressCoordinates(coords)])
        .pipe(([coords, compressedCoords, compressedRanges]) =>
            compressedCoords
                .pipe(mapCoords)
                .pipe(map => flood({ map, x: -1, y: -1 }))
                .pipe(flooded => decompressCoordinates(flooded, compressedRanges))
                .map(calcArea)
                .sum()
                .pipe(floodedArea => calcArea(calcDimensions(coords)) - floodedArea))
    ;

console.time("Part 1");
console.log("Part 1", part1(data));
console.timeEnd("Part 1");

const part2 = instructions =>
    instructions
        .map(decodeInstruction)
        .pipe(part1)
    ;

console.time("Part 2");
console.log("Part 2", part2(data));
console.timeEnd("Part 2");

