import { readFileSync } from "node:fs";
import { test } from "./test.js";
const input = 2;
const day = 12;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const parseLineGroups = groups =>
    groups
        .split(",")
        .map(x => parseInt(x))
    ;

const parseLineParts = ([symbols, groups]) => //console.log(symbols, groups) ||
({
    symbols: symbols, // parseLineSymbols(symbols),
    groups: parseLineGroups(groups)
});

const parseLine = line =>
    parseLineParts(line.split(" "))
    ;

const findFits = (symbols, groupSize) =>
    symbols
        .split("")
        // for each position in the remaining symbols
        .map((_, i) => [i, symbols.substring(i, i + groupSize)])
        // enough characters left for this group?
        .filter(([_, candidate]) => candidate.length === groupSize)
        // no known # characters can been bypassed
        .filter((_, i) => !symbols.substring(0, i).includes("#"))
        // all characters must be either ? or #
        .filter(([_, candidate]) => candidate.match(/^(\?|#)*$/))
        // this group can't be followed by a known #
        .filter(([i]) => symbols[i + groupSize] !== "#")
        // return the position and the remaining symbols
        .map(([i]) => [i, symbols.substring(i + groupSize + 1)])
    ;

const memos = {};

const accumulateFitsForLine = ({ symbols, groups, debug = [] }, i) => {

    const key = symbols + "_" + groups.join("_");
    if (key in memos) return memos[key];

    if (!groups.length) return 0;
    // 2) if this is the last group
    if (groups.length === 1) {
        // 3)   return the number of possible positions within the symbols
        const result = findFits(symbols, groups[0])
            // we can't be left with any known # over
            .filter(([_, remainingSymbols]) => !remainingSymbols.includes("#"))
            .length;
        memos[key] = result;
        return result;
        // 4) else
    } else {
        let count = 0;
        // 5)   for each possible position, consume necessary symbols and
        for (let [i, remainingSymbols] of findFits(symbols, groups[0])) {
            // 6)       add recursive call for remaining symbols and groups
            count += accumulateFitsForLine({
                symbols: remainingSymbols,
                groups: groups.slice(1),
                debug: debug.concat([[symbols, i, groups[0], remainingSymbols]])
            });
        }
        memos[key] = count;
        return count;
    }

};

const part1 = lines =>
    lines
        .map(parseLine)
        .map(accumulateFitsForLine)
        .reduce((a, b) => a + b)
    ;

test("??? 1", 3, x => part1([x]));
test("?.? 1", 2, x => part1([x]));
test("??? 2", 2, x => part1([x]));
test("??? 1,1", 1, x => part1([x]));
test("?.#.? 1,1", 2, x => part1([x]));
test("?.#.? 1,1,1", 1, x => part1([x]));
test("#.? 1,1", 1, x => part1([x]));
test("?# 1", 1, x => part1([x]));
test("#? 1", 1, x => part1([x]));
test("?? 1", 2, x => part1([x]));
test("###.. 3", 1, x => part1([x]));
test("###.? 3,1", 1, x => part1([x]));
test("###?.? 3", 1, x => part1([x]));
test("###?.?? 3,1", 2, x => part1([x]));
test(`["###.? 3,1","###?.?? 3,1"]`, 1 + 2, x => part1(JSON.parse(x)));
test("???.### 1,1,3", 1, x => part1([x]));
test(".??..??...?##. 1,1,3", 4, x => part1([x]));
test("?#?#?#?#?#?#?#? 1,3,1,6", 1, x => part1([x]));
test("????.#...#... 4,1,1", 1, x => part1([x]));
test("????.######..#####. 1,6,5", 4, x => part1([x]));
test("?###???????? 3,2,1", 10, x => part1([x]));
test("#??#???.??#?#?#??#?. 6,8,2", 1, x => part1([x]));
test("?????????#?#.#?.?.# 4,3,1,1,1", 8, x => part1([x]));
test("???? 2,1", 1, x => part1([x]));

console.log("Part 1", part1(raw));

const unfoldLine = ({ symbols, groups }) => ({
    symbols: Array(5).fill(symbols).join("?"),
    groups: Array(5).fill(groups).flatMap(x => x)
});

const part2 = lines =>
    lines
        .map(parseLine)
        .map(unfoldLine)
        .map((x, i) => accumulateFitsForLine(x))
        .reduce((a, b) => a + b)
    ;

test(".# 1", 1, x => part2([x]));
test("???.### 1,1,3", 1, x => part2([x]));
test(".??..??...?##. 1,1,3", 16384, x => part2([x]));
test("?#?#?#?#?#?#?#? 1,3,1,6", 1, x => part2([x]));
test("????.#...#... 4,1,1", 16, x => part2([x]));
test("????.######..#####. 1,6,5", 2500, x => part2([x]));
test("?###???????? 3,2,1", 506250, x => part2([x]));

console.log("Part 2", part2(raw));
