import { readFileSync } from "node:fs";
const filename = "day3-input2.txt";
const raw = readFileSync(filename).toString().trim().split("\n");
console.log(raw.join("\n"));

const findMatches = line => Array.from(line.matchAll(/(\d+)|([^\.])/dg));

const parseLine = line => findMatches(line).map(match => [
    match[1] ? parseInt(match[1]) : match[2],
    ...match.indices[0],
    !match[1]
]);

const startOf = xs => xs[1];
const endOf = xs => xs[2];
const valueOf = xs => xs[0];
const isSymbol = xs => xs[3];
const not = fn => x => !fn(x);

(function part1() {

    const isTouchingSymbol = xs => !!xs[4];

    const isAdjacent = (seq, pos) => (pos >= (startOf(seq) - 1)) && (pos <= endOf(seq));

    const beforeSymbol = (seq, next) => Array.isArray(next) && (startOf(next) === endOf(seq)) && isSymbol(next);

    const afterSymbol = (seq, prev) => Array.isArray(prev) && (startOf(seq) === endOf(prev)) && isSymbol(prev);

    const aboveSymbol = (seq, nextLine) => Array.isArray(nextLine) && nextLine
        .filter(isSymbol)
        .map(nextLineSeq => startOf(nextLineSeq))
        .some(pos => isAdjacent(seq, pos));

    const underSymbol = (seq, prevLine) => Array.isArray(prevLine) && prevLine
        .filter(isSymbol)
        .map(prevLineSeq => startOf(prevLineSeq))
        .some(pos => isAdjacent(seq, pos));

    const horizontalAnalysis = line => line.map(
        (seq, i) => (beforeSymbol(seq, line[i + 1]) || afterSymbol(seq, line[i - 1]))
            ? [...seq, "h"]
            : seq);

    const verticalAnalysis = (line, i, lines) => line.map(
        seq => (aboveSymbol(seq, lines[i + 1]) || underSymbol(seq, lines[i - 1]))
            ? [...seq, "v"]
            : seq);

    const data1 = raw
        .map(parseLine)
        .map(horizontalAnalysis)
        .map(verticalAnalysis)
        .flatMap(x => x)
        .filter(isTouchingSymbol)
        .filter(not(isSymbol))
        .map(valueOf)
        .reduce((a, b) => a + b, 0)
        ;

    console.log(data1);

}());

(function part2() {

    const ratios = (symbol, line) => line
        .filter(maybeNumber => not(isSymbol)(maybeNumber))
        .filter(maybeRatio => (startOf(maybeRatio) <= startOf(symbol) + 1) && endOf(maybeRatio) >= startOf(symbol))
        .flatMap(valueOf)
        ;

    const adjacentNumbers = (symbol, nearLines) => nearLines
        .map(line => ratios(symbol, line))
        .filter(seq => seq.length)
        .flatMap(x => x)
        ;

    const collectAllRatios = (line, i, lines) => line
        .filter(seq => isSymbol(seq))
        .map(symbol => adjacentNumbers(symbol, [lines[i - 1], line, lines[i + 1]]))
        .filter(adjacents => adjacents.length === 2);
    ;

    const data2 = raw
        .map(parseLine)
        .flatMap(collectAllRatios)
        .reduce((sum, [r1, r2]) => sum += r1 * r2, 0)
        ;

    console.log(data2);

}());
