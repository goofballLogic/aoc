import { readFileSync } from "node:fs";
import "./evil.js";
import { flood } from "./day18/flood.js";
import { calcDimensions, mapCoords } from "./day18/mapCoords.js";
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

const inspectMap = map => map.map(line => line.join("")).join("\n");

const part1 = instructions =>
    instructions
        .pipe(draw)
        .pipe(coords => [coords, ...compressCoordinates(coords)])
        .pipe(([coords, compressedCoords, compressedRanges]) => {
            console.log(coords);
            console.log(compressedCoords);
            const outerFlood =
                compressedCoords
                    .pipe(mapCoords)
                    .pipe(map => flood({ map, x: -1, y: -1 }))
                    .pipe(flooded => decompressCoordinates(flooded, compressedRanges));

            console.log("Outer flood", outerFlood.slice(0, 10), "...");
            const outerFloodArea = outerFlood
                .map(calcArea)
                .sum()
                ;
            console.log("Outer flood area", outerFloodArea);
            const dimensions = calcDimensions(coords);
            const mapSize = calcArea(dimensions);
            console.log("Map size", mapSize);

            return mapSize - outerFloodArea;

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

                //.pipe(map => [map, flood({ map, x: -1, y: -1 })])
                //.tee(x => console.log(x))
                //.pipe(([map, flooded]) => (map[0].length * map.length - flooded.length))
                ;
            //
            return false;

        })
    ;

console.time("Part 2");
console.log("Part 2", part2(data));
console.timeEnd("Part 2");
function calcArea(dimensions) {
    return (dimensions[2] - dimensions[0] + 1) * (dimensions[3] - dimensions[1] + 1);
}

