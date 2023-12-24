import { test } from "../test.js";

const decodeInstructionParts = (meters, dir) => [
    dir === "0" ? "R" : dir === "1" ? "D" : dir === "2" ? "L" : "U",
    parseInt(meters, 16)
];

export const decodeInstruction = instruction => decodeInstructionParts(
    ...Array.from(/(.{5})(.)\)/.exec(instruction)).slice(1)
);

test("(#70c710)", ["R", 461937], decodeInstruction);
