import { readFileSync } from "node:fs";
const filename = "day4-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");
console.log(raw.join("\n"));

const data = raw
    .map(line => line.split(":")[1])
    .map(numbers => numbers.split("|").map(x => x.trim().split(" ").filter(x => x).map(x => parseInt(x))))
    .map(([wins, trys]) => trys.filter(t => wins.includes(t)))
    .map(lineWins => lineWins.length)
    ;

const problem1 = data
    .map(length => length > 0 ? Math.pow(2, length - 1) : 0)
    .reduce((a, b) => a + b)
    ;

console.log(problem1);

const problem2 = data
    .reduce(
        ([count, instances], wins) => [
            count + instances.filter(x => x).length + 1,
            [...instances.map(i => i > 1 ? i - 1 : 0).filter(x => x), ...Array(wins ? instances.length + 1 : 0).fill(wins)],
            0
        ],
        [0, [], 0]
    )[0]
    ;

console.log(problem2);
