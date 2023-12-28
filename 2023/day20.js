import { readFileSync } from "node:fs";
import "./evil.js";
import { test } from "./test.js";

const HIGH = true, LOW = false;
const input = 3;
const day = 20;

const parse = filename =>
    readFileSync(filename)
        .toString()
        .trim()
        .split("\n")
        .map(x => x.split("//")[0].trim())
        .map(x => x.split(" -> "))
        .map(([a, b]) => [
            (a === "broadcaster" ? a : a.slice(1)),
            [
                a === "broadcaster" ? "B" : a[0],
                ...b.split(", ")
            ]
        ])
        .pipe(Object.fromEntries)
    ;

const filename = `day${day}-input${input}.txt`;

const raw = parse(filename);

const flipFlop = (me, dest, stateMap) => {

    return (_src, signal) => {

        if (signal === HIGH) return [];
        const wasOn = stateMap.includes(me);
        if (wasOn)
            stateMap.splice(stateMap.indexOf(me), 1);
        else
            stateMap.push(me);
        return dest.map(d => [me, (!wasOn) ? HIGH : LOW, d])

    };

};


const conj = (me, dest, stateMap, inputs) => {

    if (inputs.length === 1)
        return (_, signal) => dest.map(d => [me, !signal, d]);
    else
        return (src, signal) => {

            const key = `${me}_${src}`;
            if (signal === LOW) {
                if (stateMap.includes(key))
                    stateMap.splice(stateMap.indexOf(key), 1);
            } else if (signal === HIGH)
                if (!stateMap.includes(key))
                    stateMap.push(key);
            return inputs.every(input => stateMap.includes(`${me}_${input}`))
                ? dest.map(d => [me, LOW, d])
                : dest.map(d => [me, HIGH, d]);

        };

};

const broadcaster = (me, dest) =>
    (_src, signal) => dest.map(d => [me, signal, d]);

const ops = {
    "B": broadcaster,
    "%": flipFlop,
    "&": conj
};

const tick = (map) => {

    const mapEntries = Object.entries(map);
    const stateMap = [];
    const ports = Object.fromEntries(
        mapEntries
            .map(([key, config]) => [key, ops[config[0]], config.slice(1)])
            .map(([key, op, dest]) => [key, op(
                key,
                dest,
                stateMap,
                mapEntries
                    .map(([a, b]) => b.includes(key) ? a : null)
                    .filter(x => x)
            )]));

    const readThrough = (src, signal, dest) => {

        const result = ports[dest](src, signal);
        stateMap.sort();
        return result;

    }

    return ([[src, signal, dest], ...rest]) =>
        (dest in ports)
            ? readThrough(src, signal, dest)
                .pipe(outputs => rest.concat(outputs || []))
            : rest
        ;

};

const tickMap = (map, iterations) => {

    const ticker = tick(map);
    let state = [[null, LOW, "broadcaster"]];
    for (var i = 0; i < iterations; i++)
        state = ticker(state);
    return state;

}

test(
    "Sample 1, LOW, tick",
    [["broadcaster", LOW, "a"], ["broadcaster", LOW, "b"], ["broadcaster", LOW, "c"]],
    () => tickMap(parse("day20-input1.txt"), 1)
);

test(
    "Sample 1, LOW, tick x 4",
    [["a", HIGH, "b"], ["b", HIGH, "c"], ["c", HIGH, "inv"]],
    () => tickMap(parse("day20-input1.txt"), 4)
);

test(
    "Sample 1, LOW, tick x 7",
    [["inv", LOW, "a"]],
    () => tickMap(parse("day20-input1.txt"), 7)
);

test(
    "Sample 1, LOW, tick x 8",
    [["a", LOW, "b"]],
    () => tickMap(parse("day20-input1.txt"), 8)
);

test(
    "Sample 1, LOW, tick x 9",
    [["b", LOW, "c"]],
    () => tickMap(parse("day20-input1.txt"), 9)
);

test(
    "Sample 1, LOW, tick x 10",
    [["c", LOW, "inv"]],
    () => tickMap(parse("day20-input1.txt"), 10)
);

