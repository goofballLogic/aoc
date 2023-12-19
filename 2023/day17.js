import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

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

// test(
//     "12 E,0,0 next states",
//     [{ dir: E, pos: [0, 1], len: 1, wsum: 2 }],
//     () => nextStates([[1, 2]], { dir: E, pos: [0, 0] })
// );
// test(
//     "12\n34 E,0,0 next states",
//     [
//         { dir: E, pos: [0, 1], len: 1, wsum: 2 },
//         { dir: S, pos: [1, 0], len: 1, wsum: 3 }
//     ],
//     () => nextStates([[1, 2], [3, 4]], { dir: E, pos: [0, 0] })
// );
// test(
//     "13\n24 E,0,0 next states",
//     [
//         { dir: E, pos: [0, 1], len: 1, wsum: 3 },
//         { dir: S, pos: [1, 0], len: 1, wsum: 2 }
//     ],
//     () => nextStates([[1, 3], [2, 4]], { dir: E, pos: [0, 0] })
// );
// const longMapText = ["11111", "22222"];
// const longMap = longMapText.map(line => line.split("").map(x => parseInt(x)));
// test(
//     `${longMapText.join("\n")} E,0,0 next states`,
//     [
//         { dir: E, pos: [0, 1], len: 1, wsum: 1 },
//         { dir: S, pos: [1, 0], len: 1, wsum: 2 }
//     ],
//     () => nextStates(longMap, { dir: E, pos: [0, 0] })
// );
// test(
//     "1234\n1234\n1234 W,0,0 next states",
//     [{ dir: S, pos: [1, 0], len: 1, wsum: 1 }],
//     () => nextStates([[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]], { dir: W, pos: [0, 0] })
// );
// const snakeMapText = ["19111", "19191", "19191", "11191", "99991"];
// const snakeMap = snakeMapText.map(line => line.split("").map(x => parseInt(x)));
// test(
//     snakeMapText.join("\n") + " N,2,2 next states",
//     [
//         { dir: N, pos: [1, 2], len: 1, wsum: 1 },
//         { dir: E, pos: [2, 3], len: 1, wsum: 9 },
//         { dir: W, pos: [2, 1], len: 1, wsum: 9 }
//     ],
//     () => nextStates(snakeMap, { dir: N, pos: [2, 2] })
// );
// test(
//     `${longMapText.join("\n")} E,0,1 len 1, sum 1 next states`,
//     [
//         { dir: E, pos: [0, 2], len: 2, wsum: 2 },
//         { dir: S, pos: [1, 1], len: 1, wsum: 3 }
//     ],
//     () => nextStates(longMap, { dir: E, pos: [0, 1], len: 1, wsum: 1 })
// )
// test(
//     `${longMapText.join("\n")} E,0,2 len 2 next states`,
//     [
//         { dir: E, pos: [0, 3], len: 3, wsum: 3 },
//         { dir: S, pos: [1, 2], len: 1, wsum: 4 }
//     ],
//     () => nextStates(longMap, { dir: E, pos: [0, 2], len: 2, wsum: 2 })
// )
// test(
//     `${longMapText.join("\n")} E,0,3 len 3 next states`,
//     [
//         { dir: S, pos: [1, 3], len: 1, wsum: 5 }
//     ],
//     () => nextStates(longMap, { dir: E, pos: [0, 3], len: 3, wsum: 3 })
// );

// const stateKey = ({ dir, pos: [y, x], len }) => `${y}_${x}_${dir}_${len}`; //_${dir}_${len}`;

// test("stateKey for E,0,2 len 1", "0_2_1_1", () => stateKey({ dir: E, pos: [0, 2], len: 1 }));
// //test("stateKey for E,0,2 len 1", "0_2_1", () => stateKey({ dir: E, pos: [0, 2], len: 1 }));

// const startingStates =
//     [
//         { dir: E, pos: [0, 0], len: 0, wsum: 0 },
//         { dir: S, pos: [0, 0], len: 0, wsum: 0 }
//     ]
//         .map(state => [stateKey(state), state])
//     ;

// // const cheapestNode = stateMap =>
// //     Object.entries(stateMap).reduce((a, b) => b[1].wsum < a[1].wsum ? b : a);

