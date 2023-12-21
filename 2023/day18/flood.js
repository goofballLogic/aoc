import { test } from "../test.js";

function around(maxx, maxy, x, y) {
    const ret = [];
    if (x > 0 && y > 0) ret.push([x - 1, y - 1]);
    if (x > 0) ret.push([x - 1, y]);
    if (x > 0 && y < maxy) ret.push([x - 1, y + 1]);
    if (y > 0) ret.push([x, y - 1]);
    if (y < maxy) ret.push([x, y + 1]);
    if (x < maxx && y > 0) ret.push([x + 1, y - 1]);
    if (x < maxx) ret.push([x + 1, y]);
    if (x < maxx && y < maxy) ret.push([x + 1, y + 1]);
    return ret;
}

test(
    "10,10,0,0 around",
    [[0, 1], [1, 0], [1, 1]],
    () => around(10, 10, 0, 0)
);

export function flood({ map: { lines }, empty = ".", x = 0, y = 0 }) {


}

const pairs = data => data.split(",").map(pair => pair.split("").map(x => parseInt(x)));

test(
    "...\n.#.\n...",
    pairs("00,01,02,10,12,20,21,22")
);
test(
    ".......\n.#####.\n.#.....\n.#.####\n.#.#..#\n.#....#\n.######",
    pairs("00,01,02,03,04,05,06,10,16,20,22,23,24,25,26,30,32,40,42,44,45,50,52,53,54,55,60")
);
