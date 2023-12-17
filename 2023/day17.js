import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

console.log(raw);

test("12,34");
