import { readFileSync } from "node:fs";
import "./evil.js";
import { flood } from "./day18/flood.js";
import { mapCoords } from "./day18/mapCoords.js";
import { decodeInstruction } from "./day18/decodeInstruction.js";
import { draw } from "./day18/draw.js";
import { compressCoordinates } from "./day18/compression.js";

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

const part1 = instructions =>
    instructions
        .pipe(draw)
        .pipe(compressCoordinates)
        .pipe(([coords, compressed]) => {
            const calc =
                coords
                    .pipe(mapCoords)
                    .pipe(map => [map, flood({ map, x: -1, y: -1 })])
                    .pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
                ;
            return calc;

        })
    ;

console.time("Part 1");
console.log("Part 1", part1(data));
console.timeEnd("Part 1");

const part2 = instructions =>
    instructions
        .map(decodeInstruction)
        .pipe(draw)
        .pipe(compressCoordinates)
        .pipe(([coords, compressed]) => {
            const calc =
                coords
                    .pipe(mapCoords)
                    .tap(x => console.log(x))
                //                    .tee(x => console.log(x.join("")))
                //.pipe(map => [map, flood({ map, x: -1, y: -1 })])
                //.tee(x => console.log(x))
                //.pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
                ;
            //
            return calc;

        })
    ;

console.time("Part 2");
console.log("Part 2", part2(data));
console.timeEnd("Part 2");