test(
    "Sample 1, LOW, tick x 11",
    [["inv", HIGH, "a"]],
    () => tickMap(parse("day20-input1.txt"), 11)
);

test(
    "Sample 1, LOW, tick x 12",
    [],
    () => tickMap(parse("day20-input1.txt"), 12)
);

const tickThrough = (ticker, state) => {

    const sent = [];
    while (state?.length) {

        sent.push(state[0]);
        state = ticker(state);

    }
    return sent;

};

test(
    "Sample 2, tickThrough",
    [
        ["button", LOW, "broadcaster"],
        ["broadcaster", LOW, "a"],
        ["a", HIGH, "inv"],
        ["a", HIGH, "con"],
        ["inv", LOW, "b"],
        ["con", HIGH, "output"],
        ["b", HIGH, "con"],
        ["con", LOW, "output"]
    ],
    () => {

        const ticker = tick(parse("day20-input2.txt"));
        return tickThrough(ticker, [["button", LOW, "broadcaster"]]);

    }

);

test(
    "Sample 2, tickThrough x 3",
    [
        ["button", LOW, "broadcaster"],
        ["broadcaster", LOW, "a"],
        ["a", HIGH, "inv"],
        ["a", HIGH, "con"],
        ["inv", LOW, "b"],
        ["con", LOW, "output"],
        ["b", LOW, "con"],
        ["con", HIGH, "output"]
    ],
    () => {

        const ticker = tick(parse("day20-input2.txt"));
        tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        return tickThrough(ticker, [["button", LOW, "broadcaster"]]);

    }
);


test(
    "Sample 2, tickThrough x 4",
    [
        ["button", LOW, "broadcaster"],
        ["broadcaster", LOW, "a"],
        ["a", LOW, "inv"],
        ["a", LOW, "con"],
        ["inv", HIGH, "b"],
        ["con", HIGH, "output"]
    ],
    () => {

        const ticker = tick(parse("day20-input2.txt"));
        tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        return tickThrough(ticker, [["button", LOW, "broadcaster"]]);

    }
);

const part1 = map => {

    let countHigh = 0, countLow = 0;
    let iterations = 1000;
    const ticker = tick(map);
    while (iterations-- > 0) {

        const sent = tickThrough(ticker, [["button", LOW, "broadcaster"]]);
        const sentHighCount = sent.filter(([_, x]) => x === HIGH).length
        countHigh += sentHighCount;
        countLow += sent.length - sentHighCount;

    }
    return countLow * countHigh;

}

test("Part 1, input 1", 32000000, () => part1(parse("day20-input1.txt")));
test("Part 1, input 2", 11687500, () => part1(parse("day20-input2.txt")));

console.time("Part 1");
console.log("Part 1", part1(raw));
console.timeEnd("Part 1");

const traceRoute = (nodeKey, map, finishKey) => {

    let processing = [nodeKey];
    const routeMap = {};
    while (processing.length) {

        nodeKey = processing.shift();
        if (nodeKey in routeMap) continue;
        const node = map[nodeKey];
        if (node && nodeKey !== finishKey) {
            routeMap[nodeKey] = node;
            processing = processing.concat(node.slice(1));
        }

    }
    return routeMap;

}
    ;

const divide = (map, start, finishKey) => {

    const [startOp, ...nodes] = map[start];
    return nodes.map(nodeKey => ({
        ...traceRoute(nodeKey, map, finishKey),
        [start]: [startOp, nodeKey]
    }));

}
    ;

const part2 = map =>
    divide(map, "broadcaster", "rx")
        .map(bit => {
            const ticker = tick(bit);
            let count = 0;
            while (count < 1_000_000) {
                count++;
                const sent = tickThrough(ticker, [["button", LOW, "broadcaster"]]);
                if (sent.some(x => x[1] === LOW && x[2] === "rx"))
                    return count;
            }

        })
        .pipe(ns => ns.reduce((a, b) => a * b))

    ;

console.time("Part 2");
console.log("Part 2", part2(raw));
console.timeEnd("Part 2");
