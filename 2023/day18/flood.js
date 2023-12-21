import { test } from "../test.js";

export function flood({ map: { lines }, empty = ".", x = -1, y = -1 }) {


}

const pairs = data => data.split(",").map(pair => pair.split("").map(x => parseInt(x)));

test("...\n.#.\n...", pairs("00,01,02,10,12,20,21,22"));
test(".......\n.#####.\n.#.....\n.#.####\n.#....#\n.#....#\n.######");