// // test(
// //     "Cheapest node",
// //     startingStates.find(([x]) => x === "0_0_1_0"),
// //     () => cheapestNode(Object.fromEntries(startingStates))
// // );
// // test(
// //     "Cheapest node",
// //     ["0_0_2_0", { wsum: 1 }],
// //     () => cheapestNode({
// //         "0_0_1_0": { wsum: 2 },
// //         "0_0_2_0": { wsum: 1 }
// //     })
// // );
// // // test(
// // //     "Cheapest node",
// // //     ["0_0_1", startingStates["0_0_1"]],
// // //     () => cheapestNode(startingStates)
// // // );
// // // test(
// // //     "Cheapest node",
// // //     ["0_0_2", { wsum: 1 }],
// // //     () => cheapestNode({
// // //         "0_0_1": { wsum: 2 },
// // //         "0_0_2": { wsum: 1 }
// // //     })
// // // );

// const insertInCorrectSpot = (states1, newState) => {

//     const insertionPoint = states1.findIndex(([_, state]) => state.wsum > newState[1].wsum);
//     //console.log("Inserting", newState[1], "at", insertionPoint);
//     if (insertionPoint > -1) {

//         states1.splice(insertionPoint, 0, newState);

//     } else {

//         states1.push(newState);

//     }

// };

// const mergeSortedStates = (states1, states2) => {

//     // for each state in states2:
//     //      if it's already in states1:
//     //          if the new one is less:
//     //              remove the old one
//     //              insert the new one in the correct spot
//     //      if it's not already in states1:
//     //          insert the new one in the correct spot
//     const states2Map = Object.fromEntries(states2);
//     const states1Pruned = states1.filter(([key, state]) => {

//         if (key in states2Map) {
//             // we'll use the new one, so discard this one
//             if (states2Map[key].wsum < state.wsum) return false;
//             // discard the new one
//             delete states2Map[key];

//         }
//         return true;

//     });

//     for (const statePair of Object.entries(states2Map)) {

//         insertInCorrectSpot(states1Pruned, statePair);

//     }
//     //    return states1.sort(([_a, statea], [_b, stateb]) => statea.wsum - stateb.wsum);
//     return states1Pruned;

// }

// test(
//     `[a => {wsum:0}] [b => {wsum:1}]`,
//     [["a", { wsum: 0 }], ["b", { wsum: 1 }]],
//     () => mergeSortedStates([["a", { wsum: 0 }]], [["b", { wsum: 1 }]])
// );
// test(
//     `[a => {wsum:1}] [b => {wsum:0}]`,
//     [["b", { wsum: 0 }], ["a", { wsum: 1 }]],
//     () => mergeSortedStates([["a", { wsum: 1 }]], [["b", { wsum: 0 }]])
// );
// test(
//     `[a => {wsum:1}, b => {wsum:2}] [b => {wsum: 0}]`,
//     [["b", { wsum: 0 }], ["a", { wsum: 1 }]],
//     () => mergeSortedStates([["a", { wsum: 1 }], ["b", { wsum: 2 }]], [["b", { wsum: 0 }]])
// );

// function processCheapestPath(working, map, cheapState, alreadyVisited) {

//     // calulate new states from this starting point
//     const newStates =
//         nextStates(map, cheapState)
//             .map(state => [stateKey(state), state])
//             .filter(([key]) => !alreadyVisited.includes(key))
//             .sort(([_a, statea], [_b, stateb]) => statea.wsum - stateb.wsum);
//     // update our working map with the newly calculated states (if cheaper than existing)
//     return mergeSortedStates(working, newStates);

// }

// const part1 = map => {

//     let working = [...startingStates];
//     const dest = [map.length - 1, map[0].length - 1];
//     const destPrefix = dest.join("_");
//     let [cheapKey, cheapState] = working.shift();
//     let minDist = Number.MAX_VALUE;
//     const alreadyVisited = [];
//     while (!cheapKey.startsWith(destPrefix)) {

//         alreadyVisited.push(cheapKey);
//         working = processCheapestPath(working, map, cheapState, alreadyVisited);
//         [cheapKey, cheapState] = working.shift();
//         // const dist = Math.hypot(dest[0] - cheapState.pos[0], dest[1] - cheapState.pos[1]);
//         // if (dist < minDist) {
//         //     minDist = dist;
//         //     console.log(alreadyVisited.length, minDist);
//         // }
//         if (alreadyVisited.length % 1000 === 0) console.log(alreadyVisited.length);

//     }
//     //console.log(cheapKey, cheapState);
//     console.log(alreadyVisited.sort());
//     return cheapState.wsum;

// };

