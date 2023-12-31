import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 2;
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

const walkBy = ({ map, pos: [y, x], move, energised, dir }) => {

    let symbol;
    do {

        [y, x] = move([y, x]);
        symbol = map[y]?.[x];
        if (symbol) {
            const key = `${y}_${x}`;
            if (!(key in energised)) energised[key] = {};
            if (energised[key][dir]) {

                // we've been here before from this direction: ignore
                symbol = null;

            } else {

                //console.log("New", key, dir);
                energised[key][dir] = 1;

            }

        }

    } while (symbol === ".");
    return symbol ? [[y, x, symbol], energised] : [null, energised];

};

const walkEast = ({ map, pos, energised }) =>
    walkBy({ map, pos, move: ([y, x]) => [y, x + 1], energised, dir: E })
    ;

test(
    ".. 0,0 walkEast",
    [null, { "0_1": { [E]: 1 } }],
    () => walkEast({ map: [".."], pos: [0, 0], energised: {} })
);
test(
    "./. 0,0 walkEast",
    [[0, 1, "/"], { "0_1": { [E]: 1 } }],
    () => walkEast({ map: ["./."], pos: [0, 0], energised: {} })
);
test(
    ".. 0,0 walkEast",
    [null, { "hello": "world", "0_1": { [E]: 1 } }],
    () => walkEast({ map: [".."], pos: [0, 0], energised: { "hello": "world" } })
);
test(
    ". 0,0 walkEast",
    [null, { "0_0": { [E]: 1 } }],
    () => walkEast({ map: ["."], pos: [0, -1], energised: {} })
);

const walkWest = ({ map, pos, energised }) =>
    walkBy({ map, pos, move: ([y, x]) => [y, x - 1], energised, dir: W })
    ;

test(
    "./. 0,2 walkWest",
    [[0, 1, "/"], { x: 1, "0_1": { [W]: 1 } }],
    () => walkWest({ map: ["./."], pos: [0, 2], energised: { x: 1 } })
);

const walkSouth = ({ map, pos, energised }) =>
    walkBy({ map, pos, move: ([y, x]) => [y + 1, x], energised, dir: S })
    ;

test(
    ".\n/\n. 0,0 walkSouth",
    [[1, 0, "/"], { "1_0": { [S]: 1 } }],
    () => walkSouth({ map: [".", "/", "."], pos: [0, 0], energised: { x: 1 } })
);

const walkNorth = ({ map, pos, energised }) =>
    walkBy({ map, pos, move: ([y, x]) => [y - 1, x], energised, dir: N })
    ;

test(
    ".\n/\n. 2,0 walkNorth",
    [[1, 0, "/"], { x: 1, "1_0": { [N]: 1 } }],
    () => walkNorth({ map: [".", "/", "."], pos: [2, 0], energised: { x: 1 } })
);

const walkDirection = {
    [N]: walkNorth,
    [S]: walkSouth,
    [W]: walkWest,
    [E]: walkEast
};

const walk = (map, [dir, line, x], energised) =>
    walkDirection[dir]({ map, pos: [line, x], energised })
    ;

test(
    ".. Walk E,0,0",
    [null, { x: 1, "0_1": { [E]: 1 } }],
    () => walk([".."], [E, 0, 0], { x: 1 })
);
test(
    ".\\ Walk E,0,0",
    [[0, 1, "\\"], { "0_1": { [E]: 1 } }],
    () => walk([".\\"], [E, 0, 0], {})
);

const pathsAfterTile = (dir, [line, x, symbol]) =>
    transformBeam(dir, symbol)
        .map(newDirection => [newDirection, line, x])
    ;

const walkAndTransform = (map, path, energised) =>
    walk(map, path, energised)
        .pipe(([dest, count]) => [
            dest ? pathsAfterTile(path[0], dest) : [],
            count
        ])
    ;

test(
    ".|...\.... Walk E,0,0",
    [[[N, 0, 1], [S, 0, 1]], { "0_1": { [E]: 1 } }],
    () => walkAndTransform([".|...\...."], [E, 0, 0], {})
);
test(
    ".|\n..\n..\n..\n.- Walk S,0,1",
    [[[W, 4, 1], [E, 4, 1]], { "1_1": { [S]: 1 }, "2_1": { [S]: 1 }, "3_1": { [S]: 1 }, "4_1": { [S]: 1 } }],
    () => walkAndTransform([".|", "..", "..", "..", ".-"], [S, 0, 1], {})
);

function countWalk(init, map) {

    let stack = [init];
    let energised = {};
    let paths;
    while (stack.length) {

        let next = stack.pop();
        [paths, energised] = walkAndTransform(map, next, energised);
        stack.push(...paths);

    }
    return Object.values(energised).length;

}

const part1 = map => {

    const init = [E, 0, -1];
    return countWalk(init, map);

}

const parseTestData = x => x.split(" ")[0].split("\n");

test(["..", ".. part1"].join("\n"), 2, x => part1(parseTestData(x)));
test([".|", ".. part1"].join("\n"), 3, x => part1(parseTestData(x)));
test([".|", "./"].join("\n"), 4, x => part1(parseTestData(x)));
test([".|", "\\/"].join("\n"), 4, x => part1(parseTestData(x)));
test([".|.", "/-\\", "..."].join("\n"), 7, x => part1(parseTestData(x)));
test([".|\\", ".\\/"].join("\n"), 5, x => part1(parseTestData(x)));

const part2 = map =>
    Math.max(
        map.reduce((max, line, y) =>
            Math.max(
                max,
                countWalk([E, y, -1], map),
                countWalk([W, y, line.length], map)
            ), 0),
        map[0].split("").reduce((max, _, x) =>
            Math.max(
                max,
                countWalk([S, -1, x], map),
                countWalk([N, map[0].length, x], map)
            ), 0)
    )
    ;

test(["./\\", ".|/ part 2"].join("\n"), 5, x => part2(parseTestData(x)));

console.time("Part 1");
console.log("Part 1", part1(raw));
console.timeEnd("Part 1");

console.time("Part 2");
console.log("Part 2", part2(raw));
console.timeEnd("Part 2");
