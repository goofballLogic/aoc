import { readFileSync } from "node:fs";
const filename = "day6-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");

console.log(raw.join("\n"));


function marginOfError([time, record]) {

    const wins = [];
    for (let speed = 0; speed < time; speed++) {

        const distance = speed * (time - speed);
        if (speed > 0 && speed % 10000000 === 0) console.log(speed, time);
        if (distance > record) wins.push(speed);

    }
    return wins.length;

}

(function part1() {


    const parsed = raw
        .map(line => line.split(" ").filter(x => x).slice(1).map(x => parseInt(x)))
        .reduce((output, line, i) => i === 0 ? [...line] : line.map((x, j) => [output[j], x]), null)
        ;

    console.log("\nParsed", parsed);

    const data = parsed
        .map(marginOfError)
        .reduce((a, b) => a * b)
        ;

    console.log("Part 1", data);

}());

(function part2() {

    const parsed = raw
        .map(x => x.split(":").map(y => y.trim()))
        .map(([_label, numbers]) => parseInt(numbers.replace(/ /g, "")))
        ;

    console.log("\nParsed", parsed);

    const data = marginOfError(parsed)
        ;

    console.log("Part 2", data);

}())

