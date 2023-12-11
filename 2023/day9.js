import { readFileSync } from "node:fs";
const input = 2;
const day = 9;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n")
    .map(x => x.split(" ").map(x => parseInt(x)))
    ;

console.log(raw);

const lastOf = xs => xs && xs[xs.length - 1];

const solveLine = line => {

    const ret = [line];
    while (!line.every(x => x === 0)) {

        line = line.slice(1).map((x, i) => x - line[i]);
        ret.unshift(line);

    }
    ret.forEach((line, i) => {

        const lastMeasurement = lastOf(line);
        const previousExtrapolation = lastOf(ret[i - 1]) || 0;
        line.push(lastMeasurement + previousExtrapolation);

    });
    return ret;

};

(function part1() {

    const data = raw
        .map(solveLine)
        .map(lastOf)
        .map(lastOf)
        .reduce((a, b) => a + b)
        ;

    console.log(data);

}());


(function part1() {

    const data = raw
        .map(xs => xs.reverse())
        .map(solveLine)
        .map(lastOf)
        .map(lastOf)
        .reduce((a, b) => a + b)
        ;

    console.log(data);

}());
