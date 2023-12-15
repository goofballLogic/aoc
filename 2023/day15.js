import { readFileSync } from "node:fs";
import { test } from "./test.js";
import "./evil.js";

const input = 2;
const day = 15;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split(",");

const processNext = (next, hash) =>
    ((hash + next.charCodeAt(0)) * 17) % 256

test("Process next", 200, () => processNext("H", 0));

const hashString = (value, sum = 0) =>
    value
        ? hashString(value.slice(1), processNext(value[0], sum))
        : sum;

test("Hash string", 52, () => hashString("HASH"));

const hashStrings = strings =>
    strings
        .map(value => hashString(value))
        .sum();
;

test("Hash strings", 1320, () => hashStrings("rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7".split(",")));

console.log("Part 1", hashStrings(raw));


const appendLens = (box, { label, num }) =>
    [...box, [label, num]]
    ;

test("append Lens", [["aa", 1], ["bb", 2]], () => appendLens([["aa", 1]], { label: "bb", num: 2 }));

const swapLens = (box, { label, num }) =>
    box.map(lens => lens[0] === label ? [label, num] : lens)
    ;

test("swap lens", [["aa", 1], ["bb", 33], ["cc", 3]], () => swapLens([["aa", 1], ["bb", 2], ["cc", 3]], { label: "bb", num: 33 }));

const insertLens = (box, { label, num }) =>
    box.some(lens => lens[0] === label)
        ? swapLens(box, { label, num })
        : appendLens(box, { label, num })
    ;

test("insert lens - swap", [["aa", 1], ["bb", 33], ["cc", 3]], () => insertLens([["aa", 1], ["bb", 2], ["cc", 3]], { label: "bb", num: 33 }))
test("insert lens - append", [["aa", 1]], () => insertLens([], { label: "aa", num: 1 }));
test("insert lens - append 2", [["aa", 1], ["bb", 2]], () => insertLens([["aa", 1]], { label: "bb", num: 2 }));

const removeLens = (box, { label }) =>
    box.filter(lens => lens[0] !== label)
    ;

const modifyBox = (box, { label, op, num }) => //console.log("Modify", box, label, op, num) ||
    op === "="
        ? insertLens(box, { label, num })
        : removeLens(box, { label })
    ;

test("modify box - insert lens", [["aa", 1]], () => modifyBox([], { label: "aa", op: "=", num: 1 }));
test("modify box - remove lens", [["aa", 1]], () => modifyBox([["aa", 1], ["bb", 2]], { label: "bb", op: "-" }));

const applyBit = ({ result, bit: [label, op, num, hash] }) =>
    result.map((box, i) => (i === hash)
        ? modifyBox(box, { label, op, num })
        : box);

test("apply bit", [[["bb", 40]], [["aa", 33]], []], () => applyBit({
    result: [[["bb", 40]], [], []],
    bit: ["aa", "=", 33, 1]
}));

const size256 = xs =>
    xs.length > 256
        ? xs.slice(0, 255)
        : xs.concat(Array(256 - xs.length).fill([]))
    ;

const part2Mutation = bits =>
    bits
        .map(bit => Array.from(/^([a-z]*)(.)(.*)$/.exec(bit)).slice(1))
        .map(bit => bit.concat(hashString(bit[0])))
        .map(([label, op, num, hash]) =>
            [label, op, (op === "=" ? parseInt(num) : null), hash])
        .reduce(
            (result, bit) => applyBit({ result, bit }),
            size256([]))
    ;

const lastPopulatedArrayIndex = xs =>
    xs.length - [...xs].reverse().findIndex(x => x?.length) - 1
    ;

const trimArr = xs =>
    xs.slice(0, lastPopulatedArrayIndex(xs) + 1)
    ;

test("Part 2 mutation: rn=1,cm-",
    [[["rn", 1]]],
    () => part2Mutation(["rn=1", "cm-"]).pipe(trimArr));
test("Part 2 mutation: rn=1,cm-,qp=3",
    [[["rn", 1]], [["qp", 3]]],
    () => part2Mutation(["rn=1", "cm-", "qp=3"]).pipe(trimArr));
test("Part 2 mutation: rn=1,cm-,qp=3,cm=2",
    [[["rn", 1], ["cm", 2]], [["qp", 3]]],
    () => part2Mutation(["rn=1", "cm-", "qp=3", "cm=2"]).pipe(trimArr));
test("Part 2 mutation: rn=1,cm-,qp=3,cm=2,qp-",
    [[["rn", 1], ["cm", 2]]],
    () => part2Mutation(["rn=1", "cm-", "qp=3", "cm=2", "qp-"]).pipe(trimArr));
test("Part 2 mutation: rn=1,cm-,qp=3,cm=2,qp-,pc=4",
    [[["rn", 1], ["cm", 2]], [], [], [["pc", 4]]],
    () => part2Mutation(["rn=1", "cm-", "qp=3", "cm=2", "qp-", "pc=4"]).pipe(trimArr));
test("Part 2 mutation: rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
    [[["rn", 1], ["cm", 2]], [], [], [["ot", 7], ["ab", 5], ["pc", 6]]],
    () => part2Mutation(["rn=1", "cm-", "qp=3", "cm=2", "qp-", "pc=4", "ot=9", "ab=5", "pc-", "pc=6", "ot=7"]).pipe(trimArr));

const scoreBox = (lenses, boxIndex) =>
    lenses
        .map((lens, lensIndex) => (lensIndex + 1) * (boxIndex + 1) * lens[1])
        .sum()
    ;

const part2Score = boxes =>
    boxes
        .map(scoreBox)
        .sum()
    ;

test(`Part 2 power: [[["rn", 1], ["cm", 2]], [], [], [["ot", 7], ["ab", 5], ["pc", 6]]]`,
    145,
    () => part2Score([[["rn", 1], ["cm", 2]], [], [], [["ot", 7], ["ab", 5], ["pc", 6]]]));

const part2 = bits =>
    bits
        .pipe(part2Mutation)
        .pipe(part2Score)
    ;

test("Part 2: rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
    145,
    () => part2("rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7".split(",")));

console.log("Part 2", part2(raw));
