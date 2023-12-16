import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 16;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const N = 0, E = 1, S = 2, W = 3;

const splitNS = fromDirection =>
    [N, S].includes(fromDirection) ? [fromDirection] : [N, S]
    ;

const splitWE = fromDirection =>
    [W, E].includes(fromDirection) ? [fromDirection] : [W, E]
    ;

//   \
const backslashReflect = dir => [
    dir === E ? S : dir === W ? N : dir === S ? E : W
];

const slashReflect = dir => [
    dir === E ? N : dir === W ? S : dir === S ? W : E
];

const tileStrategy = {
    "|": splitNS,
    "-": splitWE,
    "\\": backslashReflect,
    "/": slashReflect,
    ".": dir => [dir]
};

const transformBeamWithStrategy = (fromDirection, strategy) =>
    strategy(fromDirection)
    ;

const transformBeam = (fromDirection, tile) =>
    transformBeamWithStrategy(
        fromDirection,
        tileStrategy[tile] || tileStrategy["."])
    ;

test("transform beam: E|NS", [N, S], () => transformBeam(E, "|"));
test("transform beam: W|NS", [N, S], () => transformBeam(W, "|"));
test("transform beam: N|N", [N], () => transformBeam(N, "|"));
test("transform beam: S|S", [S], () => transformBeam(S, "|"));

test("transform beam: E-E", [E], () => transformBeam(E, "-"));
test("transform beam: W-W", [W], () => transformBeam(W, "-"));
test("transform beam: N-WE", [W, E], () => transformBeam(N, "-"));
test("transform beam: S-WE", [W, E], () => transformBeam(S, "-"));

test("transform beam: E\\S", [S], () => transformBeam(E, "\\"));
test("transform beam: W\\N", [N], () => transformBeam(W, "\\"));
test("transform beam: S\\E", [E], () => transformBeam(S, "\\"));
test("transform beam: N\\W", [W], () => transformBeam(N, "\\"));

test("transform beam: E/N", [N], () => transformBeam(E, "/"));
test("transform beam: W/S", [S], () => transformBeam(W, "/"));
test("transform beam: S/W", [W], () => transformBeam(S, "/"));
test("transform beam: N/E", [E], () => transformBeam(N, "/"));

const walkBy = (map, [y, x], move) => {

    let symbol;
    do {

        [y, x] = move([y, x]);
        symbol = map[y][x];

    } while (symbol === ".");
    return symbol ? [y, x, symbol] : null;

};

const walkEast = (map, pos) =>
    walkBy(map, pos, ([y, x]) => [y, x + 1])
    ;

test(".. 0,0 walkEast", null, () => walkEast([".."], [0, 0]));
test("./. 0,0 walkEast", [0, 1, "/"], () => walkEast(["./."], [0, 0]));

const walkWest = (map, pos) =>
    walkBy(map, pos, ([y, x]) => [y, x - 1])
    ;

test("./. 0,2 walkWest", [0, 1, "/"], () => walkWest(["./."], [0, 2]));

const walk = (map, [dir, line, x]) =>
    [[E, 0, 1]]
    ;

test(".. Walk E,0,0", [[E, 0, 1]], () => walk([".."], [E, 0, 0]));
test(".\\ Walk E,0,0", [[S, 0, 1]]);
test(".|...\.... Walk E,0,0", [[N, 0, 1], [S, 0, 1]]); //, () => walk([".|...\...."], [E, 0, 0]));
test(".|\n..\n..\n..\n.- Walk S,0,1", [[W, 4, 1], [E, 4, 1]]);


