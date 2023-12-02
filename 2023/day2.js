import { readFileSync } from "node:fs";
const filename = "day2-input2.txt";

const parseGame = game => parseInt(game.split(" ")[1]);

const parseQuantityValues = ([a, b]) => [b[0], parseInt(a)];

const parseCubeQuantity = quantity => parseQuantityValues(quantity.trim().split(" "));

const parseCubeGroup = group => Object.fromEntries(group.trim().split(",").map(parseCubeQuantity));

const parseHandful = handful => handful.trim().split(";").map(parseCubeGroup);

const parseLineSegments = ([game, handful]) => ([parseGame(game), parseHandful(handful)]);

const parseLine = line => parseLineSegments(line.split(":"));

const data = readFileSync(filename).toString().trim().split("\n").map(parseLine);

// problem 1

const validateHandfuls = ([, handfuls]) => handfuls.every(({ r = 0, g = 0, b = 0 }) => r < 13 && g < 14 && b < 15);

const problem1 = data.filter(validateHandfuls).reduce((sum, [game]) => sum + game, 0);

console.log(problem1);

// problem 2

const handfulPower = (({ r, g, b }) => r * g * b);

const buildMaxHandful = (
    { r: r1 = 0, b: b1 = 0, g: g1 = 0 },
    { r: r2 = 0, g: g2 = 0, b: b2 = 0 }) => ({
        r: Math.max(r1, r2),
        g: Math.max(g1, g2),
        b: Math.max(b1, b2)
    });

const maxHandfulPower = ([, handfuls]) => handfulPower(handfuls.reduce(buildMaxHandful));

const problem2 = data.map(maxHandfulPower).reduce((a, b) => a + b);

console.log(problem2);

