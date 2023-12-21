import { test } from "../test.js";

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
