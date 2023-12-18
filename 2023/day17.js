import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const N = 0, E = 1, S = 2, W = 3;

const goStraight = map => [{ dir: E, pos: [0, 1] }];

const goRight = map => [{ dir: S, pos: [1, 0] }];

const nextStates = (map, state) =>
    [
        goStraight(map, state),
        //goRight(state)
    ].filter(x => x);

test("12 E,0,0 next states", [[{ dir: E, pos: [0, 1] }]], () => nextStates([[1, 2]], { dir: E, pos: [0, 0] }));
test("12\n34 E,0,0 next states", [[{ dir: E, pos: [0, 1] }, { dir: S, pos: [1, 0] }]]);
test("12", 2); //, () => part1(["12"]));
test("12\n34", 6); //, () => part1(["12", "34"]));
test("13\n24", 6); //, () => part1(["13", "24"]));
test("11111\n22222", 7);
test("1234\n1234\n1234", 11);
test("19111\n19191\n19191\n11191\n99991", 14);
