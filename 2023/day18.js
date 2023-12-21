import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";


const input = 1;
const day = 18;
const raw = readFileSync(`day${day}-input${input}.txt`)
    .toString()
    .trim()
    .split("\n")
    .map(line => line.split("").map(x => parseInt(x)));

console.log(raw);
