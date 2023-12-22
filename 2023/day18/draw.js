import { test } from "../test.js";

function go(x, y, a, i) {
    switch (a) {
        case "U":
            return [x, y - i];
        case "D":
            return [x, y + i];
        case "L":
            return [x - i, y];
        case "R":
            return [x + i, y];
        default:
            return [x, y];
    }
}

test("go 0 0 U 1", [0, -1], () => go(0, 0, "U", 1));
test("go 0 0 D 2", [0, 2], () => go(0, 0, "D", 2));
test("go 0 0 L 3", [-3, 0], () => go(0, 0, "L", 3));
test("go 0 0 R 4", [4, 0], () => go(0, 0, "R", 4));

export function draw(instructions) {

    const map = [[0, 0]];
    let [x, y] = [0, 0];
    for (const instruction of instructions) {
        [x, y] = go(x, y, ...instruction);
        map.push([x, y]);
    }
    return map;

}

test("U1", [[0, 0], [0, -1]], () => draw([["U", 1]]));
test("U1 R1", [[0, 0], [0, -1], [1, -1]], () => draw([["U", 1], ["R", 1]]));

/*
    ####
    #..#   ####
    #..#   #..#
    #### > ####
*/

const pairs = data =>
    data
        .split(" ")
        .map(pair =>
            pair
                .split("")
                .map(x => parseInt(x)));

test("00 30 33 03", pairs("00 30 32 03"));
