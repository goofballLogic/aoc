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

const backslashReflect = dir => [
    dir === E ? S : dir === W ? N : dir === S ? W : E
];

const tileStrategy = {
    "|": splitNS,
    "-": splitWE,
    "\\": backslashReflect,
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
test("transform beam: S\\W", [W], () => transformBeam(S, "\\"));
test("transform beam: N\\E", [E], () => transformBeam(N, "\\"));
