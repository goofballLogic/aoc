import { readFileSync } from "node:fs";
const input = 2;
const day = 11;
const raw = readFileSync(`day${day}-input${input}.txt`).toString().trim().split("\n");

const emptyColumnIndexes = lines => lines[0]
    .map((_, i) => lines.every(line => line[i] === ".") ? i : null)
    .filter(i => i !== null)
    ;

const expandColumns = (lines, columnIndexes) => lines
    .map(line => line
        .flatMap((node, i) => columnIndexes.includes(i) ? [node, node] : [node]))
    ;

const expandEmptyRows = lines =>
    lines.flatMap(line => line.join("").match(/^\.*$/) ? [line, line] : [line])
    ;

const expandEmptyColumns = lines =>
    expandColumns(lines, emptyColumnIndexes(lines))
    ;

const expandEmptyRowsAndColumns = lines =>
    expandEmptyColumns(expandEmptyRows(lines))
    ;

let number = 0;

const labelLocations = (line, i) =>
    line.map(node => node === "#" ? `${i}_${number++}` : node);

const distance = (a, b) =>
    Math.abs(b.y - a.y) + Math.abs(b.x - a.x);

(function part1() {

    const data =
        expandEmptyRowsAndColumns(
            raw.map(line => line.split(""))
        )
            .map(labelLocations)
            //.map(line => console.log(line.map(x => `    ${x}`.substring(x.length - 1)).join("")) || line)
            .map((line, y) => line.map((node, x) => ({ x, y, node })))
            .flatMap(line => line)
            .filter(node => node.node !== ".")
            .map((source, i, nodes) => nodes.slice(i + 1).map(dest => distance(source, dest)))
            .flatMap(paths => paths)
            .reduce((a, b) => a + b)
        ;


    console.log("Part 1", data);

}());

const expansion = 1000000;

const expandNodeUniverse = (node, { emptyRowIndexes, emptyColumnIndexes }) => ({
    ...node,
    x: node.x + (expansion - 1) * (emptyColumnIndexes.filter(index => index < node.x).length),
    y: node.y + (expansion - 1) * (emptyRowIndexes.filter(index => index < node.y).length)
});

(function part2() {

    const emptyRowIndexes = raw
        .map((row, i) => row.includes("#") ? null : i)
        .filter(x => x !== null)
        ;

    const emptyColumnIndexes = raw[0]
        .split("")
        .map((_, i) => raw.every(line => line[i] === ".") ? i : null)
        .filter(x => x !== null)
        ;

    console.log(emptyRowIndexes);
    console.log(emptyColumnIndexes);

    const data = raw
        .flatMap((line, y) => line.split("").map((node, x) => ({ x, y, node })))
        .filter(node => node.node !== ".")
        .map(node => expandNodeUniverse(node, { emptyRowIndexes, emptyColumnIndexes }))
        .map(x => console.log(x) || x)
        .map((source, i, nodes) => nodes.slice(i + 1).map(dest => distance(source, dest)))

        .flatMap(paths => paths)
        .reduce((a, b) => a + b)
        ;

    console.log("Part 2", data);

}());
