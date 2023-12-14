import { readFileSync } from "node:fs";
import { test } from "./test.js";

Array.prototype.firstOrNull = function (strategy) {

    return this.reduce((found, x, i, xs) => found ?? strategy(x, i, xs), null);

};

const input = 2;
const day = 13;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const areLinesMirrored = (as, bs) =>
    as.length > 0 && bs.length > 0 && bs
        .map((seq, i) => [seq, as[as.length - 1 - i]])
        .every(([a, b]) => (typeof b === "undefined") || (a === b))
    ;

console.log("areLinesMirrored");
test(`[["##."],["##."]]`, true, x => areLinesMirrored(...JSON.parse(x)));
test(`[[],["##."]]`, false, x => areLinesMirrored(...JSON.parse(x)));
test(`[["##."], ["##.", "##."]]`, true, x => areLinesMirrored(...JSON.parse(x)));
test(`[["##.", "##."], ["##."]]`, true, x => areLinesMirrored(...JSON.parse(x)));

const validateMirrorPositionOrNull = (i, lines) =>
    areLinesMirrored(lines.slice(0, i), lines.slice(i))
        ? i
        : null
    ;

const filterTopBottomMirrorPosition = (position, except) =>
    (position !== except && position > 0)
        ? position
        : null
    ;

const topBottomMirror = (lines, except) =>
    lines.firstOrNull((_, i) =>
        filterTopBottomMirrorPosition(validateMirrorPositionOrNull(i, lines), except)
    )
    ;

const leftRightMirror = (lines, except) =>
    topBottomMirror(
        Array(lines[0].length)
            .fill("")
            .map((_, i) => lines.map(line => line[i]).join("")),
        except
    )
    ;

const part1Pattern = (lines, except) =>
    leftRightMirror(lines, except) || (100 * topBottomMirror(lines, except / 100))
    ;

console.log("part 1 pattern");
test("..\n..", 1, x => part1Pattern(x.split("\n"))); // left-right
test("#.\n#.", 100, x => part1Pattern(x.split("\n"))); // top-bottom
test("##.\n###", 1, x => part1Pattern(x.split("\n"))); // left-right
test("##\n..", 1, x => part1Pattern(x.split("\n"))); // left-right
test("...\n.##\n.##", 2, x => part1Pattern(x.split("\n"))); // left-right
test(".##\n.##\n.##", 2, x => part1Pattern(x.split("\n"))); // greedy left-right
test("...\n.##\n#..\n#..\n.##", 2, x => part1Pattern(x.split("\n"))); // top-bottom
test(".#..#\n.#..#", 3, x => part1Pattern(x.split("\n"))); // greedy left-right
test(`["#.##..##.", "..#.##.#.","##......#","##......#","..#.##.#.","..##..##.","#.#.##.#."]`, 5, x => part1Pattern(JSON.parse(x)));
test(`["#...##..#", "#....#..#", "..##..###", "#####.##.", "#####.##.", "..##..###", "#....#..#"]`, 400, x => part1Pattern(JSON.parse(x)));
test("###\n###\n### (except 1)", 2, () => part1Pattern("###\n###\n###".split("\n"), 1)); // left-right with exception

const startNewPattern = digest => digest.concat([[]]);

const addToPattern = (digest, line) => [
    ...digest.slice(0, digest.length - 1),
    digest[digest.length - 1].concat(line)
];

const part1 = lines =>
    lines
        .reduce((digest, line) => line ? addToPattern(digest, line) : startNewPattern(digest), [[]])
        .map(pattern => part1Pattern(pattern))
        .reduce((a, b) => a + b)
    ;

console.log("part 1");
test(("#.##..##.\n" +
    "..#.##.#.\n" +
    "##......#\n" +
    "##......#\n" +
    "..#.##.#.\n" +
    "..##..##.\n" +
    "#.#.##.#.\n" +
    "\n" +
    "#...##..#\n" +
    "#....#..#\n" +
    "..##..###\n" +
    "#####.##.\n" +
    "#####.##.\n" +
    "..##..###\n" +
    "#....#..#\n"), 405, x => part1(x.trim().split("\n")));

console.log("Part 1", part1(raw));

const toggledSymbol = (lines, y, x) =>
    lines[y][x] === "#" ? "." : "#";

const modifyPattern = (lines, y, x) =>
    lines.map((line, i) => i !== y
        ? line
        // line to modify
        : line.slice(0, x) + toggledSymbol(lines, y, x) + line.slice(x + 1));

const alternativeTo = (lines, except) =>
    lines
        // for each line
        .firstOrNull((line, y) =>
            // for each position in the line
            line.split("").firstOrNull((_, x) =>
                // find the first position where modifying the pattern produces anything except the original
                part1Pattern(
                    modifyPattern(lines, y, x),
                    except
                ) || null
            )
        )
    ;

const part2Pattern = lines =>
    alternativeTo(lines, part1Pattern(lines))
    ;

console.log("Part 2 pattern");
test(`["#.##..##.", "..#.##.#.", "##......#", "##......#", "..#.##.#.", "..##..##.", "#.#.##.#."]`, 300, x => part2Pattern(JSON.parse(x)));
test(`["#...##..#", "#....#..#", "..##..###", "#####.##.", "#####.##.", "..##..###", "#....#..#"]`, 100, x => part2Pattern(JSON.parse(x)));

const part2 = lines => lines
    .reduce((digest, line) => line ? addToPattern(digest, line) : startNewPattern(digest), [[]])
    .map(pattern => part2Pattern(pattern))
    .reduce((a, b) => a + b)
    ;

console.log("part 2");
test(("#.##..##.\n" +
    "..#.##.#.\n" +
    "##......#\n" +
    "##......#\n" +
    "..#.##.#.\n" +
    "..##..##.\n" +
    "#.#.##.#.\n" +
    "\n" +
    "#...##..#\n" +
    "#....#..#\n" +
    "..##..###\n" +
    "#####.##.\n" +
    "#####.##.\n" +
    "..##..###\n" +
    "#....#..#\n"), 400, x => part2(x.trim().split("\n")));

console.log("Part 2", part2(raw));
