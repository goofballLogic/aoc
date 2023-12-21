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
test(
    "10,10,10,10 around",
    [[9, 9], [9, 10], [10, 9]],
    () => around(10, 10, 10, 10)
);
test(
    "2,2,1,1 around",
    [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]],
    () => around(2, 2, 1, 1)
)

export function flood({ map, empty = ".", x = 0, y = 0 }) {

    const maxx = map[0].length;
    const maxy = map[1].length;
    const visited = new Set();
    const filled = [];
    const visitable = [[x, y]];
    let visitablei = 0;
    while (visitablei < visitable.length) {

        const [vx, vy] = visitable[visitablei];
        visitablei++;

        const key = `${vx}_${vy}`;
        if (!visited.has(key)) {

            if (map[vy]?.[vx] === empty) filled.push(key);
            visitable.push(...around(maxx, maxy, vx, vy));
            visited.add(key);

        }

    }
    return filled.sort().map(x => x.split("_").map(y => parseInt(y)));

}

const pairs = data => data.split(",").map(pair => pair.split("").map(x => parseInt(x)));

test(
    "...\n.#.\n...",
    pairs("00,01,02,10,12,20,21,22"),
    () => flood({ map: ["...", ".#.", "..."] })
);
// test(
//     ".......\n.#####.\n.#.....\n.#.####\n.#.#..#\n.#....#\n.######",
//     pairs("00,01,02,03,04,05,06,10,16,20,22,23,24,25,26,30,32,40,42,44,45,50,52,53,54,55,60"),
//     () => flood({ map: ".......\n.#####.\n.#.....\n.#.####\n.#.#..#\n.#....#\n.######".split("\n") })
// );
