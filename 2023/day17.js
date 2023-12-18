import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const N = 0, E = 1, S = 2, W = 3;
const compass = [N, E, S, W];

const straight = ({ dir }) => dir;
const turnRight = ({ dir }) => compass[dir + 1] || N;
const turnLeft = ({ dir }) => compass[dir - 1] || W;

const nextPosForDir = (dir, [y, x]) =>
    dir === E ? [y, x + 1]
        : dir === S ? [y + 1, x]
            : dir === W ? [y, x - 1]
                : [y - 1, x] // N
    ;

const mappedState = (map, state) =>
    ({ ...state, w: map[state.pos[0]]?.[state.pos[1]] });

const nextStateForDir = (dir, map, state) =>
    mappedState(map, { dir, pos: nextPosForDir(dir, state.pos) })
    ;

const nextStates = (map, state) =>
    [
        nextStateForDir(straight(state), map, state),
        nextStateForDir(turnRight(state), map, state),
        nextStateForDir(turnLeft(state), map, state)
    ].filter(({ w }) => w);

test(
    "12 E,0,0 next states",
    [{ dir: E, pos: [0, 1], w: 2 }],
    () => nextStates([[1, 2]], { dir: E, pos: [0, 0] })
);
test(
    "12\n34 E,0,0 next states",
    [{ dir: E, pos: [0, 1], w: 2 }, { dir: S, pos: [1, 0], w: 3 }],
    () => nextStates([[1, 2], [3, 4]], { dir: E, pos: [0, 0] })
);
test(
    "13\n24 E,0,0 next states",
    [{ dir: E, pos: [0, 1], w: 3 }, { dir: S, pos: [1, 0], w: 2 }],
    () => nextStates([[1, 3], [2, 4]], { dir: E, pos: [0, 0] })
);
const longMapText = ["11111", "22222"];
const longMap = longMapText.map(line => line.split("").map(x => parseInt(x)));
test(
    `${longMapText.join("\n")} E,0,0 next states`,
    [{ dir: E, pos: [0, 1], w: 1 }, { dir: S, pos: [1, 0], w: 2 }],
    () => nextStates(longMap, { dir: E, pos: [0, 0] })
);
test(
    "1234\n1234\n1234 W,0,0 next states",
    [{ dir: S, pos: [1, 0], w: 1 }],
    () => nextStates([[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]], { dir: W, pos: [0, 0] })
);
const snakeMapText = ["19111", "19191", "19191", "11191", "99991"];
const snakeMap = snakeMapText.map(line => line.split("").map(x => parseInt(x)));
test(
    snakeMapText.join("\n") + " N,2,2 next states",
    [{ dir: N, pos: [1, 2], w: 1 }, { dir: E, pos: [2, 3], w: 9 }, { dir: W, pos: [2, 1], w: 9 }],
    () => nextStates(snakeMap, { dir: N, pos: [2, 2] })
);
test(
    `${longMapText} E,0,1,1 next states`

)

// test("12", 2); //, () => part1(["12"]));
// test("12\n34", 6); //, () => part1(["12", "34"]));
// test("13\n24", 6); //, () => part1(["13", "24"]));
// test("11111\n22222", 7);
// test("1234\n1234\n1234", 11);
// test("19111\n19191\n19191\n11191\n99991", 14);
