import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";
import { sort } from "./merge-sort.js";

const input = 2;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`)
    .toString()
    .trim()
    .split("\n")
    .map(line => line.split("").map(x => parseInt(x)));

const N = 0, E = 1, S = 2, W = 3;
const compass = [N, E, S, W];

const turnRight = dir => dir === W ? N : compass[dir + 1];
const turnLeft = dir => dir === N ? W : compass[dir - 1];

const nextPosForDir = (dir, { y, x }) => ({
    y: dir === S ? y + 1 : dir === N ? y - 1 : y,
    x: dir === W ? x - 1 : dir === E ? x + 1 : x
});

const stateKey = ({ y, x, len, dir }) =>
    `${y}_${x}_${len}_${dir}`
    ;

const stateMapOf = (map, part = 1) =>
    map.flatMap((line, y) =>
        line.flatMap((weight, x) =>
            compass.flatMap(dir => [
                { weight, y, x, len: 1, dir, cost: Infinity },
                { weight, y, x, len: 2, dir, cost: Infinity },
                { weight, y, x, len: 3, dir, cost: Infinity }
            ].concat(part < 2 ? [] : [
                { weight, y, x, len: 4, dir, cost: Infinity },
                { weight, y, x, len: 5, dir, cost: Infinity },
                { weight, y, x, len: 6, dir, cost: Infinity },
                { weight, y, x, len: 7, dir, cost: Infinity },
                { weight, y, x, len: 8, dir, cost: Infinity },
                { weight, y, x, len: 9, dir, cost: Infinity },
                { weight, y, x, len: 10, dir, cost: Infinity }
            ]))
        )
    )
    ;

const goStraight = ({ x, y, len, dir, path }, part) =>
    ((part === 2 && len === 10) || (part === 1 && len === 3))
        ? null // only 10 steps allowed for part 2, only 3 steps allowed for part 1
        : ({
            ...nextPosForDir(dir, { x, y }),
            len: len + 1,
            dir,
            path: [...path, { x, y }]
        });

const goRight = ({ x, y, len, dir, path }, part) =>
    (part === 2 && len < 4) // can only turn after 4 steps for part 2
        ? null
        : ({
            ...nextPosForDir(turnRight(dir), { x, y }),
            len: 1,
            dir: turnRight(dir),
            path: [...path, { x, y }]
        });

const goLeft = ({ x, y, len, dir, path }, part) =>
    (part === 2 && len < 4) // can only turn after 4 steps for part 2
        ? null
        : ({
            ...nextPosForDir(turnLeft(dir), { x, y }),
            len: 1,
            dir: turnLeft(dir),
            path: [...path, { x, y }]
        });

const isStateMatch = (a, b) => a.x === b.x && a.y === b.y && a.dir === b.dir && a.len === b.len;

const visit = ({ state, working, processed, part, limit, map }) => {

    let moves = [
        goStraight(state, part),
        goRight(state, part),
        goLeft(state, part)
    ]
        .filter(x => x)
        .filter(({ x, y }) => x >= 0 && x <= limit.x && y >= 0 && y <= limit.y) // within the bounds of the state map
        .map(x => Object.assign(x, { key: stateKey(x) }))
        .filter(x => !processed.includes(x.key)); // not already processed

    if (moves.length) {

        const pathsToAdd = [];
        const existingPaths = [];
        for (const calculated of working) {

            let isFound = false;
            let processedMoves = [];
            for (const move of moves) {

                if (isStateMatch(move, calculated)) {

                    isFound = true;
                    processedMoves.push(move);
                    const proposedCost = state.cost + calculated.weight;
                    if (proposedCost < calculated.cost) {

                        // we found a shorter path
                        pathsToAdd.push(calculated);
                        calculated.cost = proposedCost;

                    } else {

                        // the existing path is shorter
                        existingPaths.push(calculated);

                    }

                }

            }
            // what moves do we still need to process?
            moves = moves.filter(move => !processedMoves.includes(move));

            if (!isFound) {

                // not a visitable path
                existingPaths.push(calculated);

            }

        }
        for (const move of moves) {

            move.weight = map[move.y][move.x];
            move.cost = state.cost + move.weight;
            move.path = [...state.path, [move.x, move.y]];
            pathsToAdd.push(move);

        }
        // sort paths
        pathsToAdd.sort((a, b) => a.cost - b.cost);
        const sorted = sort(existingPaths, pathsToAdd, state => state.cost);
        return sorted;
        // for (const visitable of moves) {

        //     let foundWorking = false;
        //     for (const calculated of working) {

        //         if (isStateMatch(visitable, calculated)) {

        //             foundWorking = true;
        //             const proposedCost = state.cost + calculated.weight;
        //             calculated.cost = Math.min(calculated.cost, proposedCost);
        //             break;

        //         }

        //     }
        //     if (!foundWorking) {

        //         visitable.weight = map[visitable.y][visitable.x];
        //         visitable.cost = state.cost + visitable.weight;
        //         visitable.path = [...state.path, [visitable.x, visitable.y]];
        //         working.push(visitable);

        //     }

        // }
        // working.sort((a, b) => a.cost - b.cost);

    } else {

        return working;

    }

};


const fetchNext = (working, potential) =>
    working.length ? working.shift() : potential.shift()
    ;

const part1 = map =>
    part(map, 1)
    ;

test("12", 2, () => part1([[1, 2]]));
test("12\n34", 6, () => part1([[1, 2], [3, 4]]));
test("13\n24", 6, () => part1([[1, 3], [2, 4]]));
test("11111\n22222", 7, () => part1([[1, 1, 1, 1, 1], [2, 2, 2, 2, 2]]));
test("1234\n1234\n1234", 11, () => part1([[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]));
test("19111\n19191\n11191", 10, () => part1([[1, 9, 1, 1, 1], [1, 9, 1, 9, 1], [1, 1, 1, 9, 1]]));
test("19111\n19191\n19191\n11191\n99991", 18, () => part1([[1, 9, 1, 1, 1], [1, 9, 1, 9, 1], [1, 9, 1, 9, 1], [1, 1, 1, 9, 1], [9, 9, 9, 9, 1]]));

// console.time("Part 1");
// console.log(part1(raw));
// console.timeEnd("Part 1");


const part2 = map => part(map, 2);

const p2t1dataText = "111111111111\n999999999991\n999999999991\n999999999991\n999999999991";
const p2t1data = p2t1dataText.split("\n").map(line => line.split("").map(x => parseInt(x)));
test(`${p2t1dataText} part2`, 71, () => part2(p2t1data));

console.time("Part 2");
console.log(part2(raw));
console.timeEnd("Part 2");

function part(map, part) {

    const stateMap = stateMapOf(map, part);

    console.log("State map length", stateMap.length);
    const dest = { x: map[0].length - 1, y: map.length - 1 };
    console.log("Destination", dest);
    let count = 0;

    const paths = [];
    const processed = [];
    let working = [];
    for (const m of stateMap) {

        if (m.x === 0 && m.y === 0) {

            working.push(m);
            m.path = [[m.x, m.y]];
            m.cost = 0;
            m.key = stateKey(m);

        }

    }

    let next = working.pop();
    do {

        if (count > stateMap.length) {
            console.log(processed, working);
            stop;
        }
        //console.log(next, working);
        if (count++ % 100 === 0) console.log(count);
        working = visit({ state: next, working, processed, part, limit: dest, map });
        next = fetchNext(working, []);
        if (next) {
            processed.push(next.key);
            if (isStateMatch({ ...next, ...dest }, next))
                paths.push(next);
        }

    } while (next && next.cost !== Infinity);
    //for (const p of paths) { console.log(p.cost, p.len, p.path); }

    console.log(processed);
    return paths
        .filter(state => state.x === map[0].length - 1 && state.y === map.length - 1)
        .filter(state => state.cost !== Infinity)
        .filter(state => part === 1 || state.len > 3)
        .sort((a, b) => a.cost - b.cost)
        // .pipe(candidates => {
        //     for (const c of candidates)
        //         console.log(c.cost, c.path);
        //     return candidates;
        // })
        .pipe(candidates => candidates[0].cost)
        ;
}

