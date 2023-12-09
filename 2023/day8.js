import { readFileSync } from "node:fs";
const filename = "day8-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");

console.log(raw.join("\n"));

const path = raw[0].split("");
const nodes = raw
    .slice(2)
    .map(x => x.split("=").map(y => y.trim()))
    .map(x => [x[0], Array.from(/\((.*), (.*)\)/g.exec(x[1])).slice(1)])
    ;

const nodeMap = Object.fromEntries(nodes);

const nodeMap2 = {};
nodes.forEach(([key, [left, right]]) => {

    if (!(key in nodeMap2)) nodeMap2[key] = { key };
    if (!(left in nodeMap2)) nodeMap2[left] = { key: left };
    if (!(right in nodeMap2)) nodeMap2[right] = { key: right };
    nodeMap2[key].left = nodeMap2[left];
    nodeMap2[key].right = nodeMap2[right];

});

console.log(nodeMap2);

function walk(here, stopHereTest, memo) {

    const memoKey = `${here[0].key}_${here[2]}`;
    if (memoKey in memo) {

        const memoised = memo[memoKey];
        return [memoised[0], memoised[1] + here[1], memoised[2]];

    } else {

        let walkSteps = 0;
        do {

            here = path.reduce(([from, steps, pathi], dir, i) =>
                //console.log({ from, steps, dir, pathi, i, test: stopHereTest(from) }) ||
                //  (function () { if (walkSteps > 10) throw new Error("stop"); }()) ||
                (pathi < i || (walkSteps++ > 0 && stopHereTest(from)))
                    // already arrived or pathi < i
                    ? [
                        from,
                        steps,
                        pathi
                    ]
                    // next step
                    : [
                        dir === "L" ? from.left : from.right,
                        steps + 1,
                        (i < path.length - 1) ? i + 1 : 0, // if we reached the end of the path, next step will have index 0, otherwise it's just +1
                    ]
                ,
                here);
            if (here[0].key === "XXX") throw new Error("XXX");

        } while (!stopHereTest(here[0]))

        memo[memoKey] = [here[0], walkSteps, here[3]];
        return here;

    }

}

(function part1() {

    if (!("AAA" in nodeMap2)) return; // part 2 sample

    const result = walk(
        [nodeMap2["AAA"], 0],
        node => node.key === "ZZZ",
        {}
    );
    console.log("Part 1", result[1]);

}());

(function part2() {

    console.time("x");
    let heres = Object
        .keys(nodeMap2)
        .filter(key => key.endsWith("A"))
        .map(key => [nodeMap2[key], 0, 0]);

    let walkers = heres.slice(0, 6);
    let waiters = [];

    const memo = {};

    while (walkers.length) {

        //console.time("x");
        // all walkers proceed to next stopping point
        walkers = walkers.map(here => walk(
            here,
            node => node.key.endsWith("Z"),
            memo
        ));
        //console.timeEnd("x");

        // who is in the lead?
        heres = [...waiters, ...walkers];
        const maxSteps = Math.max(...heres.map(x => x[1]));

        // decide who walks or waits next time
        [walkers, waiters] = heres.reduce(([walkers, waiters], here) =>
            [
                here[1] === maxSteps ? walkers : walkers.concat([here]),
                here[1] === maxSteps ? waiters.concat([here]) : waiters
            ],
            [[], []]
        );
        //console.log(waiters.length, waiters[0][1], walkers.length);

    }

    console.log("Part 2", waiters[0][1]);
    console.timeEnd("x");

}());



