import { test } from "../test.js";
import { draw } from "./draw.js";

const calcDimensions = coords => coords
    .reduce((prev, next) => [
        Math.min(prev[0], next[0]),
        Math.min(prev[1], next[1]),
        Math.max(prev[2], next[0]),
        Math.max(prev[3], next[1])
    ], [Infinity, Infinity, -Infinity, -Infinity]);
test(
    "U1 calcDimension",
    [0, -1, 0, 0],
    () => calcDimensions(draw([["U", 1]]))
);
const remapCoords = (coords, dx, dy) => coords
    .map(([x, y]) => [x + dx, y + dy]);

export const mapCoords = coords => {

    const dimensions = calcDimensions(coords);
    const width = dimensions[2] - dimensions[0] + 1;
    const height = dimensions[3] - dimensions[1] + 1;
    const map = Array(height).fill("").map(() => Array(width).fill("."));
    const remappedCoords = remapCoords(coords, dimensions[0] * -1, dimensions[1] * -1);
    for (let i = 1; i < remappedCoords.length; i++) {

        let [x1, y1] = remappedCoords[i - 1];
        let [x2, y2] = remappedCoords[i];
        if (x1 > x2) [x1, x2] = [x2, x1];
        if (y1 > y2) [y1, y2] = [y2, y1];
        for (let x = x1; x <= x2; x++)
            for (let y = y1; y <= y2; y++)
                map[y][x] = "#";

    }
    return map;

};
test(
    "U1 L1 mapCoords",
    [["#", "#"], [".", "#"]],
    () => mapCoords(draw([["U", 1], ["L", 1]]))
);
test(
    "U1 L1 D2 R2 mapCoords",
    [["#", "#", "."], ["#", "#", "."], ["#", "#", "#"]],
    () => mapCoords(draw([["U", 1], ["L", 1], ["D", 2], ["R", 2]]))
);