// test("12", 2, () => part1([[1, 2]]));
// test("12\n34", 6, () => part1([[1, 2], [3, 4]]));
// test("13\n24", 6, () => part1([[1, 3], [2, 4]]));
// test("11111\n22222", 7, () => part1([[1, 1, 1, 1, 1], [2, 2, 2, 2, 2]]));
// test("1234\n1234\n1234", 11, () => part1([[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]));
// test("19111\n19191\n11191", 10, () => part1([[1, 9, 1, 1, 1], [1, 9, 1, 9, 1], [1, 1, 1, 9, 1]]));
// test("19111\n19191\n19191\n11191\n99991", 18, () => part1(snakeMap));

// console.time("Part 1");
// console.log(part1(raw));
// console.timeEnd("Part 1");

const stateMapOf = map =>
    map.flatMap((line, y) =>
        line.flatMap((weight, x) =>
            compass.flatMap(dir => [
                { weight, y, x, len: 1, dir, cost: Infinity },
                { weight, y, x, len: 2, dir, cost: Infinity },
                { weight, y, x, len: 3, dir, cost: Infinity }
            ])
        )
    );

const initialiseStartingStates = map => {
    for (const state of map) {
        if (state.y === 0 && state.x === 0) {
            state.cost = 0;
        }
    }
    return map;
}

const goStraight = ({ x, y, len, dir }) => ({
    ...nextPosForDir(dir, { x, y }),
    len: len + 1,
    dir
});

const goRight = ({ x, y, dir }) => ({
    ...nextPosForDir(turnRight(dir), { x, y }),
    len: 1,
    dir: turnRight(dir)
});

const goLeft = ({ x, y, dir }) => ({
    ...nextPosForDir(turnLeft(dir), { x, y }),
    len: 1,
    dir: turnLeft(dir)
});

const isStateMatch = (a, b) => a.x === b.x && a.y === b.y && a.dir === b.dir && a.len === b.len;

const hasStateMatch = (states, state) =>
    states.some(x => isStateMatch(state, x))
    ;

let v = 0;

const visit = (state, working, potential) => {

    //console.log(working.length);
    for (const visitable of [
        goStraight(state),
        goRight(state),
        goLeft(state)
    ]) {

        let foundWorking = false;
        for (const calculated of working) {

            if (isStateMatch(visitable, calculated)) {

                foundWorking = true;
                const proposedCost = state.cost + calculated.weight;
                calculated.cost = Math.min(calculated.cost, proposedCost);
                //console.log("Updated", calculated);
                //console.log("Sorting", working.length, "working");
                working.sort((a, b) => a.cost - b.cost);
                break;
            }

        }
        if (!foundWorking) {

            // look for allowable state
            for (const node of potential) {

                if (isStateMatch(visitable, node)) {

                    // remove it from the potential set
                    potential.splice(potential.indexOf(node), 1);
                    // and add it to the working set
                    working.push(node);
                    // set its cost
                    const proposedCost = state.cost + node.weight;
                    node.cost = proposedCost;
                    //console.log("Sorting", working.length, "working");
                    working.sort((a, b) => a.cost - b.cost);
                    break;

                }
            }

        }

    }

};

const part1 = map => {
    const stateMap = stateMapOf(map)
        ;

    console.log("State map length", stateMap.length);
    const dest = { x: map[0].length - 1, y: map.length - 1 };
    console.log("Destination", dest);
    let count = 0;

    const paths = [];
    const working = [];
    const potential = [];
    for (const m of stateMap) {

        if (m.x === 0 && m.y === 0) {

            working.push(m);
            m.cost = 0;

        } else {

            potential.push(m);

        }

    }
    console.log("Working", working);
    console.log("Potential", potential);

    let next = working.pop();
    console.log(next);
    do {

        if (count++ % 100 === 0) console.log(count);
        visit(next, working, potential);
        next = fetchNext(working, potential);
        if (isStateMatch({ ...next, ...dest }, next))
            paths.push(next);

    } while (next && next.cost !== Infinity)
    return paths
        .filter(state => state.x === map[0].length - 1 && state.y === map.length - 1)
        .filter(state => state.cost !== Infinity)
        .sort((a, b) => a.cost - b.cost)
        .pipe(candidates => candidates[0].cost);

};

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

function fetchNext(working, potential) {
    if (working.length) return working.shift();
    return potential.shift();
}

test("111111111111\n999999999991\n999999999991\n999999999991\n999999999991 part2");
