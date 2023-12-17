import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const walk = ({ map, pos: [y, x], dest }) => {

    const steps = [[0, 1, map[0][1]]];
    console.log(steps);
    return 2;

};

const part1 = map =>
    walk({
        map,
        pos: [0, 0],
        dest: [map.length - 1, map[0].length]
    })
    ;

test("12", 2, () => part1(["12"]));
test("12\n34", 6); //, () => part1(["12", "34"]));
test("13\n24", 6); //, () => part1(["13", "24"]));
test("11111\n22222", 7);
test("1234\n1234\n1234", 11);
test("19111\n19191\n19191\n11191\n99991", 14);
