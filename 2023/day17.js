import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 1;
const day = 17;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

test("12\n34", 6);
test("13\n24", 6)
test("11111\n22222", 7);
test("1234\n1234\n1234", 11);
test("11111\n11191\n11191\n11191\n99991");
